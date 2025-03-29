import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SignInForm } from "./signin-form"

export const metadata: Metadata = {
  title: "Sign In | Ventry",
  description: "Sign in to your Ventry account",
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-900 justify-center items-center">
      <div className="w-full max-w-md px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/images/ventry-logo.png" alt="Ventry Logo" width={80} height={80} className="h-20 w-auto" />
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Or{" "}
            <Link href="/signup" className="font-medium text-amber-400 hover:text-amber-300">
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-zinc-800/80 px-6 py-8 shadow-xl rounded-lg">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}

