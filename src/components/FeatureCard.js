import React from 'react';

export default function FeatureCard({ title, description }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/65">{description}</div>
    </div>
  );
}
