import { NextRequest, NextResponse } from 'next/server';
import { parseResumeText, parseResumeWithAI } from '@/lib/resume-parser';

/**
 * API Route: Parse Resume
 * POST /api/resume/parse
 * 
 * Body: { text: string, useAI?: boolean }
 * Returns: ParsedResumeData
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, useAI = true } = body; // Default to AI parsing

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Resume text cannot be empty' },
        { status: 400 }
      );
    }

    let parsedData;
    
    if (useAI) {
      // Use AI parsing if API key is available
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        console.warn('OpenAI API key not found, falling back to regex parsing');
        parsedData = parseResumeText(text);
      } else {
        try {
          parsedData = await parseResumeWithAI(text, apiKey);
        } catch (aiError) {
          console.error('AI parsing failed, falling back to regex:', aiError);
          // Fallback to regex parsing if AI fails
          parsedData = parseResumeText(text);
        }
      }
    } else {
      // Use regex parsing
      parsedData = parseResumeText(text);
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { 
        error: 'Failed to parse resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

