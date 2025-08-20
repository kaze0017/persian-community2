import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getBusinesses } from '@/lib/businesses';

if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
if (!process.env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY is not set');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index('businesses-index');

export async function POST(req: NextRequest) {
  const businesses = await getBusinesses();

  const results = [];

  for (const business of businesses) {
    const title = business.businessName || '';
    const category = business.category || '';
    const address = business.address || '';

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: `${title} - ${address} - ${category}`,
    });

    let vector = embeddingRes.data[0].embedding.slice(0, 1024);

    // Upsert into Pinecone
    await index.upsert([
      {
        id: business.id,
        values: vector,
        metadata: { title, address, category },
      },
    ]);

    results.push({ id: business.id, title });
  }

  return NextResponse.json({ uploaded: results.length, businesses: results });
}
