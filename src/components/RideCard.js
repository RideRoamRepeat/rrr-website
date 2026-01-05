import React from 'react';

export default function RideCard({
  rideData,
  handleNavigate,
}) {
  const {
    id,
    name,
    location,
    distanceKm,
    elevationM,
    time,
    imageUrl,
    tags,
    itinerary,
    difficulty,
    meetup,
    requirements,
    highlights,
    description,
    selectedRiders
  } = rideData;

  const handleClick = () => {
    const rideDataToPass = {
      id,
      title: location || 'Unknown Location',
      location: name || 'Unknown',
      distanceKm: distanceKm || 0,
      elevationM: elevationM || 0,
      time: time || 'Unknown',
      imageUrl,
      imageAlt: "Coastal road at sunrise",
      tags: tags || [],
      itinerary: itinerary || [],
      difficulty: difficulty || 'Unknown',
      meetup: meetup || 'Unknown',
      requirements: requirements || [],
      highlights: highlights || tags || [],
      description: description || 'Unknown',
      selectedRiders: selectedRiders || []
    };
    handleNavigate(rideDataToPass);
  };

  return (
    <article 
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:bg-white/7"
    >
      {imageUrl ? (
        <div className="relative aspect-[16/9] w-full">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent" />
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold leading-snug">{name}</h3>
            <div className="mt-1 text-sm text-white/60">{location}</div>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400/80 to-sky-400/80 opacity-90 transition group-hover:opacity-100" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-white/60">Distance</div>
            <div className="mt-1 font-semibold">{distanceKm} km</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-white/60">Elevation</div>
            <div className="mt-1 font-semibold">{elevationM} m</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-white/60">Time</div>
            <div className="mt-1 font-semibold">{time}</div>
          </div>
        </div>

        {tags && tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {(Array.isArray(tags) ? tags : [tags]).map((t, index) => (
              <span key={index} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
