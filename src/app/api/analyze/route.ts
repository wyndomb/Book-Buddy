import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const prompt = `
      Please analyze the following text from a book and provide:
      1. A clear, simple explanation of the main ideas
      2. Key concepts and themes
      3. Real-world examples or analogies to help understand the concepts
      4. Any important context or background information

      Text to analyze:
      ${text}

      Format your response in Markdown with:
      - A compelling headline (H1)
      - Clear section headings (H2, H3)
      - Bullet points for lists
      - Bold for important terms
      - Italics for emphasis
      - Make it read like a well-structured blog article or educational content
      
      The output should be properly formatted Markdown that's easy to read and visually appealing.
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that explains complex text in simple terms, making it easier to understand for readers. You format your responses in clean, well-structured Markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis =
      completion.choices[0]?.message?.content || "No analysis generated";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 }
    );
  }
}
