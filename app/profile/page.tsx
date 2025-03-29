import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getProfile } from "@/utils/supabase/profile";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const profile = await getProfile(user.id);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/ventry-logo.png"
              alt="Ventry Logo"
              width={40}
              height={40}
              className="h-10 w-auto mr-3"
            />
          </div>
          <nav className="flex space-x-4">
            <a
              href="/dashboard"
              className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/profile"
              className="bg-zinc-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </a>
          </nav>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
          <div className="bg-zinc-800/80 rounded-lg shadow-xl p-6">
            <ProfileForm profile={profile} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
