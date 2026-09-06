import "server-only";

import { siteConfig } from "@/lib/seo/config";
import { turnstileConfig } from "@/lib/turnstile/config";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2_048;

type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
};

type VerifyTurnstileTokenOptions = {
  token: string;
  remoteIp?: string;
};

export async function verifyTurnstileToken({
  token,
  remoteIp,
}: VerifyTurnstileTokenOptions) {
  const secret = process.env.TURNSTILE_SECRET?.trim();
  const expectedHostname = new URL(siteConfig.url).hostname.toLowerCase();

  if (!secret) {
    console.error("Turnstile is missing TURNSTILE_SECRET.");
    return false;
  }

  if (!token || token.length > MAX_TOKEN_LENGTH) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as SiteverifyResponse;

    return (
      result.success === true &&
      result.action === turnstileConfig.action &&
      typeof result.hostname === "string" &&
      result.hostname.toLowerCase() === expectedHostname
    );
  } catch {
    return false;
  }
}
