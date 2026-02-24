import { supabase } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

export interface AppUser extends User {
  is_admin: boolean
}
export interface SignIn {
  user: AppUser | null
  error: string | null
}

export async function signInWithEmail(email: string, password: string): Promise<SignIn> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log('Supabase signIn result:', data, error)

  if (error || !data.user) {
    return {
      user: null,
      error: error?.message ?? 'Login failed',
    }
  }

  const appUser = await fetchUserProfile(data.user)
  return {
    user: appUser,
    error: null,
  }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user ?? null

  if (!user) return null

  return fetchUserProfile(user)
}

export function onAuthStateChanged(callback: (user: AppUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    const user = session?.user ?? null
    const appUser = user ? await fetchUserProfile(user) : null
    callback(appUser)
  })
}

export async function signOutUser(): Promise<string | null> {
  const { error } = await supabase.auth.signOut()
  return error?.message ?? null
}

async function fetchUserProfile(user: User): Promise<AppUser> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  console.log('profile result:', profile, 'error:', error)

  if (error) {
    console.error('Failed to load profile', error)
    return {
      ...user,
      is_admin: false,
    }
  }

  return {
    ...user,
    is_admin: profile?.is_admin ?? false,
  }
}
