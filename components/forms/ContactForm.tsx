"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/actions/contact";
import { ActionButton } from "@/components/ui/Button";
import type { ContactFormSettings } from "@/lib/payload/types";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  surfaceClassName: string;
  autoComplete: string;
  required?: boolean;
  maxLength: number;
};

function Field({
  id,
  label,
  type = "text",
  placeholder,
  surfaceClassName,
  autoComplete,
  required = false,
  maxLength,
}: FieldProps) {
  return (
    <label htmlFor={id} className="flex min-w-0 flex-1 flex-col gap-2 text-base font-light uppercase leading-6 text-white">
      {label}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        className={`h-12 rounded-lg border-[0.5px] border-brand-gold px-4 py-3 text-base font-light normal-case text-white placeholder:text-white/70 ${surfaceClassName}`}
      />
    </label>
  );
}

type ContactFormProps = {
  surface?: "black" | "navy";
  className?: string;
  settings: ContactFormSettings;
  phonePlaceholder: string;
};

export function ContactForm({
  surface = "black",
  className = "",
  settings,
  phonePlaceholder,
}: ContactFormProps) {
  const initialState: ContactFormState = { status: "idle", message: "" };
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const surfaceClassName = surface === "navy" ? "bg-brand-navy" : "bg-black";

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={`flex min-w-0 flex-1 flex-col gap-6 ${className}`}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="firstName" label="First Name" placeholder="First name" surfaceClassName={surfaceClassName} autoComplete="given-name" required maxLength={80} />
        <Field id="lastName" label="Last Name" placeholder="Last name" surfaceClassName={surfaceClassName} autoComplete="family-name" required maxLength={80} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="email" label="Email" type="email" placeholder="Email" surfaceClassName={surfaceClassName} autoComplete="email" required maxLength={254} />
        <Field id="phone" label="Phone Number" type="tel" placeholder={phonePlaceholder} surfaceClassName={surfaceClassName} autoComplete="tel" maxLength={40} />
      </div>
      <label htmlFor="service" className="flex flex-col gap-1.5 text-base font-light uppercase leading-6 text-white">
        Select a Service
        <select id="service" name="service" defaultValue="" required className={`h-12 rounded-lg border-[0.5px] border-brand-gold px-4 text-base font-light normal-case text-white ${surfaceClassName}`}>
          <option value="" disabled>Select Service..</option>
          {settings.serviceOptions.map((option) => (
            <option key={option.label} value={option.label}>{option.label}</option>
          ))}
        </select>
      </label>
      <label htmlFor="message" className="flex flex-col gap-2 text-base font-light uppercase leading-6 text-white">
        Message
        <textarea id="message" name="message" rows={6} placeholder="Type your message here..." required maxLength={4000} className={`min-h-[176px] resize-y rounded-lg border-[0.5px] border-brand-gold px-4 py-3 text-base font-light normal-case text-white placeholder:text-white/70 ${surfaceClassName}`} />
      </label>
      <label className="flex items-start gap-2 text-base font-light leading-6 text-white sm:text-lg">
        <input name="agreement" value="accepted" type="checkbox" required className="mt-1 size-4 accent-[#f4c752]" />
        {settings.agreementLabel}
      </label>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <ActionButton
          type="submit"
          disabled={pending}
          aria-describedby="contact-form-status"
          className={`px-[34px] disabled:cursor-wait disabled:opacity-60 ${pending ? "pointer-events-none" : ""}`}
        >
          {pending ? "Sending…" : settings.submitLabel}
        </ActionButton>
        <p
          id="contact-form-status"
          role="status"
          aria-live="polite"
          className={`mt-3 min-h-5 text-sm ${state.status === "error" ? "text-red-300" : "text-brand-gold"}`}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
