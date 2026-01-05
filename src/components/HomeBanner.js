import React from 'react';
import Button from './Button';
import Container from './Container';

export default function HomeBanner() {
  return (
    <section className="overflow-hidden border-b border-white/10">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 [background-image:url('https://scontent.cdninstagram.com/v/t51.82787-15/537069987_18418693981101174_4449293378233500287_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzcwNjU2NDYzNzc4ODIxNzEyMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4OTU5LnNkci5DMyJ9&_nc_ohc=Ylz_TWt_dGgQ7kNvwEJr5H-&_nc_oc=Adk-Qzs_6svuUIPsehYlg63A-bp2xMGahl-Yt2xw7aljWfbjy8GwrGkTLEX8SPvmo8Ht0q56mV4BOMC7Pvsu47tZ&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=RWvXoqyCttt2N3diuqr75Q&oh=00_AfoWqrkVN2-IKpchzXm8An2PhwlXw2OL52bVgdttdNGGAQ&oe=6961B45D')]" />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/80 via-zinc-950/60 to-zinc-950/90" />
      </div>
      
      {/* Existing gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.14),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-24 -top-10 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <Container className="relative py-10 sm:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              New season rides are live
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Bike rides + travel, curated for weekends.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Route guides, destination notes, and gear checklists — designed to get you out the door
              faster.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button as="a" href="#rides">
              Browse rides
            </Button>
            <Button as="a" href="#subscribe" variant="secondary">
              Subscribe
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
