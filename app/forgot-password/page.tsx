import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password | Ventry",
  description: "Reset your Ventry account password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image src="/images/ventry-logo.png" alt="Ventry Logo" width={80} height={80} className="h-20 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-medium tracking-tight text-white">Reset your password</h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="backdrop-blur-sm bg-white/10 px-6 py-8 shadow-xl ring-1 ring-zinc-700/40 sm:rounded-lg sm:px-10">
            <ForgotPasswordForm />

            <div className="mt-6 text-center">
              <Link href="/signin" className="text-sm font-medium text-amber-300 hover:text-amber-200">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

