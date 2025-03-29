"use server"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { log } from "console"

// Helper function to get the base URL
function getURL() {
  // Use the production URL
  return "http://localhost:3000"
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return { success: true }
}

export async function signInWithProvider(provider: "google" | "github") {
  const supabase = await createClient()

  const redirectTo = `${getURL()}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })




  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    url: data.url,
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const inviteCode = formData.get("inviteCode") as string
  const supabase = await createClient()

  // Optional: Validate invite code
  if (inviteCode !== process.env.INVITE_CODE && inviteCode !== "VENTRY2023") {
    return {
      error: "Invalid invite code",
    }
  }

  // Sign up the user with email confirmation enabled
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${getURL()}/auth/callback`,
    },
  })

  if (error) {
    // Check if the error is because the user already exists
    if (
      error.message.includes("already registered") ||
      error.message.includes("already in use") ||
      error.message.includes("already exists")
    ) {
      return {
        error: "This email is already registered. Please use a different email or sign in.",
      }
    }

    return {
      error: error.message,
    }
  }

  // Check if email confirmation is required
  if (data?.user?.identities && data.user.identities.length === 0) {
    return {
      error: "This email is already registered. Please use a different email or sign in.",
    }
  }

  // Create a profile for the user
  if (data?.user) {
    try {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          full_name: name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    } catch (profileError) {
      console.error("Error creating profile:", profileError)
      // Don't return an error here, as the user was created successfully
    }
  }

  return {
    success: true,
    message: "Check your email for the confirmation link",
    user: data?.user,
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/signin")
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}/reset-password`,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Check your email for the password reset link",
  }
}

export async function checkEmailExists(email: string) {
  const supabase = await createClient()

  // Use a direct SQL query to check if the email exists in the auth.users table
  // This avoids creating temporary users
  try {
    const { data, error } = await supabase.from("users").select("email").eq("email", email.toLowerCase()).maybeSingle()

    if (error) {
      console.error("Error checking email:", error)
      return { exists: false, error: error.message }
    }

    // If we found a user with this email, it exists
    return {
      exists: !!data,
      error: null,
    }
  } catch (err) {
    console.error("Exception checking email:", err)
    return { exists: false, error: "Failed to check email" }
  }
}