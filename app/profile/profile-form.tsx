"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/utils/supabase/profile"
import { updateProfile } from "../actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"
import Image from "next/image"

interface ProfileFormProps {
  profile: Profile | null
  user: User
}

export function ProfileForm({ profile, user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await updateProfile(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Profile updated successfully!")
        if (result.profile?.avatar_url) {
          setAvatarUrl(result.profile.avatar_url)
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <p>{success}</p>
          </div>
        </div>
      )}

      <input type="hidden" name="id" value={user.id} />

      <div className="flex flex-col items-center mb-6">
        <div
          onClick={handleAvatarClick}
          className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-700 cursor-pointer group"
        >
          {avatarUrl ? (
            <Image src={avatarUrl || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-3xl text-zinc-400">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader()
              reader.onload = (event) => {
                setAvatarUrl(event.target?.result as string)
              }
              reader.readAsDataURL(e.target.files[0])
            }
          }}
        />
        <p className="text-xs text-zinc-400 mt-2">Click to upload a profile picture</p>
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-zinc-300">
          Email
        </Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email || ""}
            disabled
            className="block w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="full_name" className="block text-sm font-medium text-zinc-300">
          Full Name
        </Label>
        <div className="mt-1">
          <Input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={profile?.full_name || ""}
            className="block w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="username" className="block text-sm font-medium text-zinc-300">
          Username
        </Label>
        <div className="mt-1">
          <Input
            id="username"
            name="username"
            type="text"
            defaultValue={profile?.username || ""}
            className="block w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website" className="block text-sm font-medium text-zinc-300">
          Website
        </Label>
        <div className="mt-1">
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={profile?.website || ""}
            className="block w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio" className="block text-sm font-medium text-zinc-300">
          Bio
        </Label>
        <div className="mt-1">
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={profile?.bio || ""}
            className="block w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  )
}

