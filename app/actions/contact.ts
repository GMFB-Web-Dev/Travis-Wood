"use server";

import { Resend } from "resend";
import { getSiteSettings } from "@/lib/payload/client";
import { siteConfig } from "@/lib/seo/config";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const GENERIC_ERROR_MESSAGE =
  "We couldn’t send your enquiry. Please try again or contact us by phone or email.";
const SUCCESS_MESSAGE =
  "Thanks. Your enquiry has been sent. We’ll be in touch soon.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
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

  const apiKey = process.env.FORM_RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form is missing FORM_RESEND_API_KEY.");
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

    const fullName = `${firstName} ${lastName}`;
    const sender =
      process.env.FORM_RESEND_FROM_EMAIL?.trim() ||
      `${settings.businessName} <onboarding@resend.dev>`;
    const resend = new Resend(apiKey);
    const phoneDisplay = phone || "Not provided";

    const { error } = await resend.emails.send({
      from: sender,
      to: siteConfig.business.email,
      replyTo: email,
      subject: `Contact Us: ${service} enquiry from ${fullName}`,
      text: [
        "New website contact enquiry",
        "",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phoneDisplay}`,
        `Service: ${service}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h1 style="font-family:Arial,sans-serif;font-size:24px">New website contact enquiry</h1>
        <table cellpadding="6" cellspacing="0" style="font-family:Arial,sans-serif;font-size:16px">
          <tr><th align="left">Name</th><td>${escapeHtml(fullName)}</td></tr>
          <tr><th align="left">Email</th><td>${escapeHtml(email)}</td></tr>
          <tr><th align="left">Phone</th><td>${escapeHtml(phoneDisplay)}</td></tr>
          <tr><th align="left">Service</th><td>${escapeHtml(service)}</td></tr>
        </table>
        <h2 style="font-family:Arial,sans-serif;font-size:18px">Message</h2>
        <p style="font-family:Arial,sans-serif;font-size:16px;white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    if (error) {
      throw new Error(error.message);
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
