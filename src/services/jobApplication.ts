import { supabase } from './supabase'
import type { ApplicationPayload } from '@/types/applyform'

export async function jobApplicationService(formData: ApplicationPayload) {
  try {
    let pdsPath: string | null = null
    let wesPath: string | null = null

    if (formData.pdsFile) {
      const { data, error } = await supabase.storage
        .from('applications')
        .upload(`pds/${crypto.randomUUID()}`, formData.pdsFile)
      if (error) throw error
      pdsPath = data.path
    }

    if (formData.wesFile) {
      const { data, error } = await supabase.storage
        .from('applications')
        .upload(`wes/${crypto.randomUUID()}`, formData.wesFile)
      if (error) throw error
      wesPath = data.path
    }

    const { data: applicant, error: applicantError } = await supabase
      .from('applicants')
      .upsert(
        {
          full_name: formData.fullName,
          email: formData.email,
          birthdate: formData.birthdate,
          mobile_number: formData.mobileNumber,
          gender: formData.gender,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
          training: formData.training,
        },
        { onConflict: 'email' },
      )
      .select('applicant_id')
      .single()

    if (applicantError) throw applicantError

    // const { data: slot, error: slotError } = await supabase
    //   .from('jobs')
    //   .select('number_of_slots')
    //   .eq('job_id', formData.jobId)
    //   .single()

    // if (slotError) throw slotError
    // if (slot.number_of_slots <= 0) return { success: false, error: 'No slots available' }

    const { error: applicationError } = await supabase.from('applications').insert({
      job_id: formData.jobId,
      applicant_id: applicant.applicant_id,
      region: formData.region,
      province: formData.province,
      city: formData.city,
      pds_file: pdsPath,
      wes_file: wesPath,
    })

    if (applicationError) throw applicationError

    // const { error: slotUpdateError } = await supabase
    //   .from('jobs')
    //   .update({ number_of_slots: slot.number_of_slots - 1 })
    //   .eq('job_id', formData.jobId)

    // if (slotUpdateError) {
    //   console.warn('Application saved but slot decrement failed')
    // }

    return { success: true }
  } catch (err) {
    console.error('Error submitting application:', err)
    return { success: false, error: err }
  }
}
