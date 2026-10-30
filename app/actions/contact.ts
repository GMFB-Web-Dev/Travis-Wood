"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { renderContactEnquiryEmail } from "@/emails/contact-enquiry";
import { getSiteSettings } from "@/lib/payload/client";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const GENERIC_ERROR_MESSAGE =
  "We couldn’t send your enquiry. Please try again or contact us by phone or email.";
const SUCCESS_MESSAGE =
  "Thanks. Your enquiry has been sent. We’ll be in touch soon.";
const RATE_LIMIT_MESSAGE =
  "Too many enquiries have been submitted. Please wait a few minutes and try again.";
const CONTACT_FORM_SENDER =
  "Travis Wood Builders <forms@weblaunch.co.nz>";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_MAX_CLIENTS = 10_000;

type HeaderReader = {
  get(name: string): string | null;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  contactFormRateLimits?: Map<string, RateLimitEntry>;
};

const contactFormRateLimits =
  globalRateLimit.contactFormRateLimits ?? new Map<string, RateLimitEntry>();

globalRateLimit.contactFormRateLimits = contactFormRateLimits;

function getField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getFirstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function isSameOriginRequest(requestHeaders: HeaderReader) {
  const origin = requestHeaders.get("origin");
  const requestHost =
    getFirstHeaderValue(requestHeaders.get("x-forwarded-host")) ??
    getFirstHeaderValue(requestHeaders.get("host"));

  if (!origin || !requestHost) return false;

  try {
    const originUrl = new URL(origin);
    const forwardedProtocol = getFirstHeaderValue(
      requestHeaders.get("x-forwarded-proto"),
    );

    if (originUrl.protocol !== "http:" && originUrl.protocol !== "https:") {
      return false;
    }

    if (originUrl.host.toLowerCase() !== requestHost.toLowerCase()) {
      return false;
    }

    return (
      !forwardedProtocol ||
      `${forwardedProtocol.toLowerCase()}:` === originUrl.protocol
    );
  } catch {
    return false;
  }
}

function getClientIp(requestHeaders: HeaderReader) {
  return (
    getFirstHeaderValue(requestHeaders.get("x-forwarded-for")) ??
    getFirstHeaderValue(requestHeaders.get("x-real-ip")) ??
    "unknown"
  );
}

function isRateLimited(clientIp: string, now = Date.now()) {
  const existing = contactFormRateLimits.get(clientIp);

  if (!existing || existing.resetAt <= now) {
    if (contactFormRateLimits.size >= RATE_LIMIT_MAX_CLIENTS) {
      for (const [storedIp, entry] of contactFormRateLimits) {
        if (entry.resetAt <= now) contactFormRateLimits.delete(storedIp);
      }

      if (contactFormRateLimits.size >= RATE_LIMIT_MAX_CLIENTS) return true;
    }

    contactFormRateLimits.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) return true;

  existing.count += 1;
  return false;
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const requestHeaders = await headers();

  // Next.js also performs this Origin-to-Host CSRF check for Server Actions.
  // Requiring it here keeps this email action closed to same-site requests.
  if (!isSameOriginRequest(requestHeaders)) {
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }

  const firstName = getField(formData, "firstName");
  const lastName = getField(formData, "lastName");
  const email = getField(formData, "email").toLowerCase();
  const phone = getField(formData, "phone");
  const service = getField(formData, "service");
  const message = getField(formData, "message");
  const agreement = getField(formData, "agreement");
  const website = getField(formData, "website");

  // Silently accept likely bot submissions without sending an email.
  if (website) {
    return {
      status: "success",
      message: SUCCESS_MESSAGE,
    };
  }

  if (isRateLimited(getClientIp(requestHeaders))) {
    return { status: "error", message: RATE_LIMIT_MESSAGE };
  }

  if (
    !firstName ||
    firstName.length > 80 ||
    !lastName ||
    lastName.length > 80 ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    phone.length > 40 ||
    !service ||
    service.length > 100 ||
    !message ||
    message.length > 4_000 ||
    agreement !== "accepted"
  ) {
    return {
      status: "error",
      message: "Please complete all required fields with valid details.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.CONTACT_EMAIL?.trim();

  if (
    !apiKey ||
    !recipient ||
    !EMAIL_PATTERN.test(recipient) ||
    recipient.length > 254
  ) {
    console.error(
      "Contact form is missing valid RESEND_API_KEY or CONTACT_EMAIL configuration.",
    );
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }

  try {
    const settings = await getSiteSettings();
    const allowedServices = new Set(
      settings.contactForm.serviceOptions.map((option) => option.label),
    );

    if (!allowedServices.has(service)) {
      return {
        status: "error",
        message: "Please select one of the available services.",
      };
    }

    const resend = new Resend(apiKey);
    const emailContent = renderContactEnquiryEmail({
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
    });

    const { error } = await resend.emails.send({
      from: CONTACT_FORM_SENDER,
      to: recipient,
      replyTo: email,
      subject: "New website enquiry",
      html: emailContent.html,
      text: emailContent.text,
    });

    if (error) {
      console.error("Resend rejected the contact form email:", error.message);
      return { status: "error", message: GENERIC_ERROR_MESSAGE };
    }

    return {
      status: "success",
      message: SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error(
      "Contact form email failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }
}
