import { createClient } from "./server"

export type Profile = {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  website: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error || !data) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()

  if (error) {
    throw new Error(`Error updating profile: ${error.message}`)
  }

  return data[0] as Profile
}

export async function createProfile(userId: string, profile: Partial<Profile>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    throw new Error(`Error creating profile: ${error.message}`)
  }

  return data[0] as Profile
}

