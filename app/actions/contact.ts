"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { getSiteSettings } from "@/lib/payload/client";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const GENERIC_ERROR_MESSAGE =
  "We couldn’t send your enquiry. Please try again or contact us by phone or email.";
const SUCCESS_MESSAGE =
  "Thanks. Your enquiry has been sent. We’ll be in touch soon.";
const TURNSTILE_ERROR_MESSAGE =
  "Please complete the security check and try again.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const turnstileToken = getField(formData, "turnstileToken");
  const requestHeaders = await headers();
  const remoteIp = requestHeaders
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const isHuman = await verifyTurnstileToken({
    token: turnstileToken,
    remoteIp,
  });

  if (!isHuman) {
    return {
      status: "error",
      message: TURNSTILE_ERROR_MESSAGE,
    };
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
  const sender = process.env.RESEND_FROM_EMAIL?.trim();

  if (
    !apiKey ||
    !recipient ||
    !EMAIL_PATTERN.test(recipient) ||
    recipient.length > 254 ||
    !sender
  ) {
    console.error(
      "Contact form is missing valid RESEND_API_KEY, CONTACT_EMAIL, or RESEND_FROM_EMAIL configuration.",
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
    const phoneDisplay = phone || "Not provided";

    const { error } = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: "New website enquiry",
      text: [
        "New website enquiry",
        "",
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phoneDisplay}`,
        `Service: ${service}`,
        "Agreement: Accepted",
        "",
        "Message:",
        message,
      ].join("\n"),
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
