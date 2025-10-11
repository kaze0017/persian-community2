// src/app/api/generate-event/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Event } from "@/types/event";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, tags } = body;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are an AI event generator. Generate a JSON object matching this Event type...
User input (may be partial): ${JSON.stringify({ title, description, tags })}
Fill missing fields with reasonable defaults.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message?.content || "{}";
    const event = JSON.parse(text);

    return NextResponse.json(event);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
