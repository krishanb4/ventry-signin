"use server"

import { createClient } from "@/utils/supabase/server"

export async function checkEmailExists(email: string) {
  if (!email || email.length < 5 || !email.includes("@")) {
    return { exists: false, error: "Invalid email format" }
  }

  try {
    const supabase = await createClient()

    // Use a direct SQL query to check if the email exists in the auth.users table
    // This avoids creating temporary users
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

