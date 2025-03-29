"use client";

import type React from "react";

import { useState } from "react";
import { resetPassword } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const response = await resetPassword(formData);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    setSuccess(response.message || "Password reset email sent!");
    event.currentTarget.reset();
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

      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-200"
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
            className="block w-full text-white appearance-none rounded-md border border-zinc-600 bg-zinc-800/50 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-300 focus:outline-none focus:ring-amber-300 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:from-amber-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </div>
    </form>
  );
}
