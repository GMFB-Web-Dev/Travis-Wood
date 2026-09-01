"use client";

import { useState, type FormEvent } from "react";
import { ActionButton } from "@/components/ui/Button";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
};

function Field({ id, label, type = "text", placeholder }: FieldProps) {
  return (
    <label htmlFor={id} className="flex min-w-0 flex-1 flex-col gap-2 text-base font-light uppercase leading-6 text-white">
      {label}
      <input id={id} name={id} type={type} placeholder={placeholder} className="h-12 rounded-lg border-[0.5px] border-brand-gold bg-black px-4 py-3 text-base font-light normal-case text-white placeholder:text-white/70" />
    </label>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="firstName" label="First Name" placeholder="First name" />
        <Field id="lastName" label="Last Name" placeholder="Last name" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="email" label="Email" type="email" placeholder="Email" />
        <Field id="phone" label="Phone Number" type="tel" placeholder="021 221 9834" />
      </div>
      <label htmlFor="service" className="flex flex-col gap-1.5 text-base font-light uppercase leading-6 text-white">
        Select a Service
        <select id="service" name="service" defaultValue="" className="h-12 rounded-lg border-[0.5px] border-brand-gold bg-black px-4 text-base font-light normal-case text-white">
          <option value="" disabled>Select Service..</option>
          <option>New Builds</option>
          <option>Outdoor Living</option>
          <option>Renovations & Extensions</option>
        </select>
      </label>
      <label htmlFor="message" className="flex flex-col gap-2 text-base font-light uppercase leading-6 text-white">
        Message
        <textarea id="message" name="message" rows={6} placeholder="Type your message here..." className="min-h-[176px] resize-y rounded-lg border-[0.5px] border-brand-gold bg-black px-4 py-3 text-base font-light normal-case text-white placeholder:text-white/70" />
      </label>
      <label className="flex items-start gap-2 text-base font-light leading-6 text-white sm:text-lg">
        <input type="checkbox" required className="mt-1 size-4 accent-[#f4c752]" />
        I agree to the terms and conditions
      </label>
      <div>
        <ActionButton type="submit" className="px-[34px]">Submit</ActionButton>
        {sent && <p role="status" className="mt-3 text-sm text-brand-gold">Thanks. Your project enquiry is ready to be connected to the site&apos;s form service.</p>}
      </div>
    </form>
  );
}
