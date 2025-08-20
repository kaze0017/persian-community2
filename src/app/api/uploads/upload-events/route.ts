import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getFeaturedEvents } from '@/lib/events';

if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
if (!process.env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY is not set');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index('events-index');

export async function POST(req: NextRequest) {
  const events = await getFeaturedEvents();

  const results = [];

  for (const event of events) {
    const title = event.title || '';
    const description = event.description || '';
    const category = event.category || '';
    const date = event.date || '';

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: `${title} - ${description} - ${category}`,
    });

    let vector = embeddingRes.data[0].embedding.slice(0, 1024);

    // Upsert into Pinecone
    await index.upsert([
      {
        id: event.id,
        values: vector,
        metadata: { title, description, date, category },
      },
    ]);

    results.push({ id: event.id, title });
  }

  return NextResponse.json({ uploaded: results.length, events: results });
}
