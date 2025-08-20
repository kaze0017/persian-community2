import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getFeaturedWorkshops } from '@/lib/workShops';

if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
if (!process.env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY is not set');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index('workshops-index');

export async function POST(req: NextRequest) {
  const workshops = await getFeaturedWorkshops();

  const results = [];

  for (const workshop of workshops) {
    const title = workshop.title || '';
    const description = workshop.description || '';
    const category = workshop.category || '';
    const date = workshop.startDate || '';

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: `${title} - ${description} - ${category}`,
    });

    let vector = embeddingRes.data[0].embedding.slice(0, 1024);

    // Upsert into Pinecone
    await index.upsert([
      {
        id: workshop.id,
        values: vector,
        metadata: { title, description, date, category },
      },
    ]);

    results.push({ id: workshop.id, title });
  }

  return NextResponse.json({ uploaded: results.length, workshops: results });
}
