"use server"

import { createClient } from "@/utils/supabase/server"
import { updateProfile as updateProfileData, createProfile, getProfile } from "@/utils/supabase/profile"
import { uploadProfileImage } from "@/utils/supabase/storage"

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to update your profile" }
    }

    const userId = formData.get("id") as string

    if (userId !== user.id) {
      return { error: "You can only update your own profile" }
    }

    // Check if a profile exists
    let profile = await getProfile(userId)

    // Handle file upload if present
    let avatarUrl = profile?.avatar_url
    const avatarFile = formData.get("avatar") as File

    if (avatarFile && avatarFile.size > 0) {
      try {
        avatarUrl = await uploadProfileImage(userId, avatarFile)
      } catch (error) {
        console.error("Error uploading profile image:", error)
        return { error: "Failed to upload profile image" }
      }
    }

    // Prepare profile data
    const profileData = {
      full_name: formData.get("full_name") as string,
      username: formData.get("username") as string,
      website: formData.get("website") as string,
      bio: formData.get("bio") as string,
      avatar_url: avatarUrl,
    }

    // Create or update profile
    if (profile) {
      profile = await updateProfileData(userId, profileData)
    } else {
      profile = await createProfile(userId, profileData)
    }

    return { success: true, profile }
  } catch (error) {
    console.error("Error in updateProfile:", error)
    return { error: "Failed to update profile" }
  }
}

