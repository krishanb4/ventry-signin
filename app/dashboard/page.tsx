import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { signOut } from "../actions/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

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
          <nav className="flex items-center space-x-4">
            <a
              href="/dashboard"
              className="bg-zinc-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/profile"
              className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </a>
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                className="text-white border-zinc-700 hover:bg-zinc-700"
              >
                Sign out
              </Button>
            </form>
          </nav>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Welcome to Ventry
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            You are now signed in as {user.email}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/profile"
              className="rounded-md bg-amber-400 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              Complete your profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
