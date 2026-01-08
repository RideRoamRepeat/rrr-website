import React from 'react';
import Button from './Button';
import Container from './Container';

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute -right-24 top-12 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <Container className="relative py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              New: Weekend ride guides + travel mini-itineraries
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Ride. Roam. Repeat.
              {/* <span className="block text-white/70">Bike Rides & Travel — Built for the Weekend.</span> */}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              From misty mountain roads to sunrise highways, we plan rides that balance adventure, comfort, and unforgettable memories. Whether it’s a short weekend escape or a long scenic ride, every journey is thoughtfully curated for real riders.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as="a" href="#rides">Explore rides</Button>
              {/* <Button as="a" href="#stories" variant="secondary">
                Read travel stories
              </Button>
              <Button as="a" href="#gear" variant="ghost" className="sm:ml-2">
                View gear list
              </Button> */}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Rides logged" value="0" />
            <Stat label="Best season" value="Oct–Feb" />
            <Stat label="Coffee stops" value="Uncountable" />
            <div className="sm:col-span-3">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
                <div className="text-sm font-semibold">Today’s pick</div>
                <div className="mt-2 text-white/80">Sunrise loop · 42 km · rolling climbs · coastal wind</div>
                <div className="mt-4 flex gap-2 text-xs text-white/60">
                  <span className="rounded-full bg-white/5 px-3 py-1">Road</span>
                  <span className="rounded-full bg-white/5 px-3 py-1">Beginner-friendly</span>
                  <span className="rounded-full bg-white/5 px-3 py-1">Cafe stop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
