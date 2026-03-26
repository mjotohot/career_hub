import emailjs, { EmailJSResponseStatus } from '@emailjs/browser'
import { EmailParams, EmailServiceResponse, ScreeningStatus } from '../types/email'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

const getStatusContent = (match_status: ScreeningStatus) => {
  switch (match_status) {
    case 'passed':
      return {
        outcome: 'Passed',
        steps:
          'Congratulations! You have successfully passed the initial screening. Our team will contact you shortly regarding the next steps.',
      }
    case 'failed':
      return {
        outcome: 'Not Selected',
        steps:
          "Thank you for your interest. After reviewing your qualifications against the mandatory requirements, we have decided to move forward with other candidates whose profiles more closely align with the position's needs.",
      }
    case 'partial':
      return {
        outcome: 'Partial Match',
        steps: 'Your application meets some requirements but requires further review.',
      }
    default:
      return {
        outcome: 'Pending Review',
        steps:
          'Your application has been received and is currently under manual review by our HR department.',
      }
  }
}

export const sendScreeningEmail = async (params: EmailParams): Promise<EmailServiceResponse> => {
  const { outcome } = getStatusContent(params.match_status)

  const templateParams = {
    full_name: params.full_name,
    email: params.email,
    open_position: params.open_position,
    match_status: outcome,
  }

  console.log('FINAL CHECK:', templateParams.email)

  try {
    const result: EmailJSResponseStatus = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY,
    )

    return { success: true, message: `Email sent! Status: ${result.status}` }
  } catch (error) {
    return { success: false, error }
  }
}
