/**
 * Resume Parser Utility
 * Extracts structured data from resume text using regex patterns and AI
 */

export interface ParsedResumeData {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  experience: string;
  location: string;
  bio: string;
  skills: string[];
  education: string;
  workHistory: string;
}

/**
 * Extract email from text
 */
function extractEmail(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

/**
 * Extract phone number from text
 */
function extractPhone(text: string): string {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
}

/**
 * Extract name (usually first line or before email)
 */
function extractName(text: string): string {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // If first line looks like a name (2-4 words, no special chars except spaces/hyphens)
    if (/^[A-Za-z\s-]{2,50}$/.test(firstLine) && firstLine.split(' ').length <= 4) {
      return firstLine;
    }
  }
  return '';
}

/**
 * Extract location (look for city, state/country patterns)
 */
function extractLocation(text: string): string {
  const locationPatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)/g, // City, State
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+)/g, // City, Country
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return '';
}

/**
 * Extract skills (common tech skills keywords)
 */
function extractSkills(text: string): string[] {
  const commonSkills = [
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Ruby', 'PHP', 'Go', 'Rust',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'REST', 'GraphQL',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Agile', 'Scrum', 'DevOps', 'Microservices', 'Linux', 'Windows', 'macOS',
    'Figma', 'Adobe', 'Photoshop', 'Illustrator', 'Sketch', 'InVision',
    'Project Management', 'Leadership', 'Communication', 'Teamwork'
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }
  
  return [...new Set(foundSkills)]; // Remove duplicates
}

/**
 * Extract job title (look for common title patterns)
 */
function extractJobTitle(text: string): string {
  const titlePatterns = [
    /(Senior|Junior|Lead|Principal)?\s*(Software|Frontend|Backend|Full.?Stack|DevOps|Data|ML|AI)?\s*(Engineer|Developer|Architect|Scientist|Analyst|Manager|Designer)/gi,
    /(Product|Project|Engineering|Technical)?\s*(Manager|Lead|Director)/gi,
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  
  // Fallback: look in first few lines
  const lines = text.split('\n').slice(0, 5);
  for (const line of lines) {
    if (line.length > 5 && line.length < 50 && !line.includes('@') && !line.includes('http')) {
      return line.trim();
    }
  }
  
  return '';
}

/**
 * Extract experience (years of experience)
 */
function extractExperience(text: string): string {
  const experiencePatterns = [
    /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi,
    /(\d+)\+?\s*(years?|yrs?)/gi,
  ];
  
  for (const pattern of experiencePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return '';
}

/**
 * Extract education section
 */
function extractEducation(text: string): string {
  const educationKeywords = ['education', 'university', 'college', 'degree', 'bachelor', 'master', 'phd', 'diploma'];
  const lines = text.split('\n');
  let educationStart = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
      educationStart = i;
      break;
    }
  }
  
  if (educationStart !== -1) {
    return lines.slice(educationStart, educationStart + 5).join('\n').trim();
  }
  
  return '';
}

/**
 * Extract work history
 */
function extractWorkHistory(text: string): string {
  const workKeywords = ['experience', 'employment', 'work history', 'professional experience', 'career'];
  const lines = text.split('\n');
  let workStart = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    if (workKeywords.some(keyword => lowerLine.includes(keyword))) {
      workStart = i;
      break;
    }
  }
  
  if (workStart !== -1) {
    // Get next 10-15 lines for work history
    return lines.slice(workStart, workStart + 15).join('\n').trim();
  }
  
  return '';
}

/**
 * Extract bio/summary (usually first paragraph or summary section)
 */
function extractBio(text: string): string {
  const summaryKeywords = ['summary', 'about', 'profile', 'objective', 'overview'];
  const lines = text.split('\n');
  
  // Look for summary section
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    if (summaryKeywords.some(keyword => lowerLine.includes(keyword))) {
      // Get next 3-5 lines as bio
      return lines.slice(i + 1, i + 5).join(' ').trim();
    }
  }
  
  // Fallback: first substantial paragraph (3-5 lines after name)
  const firstParagraph = lines.slice(1, 6).join(' ').trim();
  if (firstParagraph.length > 50 && firstParagraph.length < 500) {
    return firstParagraph;
  }
  
  return '';
}

/**
 * Parse resume text and extract structured data
 */
export function parseResumeText(text: string): ParsedResumeData {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  return {
    fullName: extractName(text) || '',
    email: extractEmail(text),
    phone: extractPhone(text),
    jobTitle: extractJobTitle(text),
    experience: extractExperience(text),
    location: extractLocation(text),
    bio: extractBio(text),
    skills: extractSkills(text),
    education: extractEducation(text),
    workHistory: extractWorkHistory(text),
  };
}

/**
 * Use OpenAI to parse resume with structured output
 * Uses JSON mode for reliable parsing
 */
export async function parseResumeWithAI(text: string, apiKey?: string): Promise<ParsedResumeData> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required for AI parsing');
  }

  try {
    // Truncate text to avoid token limits (keep first 8000 chars for safety)
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) + '...' : text;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume parser. Extract structured data from resume text and return it as valid JSON.

Extract the following information:
- fullName: The person's full name (first and last name)
- email: Email address if found
- phone: Phone number if found (format: +1 (555) 123-4567 or similar)
- jobTitle: Current or most recent job title/position
- experience: Years of experience or experience level (e.g., "5+ years", "Senior level")
- location: City, State/Country if found
- bio: Professional summary, objective, or about section (2-3 sentences max)
- skills: Array of technical and professional skills (extract all relevant skills)
- education: Educational background (degrees, institutions, years)
- workHistory: Work experience and employment history (key positions, companies, dates)

Return ONLY valid JSON. If a field is not found, use an empty string or empty array.`,
          },
          {
            role: 'user',
            content: `Parse this resume and extract all relevant information:\n\n${truncatedText}`,
          },
        ],
        temperature: 0.2, // Lower temperature for more consistent results
        response_format: { type: 'json_object' }, // Force JSON output
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    try {
      const parsed = JSON.parse(content);
      
      // Validate and clean the parsed data
      return {
        fullName: typeof parsed.fullName === 'string' ? parsed.fullName.trim() : '',
        email: typeof parsed.email === 'string' ? parsed.email.trim() : '',
        phone: typeof parsed.phone === 'string' ? parsed.phone.trim() : '',
        jobTitle: typeof parsed.jobTitle === 'string' ? parsed.jobTitle.trim() : '',
        experience: typeof parsed.experience === 'string' ? parsed.experience.trim() : '',
        location: typeof parsed.location === 'string' ? parsed.location.trim() : '',
        bio: typeof parsed.bio === 'string' ? parsed.bio.trim() : '',
        skills: Array.isArray(parsed.skills) 
          ? parsed.skills.filter((s: any) => typeof s === 'string').map((s: string) => s.trim())
          : [],
        education: typeof parsed.education === 'string' ? parsed.education.trim() : '',
        workHistory: typeof parsed.workHistory === 'string' ? parsed.workHistory.trim() : '',
      };
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw content:', content);
      throw new Error('Invalid JSON response from AI');
    }
  } catch (error) {
    console.error('AI parsing failed:', error);
    throw error; // Re-throw to let caller handle fallback
  }
}

