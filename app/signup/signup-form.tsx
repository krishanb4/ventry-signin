"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signUp, signInWithProvider } from "../actions/auth";
import { checkEmailExists } from "../actions/check-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const debouncedEmail = useDebounce(email, 500);
  const formRef = useRef<HTMLFormElement>(null);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Check email when debounced email changes or when field is blurred
  useEffect(() => {
    // Skip email checking if form has been successfully submitted
    if (formSubmitted || success) return;

    async function validateEmail() {
      if (
        !debouncedEmail ||
        debouncedEmail.length < 5 ||
        !debouncedEmail.includes("@")
      ) {
        setEmailExists(null);
        setEmailError(null);
        return;
      }

      setIsCheckingEmail(true);
      setEmailError(null);

      try {
        // Check if email exists in Supabase
        const result = await checkEmailExists(debouncedEmail);

        setEmailExists(result.exists);

        if (result.error) {
          setEmailError(result.error);
        } else if (result.exists) {
          setEmailError(
            "This email is already registered. Please use a different email or sign in."
          );
        }
      } catch (err) {
        console.error("Error validating email:", err);
        setEmailError("Could not validate email");
      } finally {
        setIsCheckingEmail(false);
      }
    }

    // Only run validation if the email field has been blurred (user has moved to another field)
    // or if the email is long enough and contains @ (likely a complete email)
    if (
      emailBlurred ||
      (debouncedEmail.length > 5 && debouncedEmail.includes("@"))
    ) {
      validateEmail();
    }
  }, [debouncedEmail, emailBlurred, formSubmitted, success]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // If email exists, prevent form submission
    if (emailExists) {
      setError(
        "This email is already registered. Please use a different email or sign in."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Get form data for validation
    const formData = new FormData(event.currentTarget);

    // Submit the form to create a user in Supabase
    const response = await signUp(formData);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    // Mark form as submitted to prevent further email checks
    setFormSubmitted(true);

    // Clear any email validation states
    setEmailExists(null);
    setEmailError(null);

    setSuccess(
      response.message || "Check your email for the confirmation link"
    );

    // Reset form
    if (formRef.current) {
      formRef.current.reset();
    }
    setEmail("");
    setEmailBlurred(false);
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
    } catch (err) {
      console.error("Error signing in with provider:", err);
      setError("Failed to sign in with provider. Please try again.");
      setIsProviderLoading(null);
    }
  }

  // Reset the form for a new submission
  function handleStartOver() {
    setFormSubmitted(false);
    setSuccess(null);
    setError(null);
    setEmail("");
    setEmailExists(null);
    setEmailError(null);
    setEmailBlurred(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  // If form has been successfully submitted, show only the success message
  if (formSubmitted && success) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-green-500/10 p-4 text-sm text-green-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">{success}</p>
          </div>
          <p className="mt-2 pl-7">
            We've sent a confirmation link to your email address. Please check
            your inbox and click the link to activate your account.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleStartOver}
          className="flex w-full justify-center rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700"
        >
          Register another account
        </Button>

        <div className="text-center">
          <a
            href="/signin"
            className="text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
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
          htmlFor="name"
          className="block text-sm font-medium text-zinc-300"
        >
          Full name
        </Label>
        <div className="mt-1">
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="block text-white w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300"
        >
          Email address
        </Label>
        <div className="mt-1 relative">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailBlurred(true)}
            className={`block w-full text-white appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
              emailExists === true
                ? "border-red-500 bg-red-500/10 text-red-400 focus:border-red-500 focus:ring-red-500"
                : emailExists === false && !emailError
                ? "border-green-500 bg-green-500/10 text-green-400 focus:border-green-500 focus:ring-green-500"
                : "border-zinc-700 bg-zinc-800 text-white focus:border-amber-400 focus:ring-amber-400"
            }`}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-amber-400"></div>
            </div>
          )}
          {!isCheckingEmail && emailExists === true && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
          )}
          {!isCheckingEmail &&
            emailExists === false &&
            !emailError &&
            email.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </div>
            )}
        </div>
        {emailError && (
          <p className="mt-1 text-xs text-red-400">{emailError}</p>
        )}
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
            autoComplete="new-password"
            required
            minLength={8}
            className="block w-full text-white appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Must be at least 8 characters long
        </p>
      </div>

      <div>
        <Label
          htmlFor="inviteCode"
          className="block text-sm font-medium text-zinc-300"
        >
          Invite code
        </Label>
        <div className="mt-1">
          <Input
            id="inviteCode"
            name="inviteCode"
            type="text"
            required
            className="block w-full text-white appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-amber-400 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Ventry is invite-only. Please enter your invitation code.
        </p>
        <p className="mt-1 text-xs text-amber-400">
          For demo purposes, use: VENTRY2023
        </p>
      </div>

      <div>
        <Button
          type="submit"
          disabled={
            isLoading || emailExists === true || isProviderLoading !== null
          }
          className="flex w-full justify-center rounded-md border border-transparent bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white/10 px-2 text-zinc-400">
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
