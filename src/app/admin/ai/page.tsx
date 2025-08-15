// src/app/upload-events/page.tsx
import React from 'react';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getFeaturedEvents } from '@/lib/events';

if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
if (!process.env.PINECONE_API_KEY)
  throw new Error('PINECONE_API_KEY is not set');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Pinecone client with API key
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index('events-index'); // should be 2048-dim

export default async function UploadEventsPage() {
  const events = await getFeaturedEvents();
  console.log('events', events);

  for (const event of events) {
    const title = event.title || '';
    const description = event.description || '';
    const category = event.category || '';
    const date = event.date || '';

    // Create embedding (returns 1536-dim)
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: `${title} - ${description} - ${category}`,
    });

    let vector = embeddingRes.data[0].embedding.slice(0, 1024);

    // // Pad vector to 2048 dimensions
    // while (vector.length < 2048) {
    //   vector.push(0);
    // }

    console.log('Embedding length after padding:', vector.length); // should print 2048

    // Upsert into Pinecone
    await index.upsert([
      {
        id: event.id,
        values: vector,
        metadata: { title, description, date, category },
      },
    ]);
  }

  return (
    <div>
      <h1>Events uploaded to Pinecone!</h1>
      <p>Total events processed: {events.length}</p>
    </div>
  );
}
