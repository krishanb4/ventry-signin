"use server"

// This function validates an email format without submitting to Supabase
export async function validateEmailFormat(email: string) {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidFormat = emailRegex.test(email)

  if (!isValidFormat) {
    return {
      isValid: false,
      message: "Please enter a valid email address",
    }
  }

  return {
    isValid: true,
    message: "Email format is valid",
  }
}

// This function will check if the email is from common domains
// This is just a simple client-side check that doesn't hit the database
export async function isCommonEmail(email: string) {
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "mail.com",
  ]

  const domain = email.split("@")[1]?.toLowerCase()
  return commonDomains.includes(domain)
}

