import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import Container from './Container';

export default function Navbar() {
  const location = useLocation();
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as super user
    const superUserStatus = localStorage.getItem('isSuperUser');
    setIsSuperUser(!!superUserStatus);
  }, []);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Don't render navbar if admin is logged in
  if (isSuperUser) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Ride Roam Repeat logo"
            className="h-9 w-auto object-contain"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Ride | Roam | Repeat</div>
            <div className="text-xs text-white/60">Bike rides & travel notes</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          {location.pathname === '/' ? (
            <>
            <Link className="hover:text-white" to="/home" onClick={() => window.scrollTo(0, 0)}>Home</Link>
              <a className="hover:text-white" href="#about">About</a>
              <a className="hover:text-white" href="#rides">Upcoming Rides</a>
              {/* <a className="hover:text-white" href="#destinations">Past Rides</a> */}
              {/* <a className="hover:text-white" href="#gear">Gear</a> */}
              {/* <a className="hover:text-white" href="#stories">Stories</a> */}
              <a className="hover:text-white" href="/users">Riders</a>
              <a className="hover:text-white" href="/register">Register</a>
              
            </>
          ) : (
            <>
            <Link className="hover:text-white" to="/home" onClick={() => window.scrollTo(0, 0)}>Home</Link>
              <Link className="hover:text-white" to="/#about">About</Link>
              <Link className="hover:text-white" to="/#rides">Upcoming Rides</Link>
              {/* <Link className="hover:text-white" to="/#destinations">Past Rides</Link> */}
              {/* <Link className="hover:text-white" to="/#gear">Gear</Link> */}
              {/* <Link className="hover:text-white" to="/#stories">Stories</Link> */}
              <Link className="hover:text-white" to="/users">Riders</Link>
              <Link className="hover:text-white" to="/register">Register</Link>
              
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
{/* 
        <div className="flex items-center gap-3">
          <Button variant="secondary" as="a" href="#subscribe" className="hidden sm:inline-flex">
            Get updates
          </Button>
          <Button as="a" href="#plan">
            Plan a ride
          </Button>
        </div> */}
      </Container>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur">
          <Container>
            <nav className="py-4 space-y-2">
              {location.pathname === '/' ? (
                <>
                <a className="block py-2 text-sm text-white/80 hover:text-white" href="/home" onClick={() => window.scrollTo(0, 0)}>Home</a>
                  <a className="block py-2 text-sm text-white/80 hover:text-white" href="#about">About</a>
                  <a className="block py-2 text-sm text-white/80 hover:text-white" href="#rides">Upcoming Rides</a>
                  <a className="block py-2 text-sm text-white/80 hover:text-white" href="#destinations">Past Rides</a>
                  <a className="block py-2 text-sm text-white/80 hover:text-white" href="/users">Riders</a>
                  <a className="block py-2 text-sm text-white/80 hover:text-white" href="/register">Register</a>
                  
                </>
              ) : (
                <>
                <Link className="block py-2 text-sm text-white/80 hover:text-white" to="/home" onClick={() => window.scrollTo(0, 0)}>Home</Link>
                  <Link className="block py-2 text-sm text-white/80 hover:text-white" to="/#about">About</Link>
                  <Link className="block py-2 text-sm text-white/80 hover:text-white" to="/#rides">Upcoming Rides</Link>
                  <Link className="block py-2 text-sm text-white/80 hover:text-white" to="/#destinations">Past Rides</Link>
                  <Link className="block py-2 text-sm text-white/80 hover:text-white" to="/users">Riders</Link>
                  <Link className="block py-2 text-sm text-white/80 hover:text-white" to="/register">Register</Link>
                  
                </>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
