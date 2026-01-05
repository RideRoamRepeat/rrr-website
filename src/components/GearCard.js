import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GearCard({
  title,
  price,
  imageUrl,
  imageAlt,
  features = [],
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/accessories');
  };

  return (
    <article 
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:bg-white/7"
    >
      {imageUrl ? (
        <div className="relative aspect-[4/3] w-full">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent" />
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            {price ? (
              <div className="mt-1 text-sm text-white/60">
                ₹{price.toLocaleString('en-IN')}
              </div>
            ) : null}
          </div>
        </div>

        {features.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
              >
                {f}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
