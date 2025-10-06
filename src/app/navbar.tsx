"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NewContactModal from "./contacts/newContact";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (pathname === "/login") return null;

  return (
    <>
      <header className="header">
        <nav className="nav-bar">
          <img src="/logo.png" alt="Logo" className="logo" />
          
          <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className={isMenuOpen ? "line line1 open" : "line line1"}></span>
            <span className={isMenuOpen ? "line line2 open" : "line line2"}></span>
            <span className={isMenuOpen ? "line line3 open" : "line line3"}></span>
          </button>

          <ul className={isMenuOpen ? "nav nav-open" : "nav"}>
            <li><Link href="/" className={pathname === "/" ? "active" : ""}>Overview</Link></li>
            <li><Link href="/contacts" className={pathname === "/contacts" ? "active" : ""}>Contacts</Link></li>
            <li><Link href="/favorites" className={pathname === "/favorites" ? "active" : ""}>Favorites</Link></li>
            <li>
              <button type="button" onClick={() => setShowModal(true)} className="new-button">
                <img src="/+.svg" className="iconMas" alt="mas"/> NEW
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {showModal && (
        <NewContactModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          userId={localStorage.getItem("id") || ""}
          onContactCreated={() => window.location.reload()}
        />
      )}
    </>
  );
}