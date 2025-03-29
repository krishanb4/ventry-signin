"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signInWithProvider } from "../actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await signIn(formData);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleProviderSignIn(provider: "google" | "github") {
    setIsProviderLoading(provider);
    setError(null);

    try {
      const response = await signInWithProvider(provider);

      if (response.error) {
        setError(response.error);
        setIsProviderLoading(null);
        return;
      }

      if (response.url) {
        window.location.href = response.url;
      }

      // If successful, the user will be redirected by the auth provider
      // No need to navigate manually
    } catch (err) {
      console.error("Error signing in with provider:", err);
      setError("Failed to sign in with provider. Please try again.");
      setIsProviderLoading(null);
    }
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

      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300"
        >
          Email address
        </Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-300"
        >
          Password
        </Label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-amber-400 focus:ring-amber-400 focus:ring-offset-zinc-800"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-zinc-300"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-amber-400 hover:text-amber-300"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-800 px-2 text-zinc-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleProviderSignIn("google")}
          disabled={isProviderLoading !== null}
          className="flex w-full items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700"
        >
          {isProviderLoading === "google" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-amber-400 mr-2"></div>
          ) : null}
          <span>Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleProviderSignIn("github")}
          disabled={isProviderLoading !== null}
          className="flex w-full items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700"
        >
          {isProviderLoading === "github" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-amber-400 mr-2"></div>
          ) : null}
          <span>GitHub</span>
        </Button>
      </div>
    </form>
  );
}
