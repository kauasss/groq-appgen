import { NextResponse } from 'next/server';

import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Given this HTML content, suggest a concise title and brief description that captures the essence of the app. The title should be descriptive, while the description should explain what the app does in a single sentence. Format the response as JSON with "title" and "description" fields.

<app html>
${html}
</app html>`,
        },
      ],
      model: 'llama-3.3-70b-specdec',
      temperature: 0.7,
      max_tokens: 200,
      top_p: 1,
      stream: false,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '';
    const startIndex = responseContent.indexOf('{');
    const endIndex = responseContent.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid JSON response from AI');
    }

    const jsonContent = responseContent.substring(startIndex, endIndex + 1);
    const suggestions = JSON.parse(jsonContent);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
