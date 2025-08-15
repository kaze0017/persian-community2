// src/app/api/chat-search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Check API keys
if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
if (!process.env.PINECONE_API_KEY) throw new Error("PINECONE_API_KEY is not set");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index('events-index');

// Named export for POST method
export async function POST(req: NextRequest) {
  const { query } = await req.json();

  // 1. Convert query to embedding
  const embeddingRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const embedding = embeddingRes.data[0].embedding.slice(0, 1024); // Ensure 1024 dimensions

  // 2. Search in Pinecone
  const searchRes = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  const events = searchRes.matches.map(m => m.metadata);

  // 3. Generate answer using GPT
  const answerRes = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an assistant recommending events.' },
      { role: 'user', content: `These are the events: ${JSON.stringify(events)}. Now answer: ${query}` },
    ],
  });

  return NextResponse.json({
    answer: answerRes.choices[0].message.content,
    events,
  });
}
