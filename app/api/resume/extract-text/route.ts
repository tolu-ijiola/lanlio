import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * API Route: Extract Text from Resume File
 * POST /api/resume/extract-text
 * 
 * FormData: { file: File }
 * Returns: { text: string }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    let text = '';

    // Handle PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdfParse(buffer);
        text = data.text;
      } catch (error) {
        console.error('Error parsing PDF:', error);
        return NextResponse.json(
          { error: 'Failed to parse PDF file. Please ensure it is a valid PDF.' },
          { status: 400 }
        );
      }
    } 
    // Handle DOCX files
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (error) {
        console.error('Error parsing DOCX:', error);
        return NextResponse.json(
          { error: 'Failed to parse DOCX file. Please ensure it is a valid DOCX file.' },
          { status: 400 }
        );
      }
    }
    // Handle DOC files (older Word format - limited support)
    else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return NextResponse.json(
        { error: 'DOC files are not supported. Please convert to DOCX or PDF format.' },
        { status: 400 }
      );
    }
    // Handle plain text files
    else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      text = await file.text();
    } 
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the file. The file may be empty or corrupted.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from file. Please try again.' },
      { status: 500 }
    );
  }
}

