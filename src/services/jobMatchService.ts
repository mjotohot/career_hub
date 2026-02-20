import { supabase } from './supabase'
import type { MatchResult } from '@/services/geminiJobMatcher'

export async function saveGeminiMatchResult(applicationId: string, match: MatchResult) {
  return supabase
    .from('applications')
    .update({
      match_status: match.status,
      match_evaluated_at: new Date().toISOString(),
    })
    .eq('application_id', applicationId)
}
