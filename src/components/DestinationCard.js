import React from 'react';

export default function DestinationCard({
  name,
  vibe,
  bestTime,
  highlights = [],
  imageUrl,
  imageAlt,
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      {imageUrl ? (
        <div className="relative aspect-[16/9] w-full">
          <img
            src={imageUrl}
            alt={imageAlt || name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent" />
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">{name}</h3>
            <div className="mt-1 text-sm text-white/60">{vibe}</div>
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-2 text-xs text-white/70">{bestTime}</div>
        </div>

        {highlights.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
