import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      action = "chat",
      text = "",
      tone = "friendly",
      history = [],
      currentContent = null,
    } = (await request.json()) as {
      action?: string;
      text?: string;
      tone?: string;
      history?: ChatMessage[];
      currentContent?: any;
    };

    if (!text.trim()) {
      return NextResponse.json(
        { error: "No input text provided" },
        { status: 400 }
      );
    }

    // ✨ Motivated, detailed prompt for maximum creativity
    const prompt = `
You are an **expert Tiptap JSON document designer** with exceptional creativity and structure awareness.

Your job:
1. Analyze any existing content and improve or expand it based on the user’s message.
2. Maintain logical flow, tone, and clarity.
3. Use **as many rich Tiptap elements as appropriate** to make the output engaging, professional, and visually structured.

Allowed Tiptap elements (use creatively and frequently when it fits):
- **Headings** ("heading", level 1–3) for hierarchy and structure.
- **Paragraphs** for regular text.
- **Bullet lists** ("bulletList", "listItem") for enumerations.
- **Ordered lists** ("orderedList") for sequences.
- **Task lists** ("taskList", "taskItem") for checkboxes or progress indicators.
- **Blockquotes** for quotes, remarks, or callouts.
- **Code blocks** for examples, commands, or technical snippets.
- **Horizontal rules** to divide sections.
- **Images** (preserve existing ones!).
- **Links** and **marks** such as bold, italic, highlight, underline, code, superscript, subscript for style and clarity.

Always return a valid **Tiptap JSON object** with this structure:
\`\`\`json
{ "type": "doc", "content": [ ... ] }
\`\`\`

If existing content is provided, intelligently:
- Improve grammar and tone.
- Add variety and formatting.
- Maintain factual content and images.

If no content exists:
- Create a compelling, structured draft using multiple Tiptap elements.
- Include at least one heading, list, and a paragraph.
- Add a relevant example or quote where it makes sense.

Tone: ${tone}

Conversation so far:
${history.map((m) => `${m.role}: ${m.text}`).join("\n")}

User message:
${text}

${currentContent ? `Existing Editor Content (JSON):\n${JSON.stringify(currentContent, null, 2)}` : ""}
`;

    // 🧠 Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o"
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that outputs valid Tiptap JSON objects only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw)
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    return parsed
      ? NextResponse.json(parsed)
      : NextResponse.json({ message: raw });
  } catch (error: any) {
    console.error("❌ API error:", error);
    return NextResponse.json(
      { error: "AI generation failed", details: error.message },
      { status: 500 }
    );
  }
}
