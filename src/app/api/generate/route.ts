import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { constructPrompt } from '@/utils/prompt';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query, currentHtml, feedback } = await request.json();

    const prompt = constructPrompt({
      ...(query && { query }),
      currentHtml,
      currentFeedback: feedback
    });

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-specdec',
      temperature: 0.1,
      max_tokens: 2000,
    });

    let generatedHtml = chatCompletion.choices[0]?.message?.content || '';
    
    // Extract HTML content from between backticks if present
    if (generatedHtml.includes('```html')) {
      const match = generatedHtml.match(/```html\n([\s\S]*?)\n```/);
      generatedHtml = match ? match[1] : generatedHtml;
    }

    return NextResponse.json({ 
      html: generatedHtml,
      usage: chatCompletion.usage
    });
  } catch (error) {
    console.error('Error generating HTML:', error);
    return NextResponse.json(
      { error: 'Failed to generate HTML' },
      { status: 500 }
    );
  }
}
