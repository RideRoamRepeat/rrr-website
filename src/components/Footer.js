import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from './Container';

export default function Footer() {
  const location = useLocation();
  
  return (
    <footer className="border-t border-white/10 py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold">Ride Roam Repeat</div>
          <div className="mt-1 text-xs text-white/60">Routes, travel notes, and gear that earns its weight.</div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          {location.pathname === '/' ? (
            <>
              <a className="hover:text-white" href="#about">About</a>
              <a className="hover:text-white" href="#rides">Rides</a>
              <a className="hover:text-white" href="#destinations">Destinations</a>
              {/* <a className="hover:text-white" href="#gear">Gear</a> */}
              {/* <a className="hover:text-white" href="#subscribe">Subscribe</a> */}
            </>
          ) : (
            <>
              <Link className="hover:text-white" to="/#about">About</Link>
              <Link className="hover:text-white" to="/#rides">Rides</Link>
              <Link className="hover:text-white" to="/#destinations">Destinations</Link>
              {/* <Link className="hover:text-white" to="/#gear">Gear</Link> */}
              {/* <Link className="hover:text-white" to="/#subscribe">Subscribe</Link> */}
            </>
          )}
          <Link className="hover:text-white text-amber-400" to="/super-user-login">Admin</Link>
          <Link className="hover:text-white" to="/register">Register</Link>
        </div>

        <div className="text-xs text-white/50">© {new Date().getFullYear()} RRR. All rights reserved.</div>
      </Container>
    </footer>
  );
}
