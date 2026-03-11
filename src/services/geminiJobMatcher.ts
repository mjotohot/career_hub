import type { Job } from '@/types/jobs'
import type { ApplicationFormData } from '@/types/applyform'

export interface MatchResult {
  status: 'pass' | 'fail' | 'partial'
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
  pdsFile: File | null,
  wesFile: File | null,
): Promise<MatchResult> {
  if (!apiKey) {
    console.error('Gemini API key is missing')
    return { status: 'fail', reason: 'API key is not configured' }
  }

  // convert File to Base64
  const fileToGenerativePart = async (file: File) => {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve((reader.result as string).split(',')[1])
      reader.readAsDataURL(file)
    })
    return {
      inline_data: {
        data: base64,
        mime_type: file.type,
      },
    }
  }

  const parts: any[] = [{ text: buildMatchingPrompt(job, applicantData) }]

  if (pdsFile) parts.push(await fileToGenerativePart(pdsFile))
  if (wesFile) parts.push(await fileToGenerativePart(wesFile))

  const requestBody: GeminiRequestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: buildMatchingPrompt(job, applicantData) }],
      },
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 150,
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

ADDITIONAL DOCUMENTS ATTACHED:
- I have provided the applicant's PDS (Personal Data Sheet) and WES (Work Experience Sheet) as attachments.
- Please cross-reference the Education and Experience listed in the profile with the official details in these documents to ensure accuracy.

INSTRUCTION:
Evaluate whether the applicant meets the minimum qualifications.
Respond using this exact format and nothing else:

RESULT: pass
REMARKS: Applicant meets all minimum requirements.

OR if they meet most but miss 1-2 minor non-mandatory requirements:
RESULT: partial
REMARKS: List the specific unmet qualifications. Example: Missing required eligibility. Work experience of X years is below required Y years.

OR if they clearly fail core requirements:
RESULT: fail
REMARKS: Explain which core qualifications do not match.
`
}

function parseGeminiResponse(responseText: string): MatchResult {
  const cleaned = responseText.toLowerCase().trim()
  const original = responseText.trim()

  // Extract RESULT line
  const resultMatch = cleaned.match(/result:\s*(pass|fail|partial)/)
  // Extract REMARKS line (case-insensitive, grab rest of line)
  const remarksMatch = original.match(/REMARKS:\s*(.+)/i)

  const remarks = remarksMatch?.[1]?.trim()

  if (resultMatch?.[1] === 'pass') {
    return { status: 'pass', reason: remarks }
  }

  if (resultMatch?.[1] === 'partial') {
    return { status: 'partial', reason: remarks }
  }

  if (resultMatch?.[1] === 'fail') {
    return {
      status: 'fail',
      reason: remarks ?? 'Applicant did not meet minimum qualifications.',
    }
  }

  // Fallback for unexpected formats
  console.warn('Unexpected Gemini response format:', responseText)
  return { status: 'fail', reason: 'Unable to parse assessment result' }
}
