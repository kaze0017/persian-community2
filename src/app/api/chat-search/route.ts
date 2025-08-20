// src/app/api/chat-search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// ✅ Safety checks
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
if (!process.env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY is not set');

// ✅ Init clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// ✅ Your three indexes
const indexes = {
  events: pinecone.Index('events-index'),
  workshops: pinecone.Index('workshops-index'),
  businesses: pinecone.Index('businesses-index'),
};

// ✅ In-memory session store (replace with DB/Redis in prod)
const sessionStore: Record<string, { messages: any[] }> = {};

export async function POST(req: NextRequest) {
  const { query, sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  // 🔹 Initialize session if needed
  if (!sessionStore[sessionId]) {
    sessionStore[sessionId] = {
      messages: [
        {
          role: 'system',
          content: `
You are a helpful assistant that talks simply.
Rules:
- If the user asks about events, workshops, or businesses,
  reply ONLY with JSON in this exact format:
  {"action":"search","category":"events"}
  {"action":"search","category":"workshops"}
  {"action":"search","category":"businesses"}
- Otherwise, just answer normally (no JSON, no URLs).
`.trim(),
        },
      ],
    };
  }

  const history = sessionStore[sessionId].messages;

  // 🔹 Add user query to history
  history.push({ role: 'user', content: query });

  // 1️⃣ Ask GPT if it’s chat or search
  const gptRes = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: history,
  });

  const assistantMessage = gptRes.choices[0].message.content ?? '';
  history.push({ role: 'assistant', content: assistantMessage });

  // 2️⃣ Try to parse action
  let action: 'search' | null = null;
  let category: keyof typeof indexes = 'events';
  let jsonStr = assistantMessage.trim();

  try {
    const parsed = JSON.parse(jsonStr);
    if (
      parsed.action === 'search' &&
      ['events', 'workshops', 'businesses'].includes(parsed.category)
    ) {
      action = 'search';
      category = parsed.category;
    }
  } catch {
    // normal chat → nothing to parse
  }

  // 3️⃣ If search, query Pinecone
  let results: any[] = [];
  let naturalReply = assistantMessage;
  let resultUrl: string | null = null;

  if (action === 'search') {
    // Embed the user query
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const embedding = embeddingRes.data[0].embedding.slice(0, 1024);

    // Pinecone search
    const searchRes = await indexes[category].query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    results = searchRes.matches.map((m) => ({ ...m.metadata, id: m.id }));

    // 4️⃣ Ask GPT to summarize AND pick results
    const gptAnswer = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are summarizing search results.
            Return ONLY JSON in this format:
            {"answer":"...","selectedIds":["id1","id2"]}
            - The "selectedIds" must ONLY contain the "id" field values from results, never the name or title.`,
        },
        { role: 'user', content: `User asked: ${query}` },
        { role: 'assistant', content: JSON.stringify({ results }) },
      ],
    });

    let selectedIds: string[] = [];
    try {
      const parsed = JSON.parse(gptAnswer.choices[0].message.content ?? '{}');
      naturalReply = parsed.answer ?? assistantMessage;
      selectedIds = parsed.selectedIds ?? [];
    } catch {
      naturalReply = assistantMessage;
    }

    // 5️⃣ Build /results link with only GPT-picked IDs
    const baseUrl = req.nextUrl.origin;
    if (selectedIds.length > 0) {
      const idsToLink = selectedIds.map((id) => `${id}:${category}`);
      resultUrl = `${baseUrl}/results?items=${encodeURIComponent(idsToLink.join(','))}`;
    }
  }

  // 6️⃣ Return to frontend
  return NextResponse.json({
    answer: naturalReply,
    link: resultUrl,
    type: action ? category : null,
    results,
    sessionId,
  });
}
