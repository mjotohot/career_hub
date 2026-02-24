import type { Job } from '@/types/jobs'
import type { ApplicationFormData } from '@/types/applyform'

export interface MatchResult {
  status: 'pass' | 'fail'
  reason?: string
}

interface GeminiRequestBody {
  contents: Array<{
    role: string
    parts: Array<{ text: string }>
  }>
  generationConfig: {
    temperature: number
    maxOutputTokens: number
    responseMimeType: string
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>
    }
    finishReason: string
  }>
  error?: {
    code: number
    message: string
    status: string
  }
}

const GEMINI_MODEL = 'gemini-2.5-flash-lite'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const MAX_RETRIES = 2
const RETRY_BASE_DELAY_MS = 10_000 // 10s base — respects the RPM rolling window

//Retries with exponential backoff on 429 rate limit errors.
export async function assessJobMatch(
  job: Job,
  applicantData: ApplicationFormData,
  apiKey: string,
): Promise<MatchResult> {
  if (!apiKey) {
    console.error('Gemini API key is missing')
    return { status: 'fail', reason: 'API key is not configured' }
  }

  const requestBody: GeminiRequestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: buildMatchingPrompt(job, applicantData) }],
      },
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 10,
      responseMimeType: 'text/plain',
    },
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      })

      const data: GeminiResponse = await response.json()

      // Handle quota / rate limit — retry after backoff
      if (response.status === 429) {
        const isLastAttempt = attempt === MAX_RETRIES - 1
        if (isLastAttempt) {
          console.error('Gemini rate limit exceeded after retries')
          return {
            status: 'fail',
            reason: 'Service is temporarily busy. Please try again in a moment.',
          }
        }

        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt) // 10s, then 20s
        console.warn(`Gemini 429 on attempt ${attempt + 1}, retrying in ${delay}ms…`)
        await sleep(delay)
        continue
      }

      // Gemini-level error in response body (e.g. invalid key, model not found)
      if (data.error) {
        console.error('Gemini API error:', data.error.message)
        return { status: 'fail', reason: `Gemini error: ${data.error.message}` }
      }

      if (!response.ok) {
        console.error('Gemini HTTP error:', response.status, response.statusText)
        return { status: 'fail', reason: 'Failed to contact Gemini API' }
      }

      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      console.log('Gemini raw response:', data)
      console.log('Gemini text:', data.candidates?.[0]?.content?.parts?.[0]?.text)
      return parseGeminiResponse(responseText)
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES - 1
      if (isLastAttempt) {
        console.error('Error assessing job match:', error)
        return { status: 'fail', reason: 'An unexpected error occurred while processing' }
      }

      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt)
      console.warn(`Network error on attempt ${attempt + 1}, retrying in ${delay}ms…`)
      await sleep(delay)
    }
  }

  return { status: 'fail', reason: 'Unknown error' }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildMatchingPrompt(job: Job, applicantData: ApplicationFormData): string {
  return `You are a hiring specialist evaluating whether an applicant meets the minimum requirements for a government job position.

JOB REQUIREMENTS:
- Position: ${job.open_position}
- Department: ${job.department_unit}
- Job Description: ${job.job_desc}
- Required Education: ${job.education_desired || 'Not specified'}
- Required Experience: ${job.experience_desired || 'Not specified'}
- Required Eligibility: ${job.eligibility_desired || 'Not specified'}
- Required Trainings: ${job.trainings_desired || 'Not specified'}
- Other Qualifications: ${job.other_qualifications || 'Not specified'}

APPLICANT PROFILE:
- Education: ${applicantData.education}
- Work Experience: ${applicantData.experience || 'None provided'}
- Skills: ${applicantData.skills}
- Trainings / Seminars: ${applicantData.training || 'None provided'}

INSTRUCTION:
Evaluate whether the applicant meets the minimum qualifications. Respond with exactly one word only — no punctuation, no explanation:
- "pass" if the applicant meets the minimum requirements
- "fail" if the applicant does not meet the minimum requirements`
}

function parseGeminiResponse(responseText: string): MatchResult {
  const cleaned = responseText.toLowerCase().trim()

  if (cleaned.includes('pass')) return { status: 'pass' }
  if (cleaned.includes('fail')) return { status: 'fail' }

  console.warn('Unexpected Gemini response format:', responseText)
  return { status: 'fail', reason: 'Unable to parse assessment result' }
}
