import { supabase } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

export interface SignIn {
  user: User | null
  error: string | null
}

export async function signInWithEmail(email: string, password: string): Promise<SignIn> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return {
    user: data?.user ?? null,
    error: error?.message ?? null,
  }
}

export async function signOutUser(): Promise<string | null> {
  const { error } = await supabase.auth.signOut()
  return error?.message ?? null
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null
    callback(user)
  })
}
