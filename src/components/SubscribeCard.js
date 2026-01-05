import React from 'react';
import Button from './Button';

export default function SubscribeCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
      <div className="text-base font-semibold">Weekly ride + travel notes</div>
      <div className="mt-2 text-sm leading-relaxed text-white/65">
        One email. Routes, cafe stops, packing checklists, and a short story. No spam.
      </div>

      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-11 w-full flex-1 rounded-2xl border border-white/10 bg-zinc-950/40 px-4 text-sm text-white placeholder:text-white/40 focus:border-emerald-300/60 focus:outline-none"
        />
        <Button type="submit" className="h-11">
          Subscribe
        </Button>
      </form>

      <div className="mt-3 text-xs text-white/45">Unsubscribe anytime.</div>
    </div>
  );
}
