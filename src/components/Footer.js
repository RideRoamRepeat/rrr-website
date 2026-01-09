import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from './Container';

export default function Footer() {
  const location = useLocation();
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as super user
    const checkSuperUserStatus = () => {
      const superUserStatus = localStorage.getItem('isSuperLogin');
      console.log('Footer: Checking super user status:', superUserStatus);
      setIsSuperUser(superUserStatus);
    };

    // Check immediately
    checkSuperUserStatus();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'isSuperLogin') {
        checkSuperUserStatus();
      }
    };
    
    // Listen for custom auth change events
    const handleAuthChange = () => {
      checkSuperUserStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  console.log("JHVKJDSCVJCSJCSJKC isSuperUser ", isSuperUser);
  
  
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
          {(isSuperUser === 'true') && (
            <Link className="hover:text-white text-amber-400" to="/super-user-login">Admin</Link>
          )}
          <Link className="hover:text-white" to="/register">Register</Link>
        </div>

        <div className="text-xs text-white/50">© {new Date().getFullYear()} RRR. All rights reserved.</div>
      </Container>
    </footer>
  );
}
