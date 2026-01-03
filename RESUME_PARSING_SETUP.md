# Resume Parsing Setup Guide

## Overview
The resume parsing system uses OpenAI's GPT-4o-mini to intelligently extract structured data from uploaded resume files (PDF, DOCX, TXT).

## Setup Instructions

### 1. Install Dependencies
The required libraries are already installed:
- `pdf-parse` - For extracting text from PDF files
- `mammoth` - For extracting text from DOCX files

### 2. Set Up OpenAI API Key

1. **Get an OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Sign up or log in
   - Create a new API key

2. **Add to Environment Variables:**
   - Create or update `.env.local` in the `app` directory
   - Add your API key:
     ```
     OPENAI_API_KEY=sk-your-api-key-here
     ```

3. **Restart your development server** after adding the key

### 3. Cost Information
- **Model Used:** GPT-4o-mini (cost-effective)
- **Approximate Cost:** ~$0.15 per 1M input tokens
- **Typical Resume:** ~500-2000 tokens per parse
- **Cost per Resume:** ~$0.0001 - $0.0003 (very affordable)

### 4. How It Works

1. **File Upload:** User uploads PDF/DOCX/TXT file
2. **Text Extraction:** File is processed to extract raw text
3. **AI Parsing:** Text is sent to OpenAI with structured prompt
4. **Data Extraction:** AI returns structured JSON with:
   - Full Name
   - Email
   - Phone
   - Job Title
   - Experience Level
   - Location
   - Bio/Summary
   - Skills (array)
   - Education
   - Work History
5. **Form Population:** Extracted data automatically fills the form
6. **Storage:** File uploaded to Supabase Storage, data saved to database

### 5. Fallback Behavior
- If OpenAI API key is missing: Falls back to regex-based parsing
- If AI parsing fails: Falls back to regex-based parsing
- If file parsing fails: Shows error message to user

### 6. Testing
1. Upload a resume file (PDF, DOCX, or TXT)
2. Wait for parsing to complete (shows "Parsing..." indicator)
3. Review the auto-filled form fields
4. Edit any incorrect fields
5. Save the resume

## Troubleshooting

### "OpenAI API key not found"
- Check that `.env.local` exists in the `app` directory
- Verify the key is correct (starts with `sk-`)
- Restart the development server

### "Failed to parse PDF/DOCX"
- Ensure the file is not corrupted
- Try converting to a different format
- Check file size (very large files may timeout)

### "No text extracted"
- File may be image-based PDF (requires OCR - not currently supported)
- Try a text-based PDF or DOCX file

## Advanced Configuration

### Change AI Model
Edit `app/lib/resume-parser.ts`:
```typescript
model: 'gpt-4o-mini', // Change to 'gpt-4-turbo' for better accuracy (more expensive)
```

### Adjust Temperature
Lower temperature = more consistent results:
```typescript
temperature: 0.2, // Current setting (0.0-2.0 range)
```

### Increase Text Limit
If resumes are very long, increase truncation:
```typescript
const truncatedText = text.length > 8000 ? text.substring(0, 8000) : text;
```











