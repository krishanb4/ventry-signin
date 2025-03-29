import { createClient } from "./server"

export async function uploadProfileImage(userId: string, file: File) {
  const supabase = await createClient()

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage.from("profile-images").upload(`${userId}/${Date.now()}.jpg`, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`)
  }

  // Get the public URL for the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-images").getPublicUrl(data.path)

  return publicUrl
}

export async function deleteProfileImage(path: string) {
  const supabase = await createClient()

  const { error } = await supabase.storage.from("profile-images").remove([path])

  if (error) {
    throw new Error(`Error deleting image: ${error.message}`)
  }

  return true
}

export async function getProfileImageUrl(userId: string) {
  const supabase = await createClient()

  // List all files in the user's folder
  const { data, error } = await supabase.storage.from("profile-images").list(userId)

  if (error || !data || data.length === 0) {
    return null
  }

  // Get the URL of the most recent image (assuming files are named with timestamps)
  const mostRecentFile = data.sort((a, b) => {
    const aTime = Number.parseInt(a.name.split(".")[0])
    const bTime = Number.parseInt(b.name.split(".")[0])
    return bTime - aTime
  })[0]

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-images").getPublicUrl(`${userId}/${mostRecentFile.name}`)

  return publicUrl
}

