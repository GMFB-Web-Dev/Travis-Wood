"use client";

import Script from "next/script";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { turnstileConfig } from "@/lib/turnstile/config";

type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  theme: "dark";
  size: "flexible";
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
  "response-field": false;
};

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions,
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileWidgetHandle = {
  reset: () => void;
};

type TurnstileWidgetProps = {
  onVerifiedChange: (verified: boolean) => void;
};

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  TurnstileWidgetProps
>(function TurnstileWidget({ onVerifiedChange }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const responseInputRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        const widgetId = widgetIdRef.current;

        if (widgetId && window.turnstile) {
          window.turnstile.reset(widgetId);
        }

        if (responseInputRef.current) {
          responseInputRef.current.value = "";
        }
        onVerifiedChange(false);
      },
    }),
    [onVerifiedChange],
  );

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile) {
      return;
    }

    const container = containerRef.current;

    if (!widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: turnstileConfig.siteKey,
        action: turnstileConfig.action,
        theme: "dark",
        size: "flexible",
        callback: (token) => {
          if (responseInputRef.current) {
            responseInputRef.current.value = token;
          }
          onVerifiedChange(Boolean(token));
        },
        "error-callback": () => {
          if (responseInputRef.current) {
            responseInputRef.current.value = "";
          }
          onVerifiedChange(false);
        },
        "expired-callback": () => {
          if (responseInputRef.current) {
            responseInputRef.current.value = "";
          }
          onVerifiedChange(false);
        },
        "response-field": false,
      });
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onVerifiedChange, scriptReady]);

  return (
    <div className="min-h-[65px] w-full max-w-[300px]">
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          setScriptFailed(false);
          setScriptReady(true);
        }}
        onError={() => {
          setScriptFailed(true);
          if (responseInputRef.current) {
            responseInputRef.current.value = "";
          }
          onVerifiedChange(false);
        }}
      />
      <div ref={containerRef} aria-label="Cloudflare security check" />
      <input
        ref={responseInputRef}
        type="hidden"
        name="turnstileToken"
      />
      {scriptFailed ? (
        <p className="text-sm text-red-300" role="alert">
          The security check could not load. Please refresh and try again.
        </p>
      ) : null}
    </div>
  );
});
