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
  callback: () => void;
  "error-callback": () => void;
  "expired-callback": () => void;
  "response-field": true;
  "response-field-name": "cf-turnstile-response";
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
        callback: () => onVerifiedChange(true),
        "error-callback": () => onVerifiedChange(false),
        "expired-callback": () => onVerifiedChange(false),
        "response-field": true,
        "response-field-name": "cf-turnstile-response",
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
          onVerifiedChange(false);
        }}
      />
      <div ref={containerRef} aria-label="Cloudflare security check" />
      {scriptFailed ? (
        <p className="text-sm text-red-300" role="alert">
          The security check could not load. Please refresh and try again.
        </p>
      ) : null}
    </div>
  );
});
