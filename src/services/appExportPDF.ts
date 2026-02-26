import { supabase } from '@/services/supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function getApplicationsForExport(job_id: string, match_status?: 'pass' | 'fail') {
  let query = supabase
    .from('applications')
    .select(
      `
      application_id,
      applied_at,
      region,
      province,
      city,
      match_status,
      job_id,
      applicants (
        applicant_id,
        full_name,
        email,
        birthdate,
        mobile_number,
        gender,
        education,
        skills,
        experience,
        training,
        eligibility
      ),
      jobs (
        job_id,
        open_position,
        campus,
        department_unit
      )
    `,
    )
    .eq('job_id', job_id)

  // only filter by status if provided, otherwise fetch all
  if (match_status) {
    query = query.eq('match_status', match_status)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export function exportApplicantsPDF(data: any[]) {
  const pdf = new jsPDF()

  data.forEach((row, index) => {
    if (index > 0) pdf.addPage()

    const applicant = row.applicants
    const job = row.jobs

    // ── Header ──
    pdf.setFontSize(16)
    pdf.setTextColor('#1e3a5f')
    pdf.text('Applicant Profile', 14, 20)

    pdf.setFontSize(9)
    pdf.setTextColor('#9ca3af')
    pdf.text(
      `Application ID: ${row.application_id}  ·  Exported ${new Date().toLocaleDateString()}`,
      14,
      27,
    )

    // ── Job Information ──
    pdf.setFontSize(11)
    pdf.setTextColor('#1e3a5f')
    pdf.text('Job Information', 14, 37)

    autoTable(pdf, {
      startY: 41,
      theme: 'grid',
      head: [['Field', 'Value']],
      body: [
        ['Position', job.open_position],
        ['Campus', job.campus],
        ['Department/Unit', job.department_unit],
        ['Date Applied', new Date(row.applied_at).toLocaleDateString()],
        ['Status', row.match_status.toUpperCase()],
      ],
      headStyles: { fillColor: '#1e3a5f', textColor: '#ffffff', fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60, textColor: '#6b7280' },
        1: { cellWidth: 'auto' },
      },
    })

    // ── Personal Information ──
    const afterJobTable = (pdf as any).lastAutoTable.finalY + 8
    pdf.setFontSize(11)
    pdf.setTextColor('#1e3a5f')
    pdf.text('Personal Information', 14, afterJobTable)

    autoTable(pdf, {
      startY: afterJobTable + 4,
      theme: 'grid',
      head: [['Field', 'Value']],
      body: [
        ['Full Name', applicant.full_name],
        ['Email', applicant.email],
        ['Mobile Number', applicant.mobile_number ?? 'N/A'],
        [
          'Birthdate',
          applicant.birthdate ? new Date(applicant.birthdate).toLocaleDateString() : 'N/A',
        ],
        ['Gender', applicant.gender ?? 'N/A'],
      ],
      headStyles: { fillColor: '#1e3a5f', textColor: '#ffffff', fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60, textColor: '#6b7280' },
        1: { cellWidth: 'auto' },
      },
    })

    // ── Address ──
    const afterPersonalTable = (pdf as any).lastAutoTable.finalY + 8
    pdf.setFontSize(11)
    pdf.setTextColor('#1e3a5f')
    pdf.text('Address', 14, afterPersonalTable)

    autoTable(pdf, {
      startY: afterPersonalTable + 4,
      theme: 'grid',
      head: [['Field', 'Value']],
      body: [
        ['Region', row.region ?? 'N/A'],
        ['Province', row.province ?? 'N/A'],
        ['City', row.city ?? 'N/A'],
      ],
      headStyles: { fillColor: '#1e3a5f', textColor: '#ffffff', fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60, textColor: '#6b7280' },
        1: { cellWidth: 'auto' },
      },
    })

    // ── Qualifications ──
    const afterAddressTable = (pdf as any).lastAutoTable.finalY + 8
    pdf.setFontSize(11)
    pdf.setTextColor('#1e3a5f')
    pdf.text('Qualifications', 14, afterAddressTable)

    autoTable(pdf, {
      startY: afterAddressTable + 4,
      theme: 'grid',
      head: [['Field', 'Value']],
      body: [
        ['Education', applicant.education ?? 'N/A'],
        ['Skills', applicant.skills ?? 'N/A'],
        ['Experience', applicant.experience ?? 'N/A'],
        ['Training', applicant.training ?? 'N/A'],
        ['Eligibility', applicant.eligibility ?? 'N/A'],
      ],
      headStyles: { fillColor: '#1e3a5f', textColor: '#ffffff', fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60, textColor: '#6b7280' },
        1: { cellWidth: 'auto' },
      },
    })
  })

  pdf.save('applicants-export.pdf')
}
