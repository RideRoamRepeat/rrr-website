import React from 'react';
import Container from './Container';

export default function SectionHeading({ id, eyebrow, title, description }) {
  return (
    <Container>
      <div id={id} className="scroll-mt-24">
        {eyebrow ? <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300/90">{eyebrow}</div> : null}
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">{description}</p> : null}
      </div>
    </Container>
  );
}
