import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate exactly 3 engaging and fun questions that someone might want to answer on a social platform. 
    Make them open-ended, friendly, and suitable for all audiences.
    Format requirements:
    - Each question should be on a new line
    - Keep questions between 10-20 words
    - Make them conversation starters
    - No personal or sensitive topics
    - No yes/no questions`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const questions = response.text()
      .split('\n')
      .filter(q => q.trim().length > 0)
      .slice(0, 3);

    return NextResponse.json({ questions });

  } catch (error) {
    console.error('Error generating questions:', error);

    const fallbackQuestions = [
      "What's the most interesting book you've read recently and why?",
      "If you could master any skill instantly, what would it be?",
      "What's a small thing that always brightens your day?"
    ];

    return NextResponse.json({
      questions: fallbackQuestions,
      fallback: true
    });
  }
}