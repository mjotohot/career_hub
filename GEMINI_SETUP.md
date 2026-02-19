# Gemini AI Job Matcher Setup

This document explains how to use the Gemini AI job matching service.

## Service Location
`src/services/geminiJobMatcher.ts`

## Features
- Assesses applicant qualifications against job requirements
- Uses Gemini AI for intelligent matching analysis
- Returns clear `pass` or `failed` status
- Considers education, experience, skills, and trainings

## Usage Example

### Basic Integration in Job Application Service

```typescript
import { assessJobMatch } from '@/services/geminiJobMatcher'
import type { Job } from '@/types/jobs'
import type { ApplicationFormData } from '@/types/applyform'

// In your application submission flow:
const job: Job = await fetchJobDetails(jobId)
const applicantData: ApplicationFormData = { /* form data */ }
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

const matchResult = await assessJobMatch(job, applicantData, geminiApiKey)

if (matchResult.status === 'pass') {
  console.log('Applicant is a suitable match')
} else {
  console.log('Applicant does not meet requirements')
}
```

### Integration with Job Application Modal

You can call `assessJobMatch()` after the database submission succeeds:

```typescript
const result = await jobApplicationService({
  ...formData,
  jobId: props.job.job_id,
})

if (result.success) {
  // Call Gemini to assess match
  const matchResult = await assessJobMatch(
    props.job,
    formData,
    import.meta.env.VITE_GEMINI_API_KEY,
  )

  // Store or process the match result as needed
  console.log('Match assessment:', matchResult.status)
}
```

## API Key Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env.local` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Access it in your code via:
   ```typescript
   import.meta.env.VITE_GEMINI_API_KEY
   ```

## Response Format

```typescript
interface MatchResult {
  status: 'pass' | 'failed'
  reason?: string  // Optional error message if assessment fails
}
```

## Error Handling

The service gracefully handles errors:
- API failures return `{ status: 'failed', reason: 'Failed to contact Gemini API' }`
- Parsing errors return `{ status: 'failed', reason: 'Unable to parse assessment result' }`

## Parameters

- **job**: Complete Job object containing position details, requirements, and qualifications
- **applicantData**: ApplicationFormData with applicant's education, experience, skills, and trainings
- **apiKey**: Your Gemini API key

## How It Works

1. Constructs a detailed prompt with job requirements and applicant qualifications
2. Sends to Gemini AI for intelligent assessment
3. Parses response to extract "pass" or "failed" result
4. Returns structured MatchResult object
