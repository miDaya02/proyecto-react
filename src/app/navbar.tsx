"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname === "/login") {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav-bar">
        <img src="/logo.png" alt="Logo" className="logo" />
        
        <button 
          className="hamburger" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? "line line1 open" : "line line1"}></span>
          <span className={isMenuOpen ? "line line2 open" : "line line2"}></span>
          <span className={isMenuOpen ? "line line3 open" : "line line3"}></span>
        </button>

        <ul className={isMenuOpen ? "nav nav-open" : "nav"}>
          <li>
            <Link 
              href="/" 
              className={pathname === "/" ? "active" : ""}
              onClick={closeMenu}
            >
              Overview
            </Link>
          </li>
          <li>
            <Link 
              href="/contacts" 
              className={pathname === "/contacts" ? "active" : ""}
              onClick={closeMenu}
            >
              Contacts
            </Link>
          </li>
          <li>
            <Link 
              href="/favorites" 
              className={pathname === "/favorites" ? "active" : ""}
              onClick={closeMenu}
            >
              Favorites
            </Link>
          </li>
          <li>
            <Link 
              href="/new" 
              className={pathname === "/new" ? "active" : ""}
              onClick={closeMenu}
            >
              + NEW
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}