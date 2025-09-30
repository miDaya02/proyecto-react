"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="header">
      <nav className="nav-bar">
        <img src="/logo.png" alt="Logo" className="logo" />
        <ul className="nav">
          <li>
            <Link 
              href="/" 
              className={pathname === "/" ? "active" : ""}
            >
              Overview
            </Link>
          </li>
          <li>
            <Link 
              href="/contacts" 
              className={pathname === "/contacts" ? "active" : ""}
            >
              Contacts
            </Link>
          </li>
          <li>
            <Link 
              href="/favorites" 
              className={pathname === "/favorites" ? "active" : ""}
            >
              Favorites
            </Link>
          </li>
          <li>
            <Link 
              href="/new" 
              className={pathname === "/new" ? "active" : ""}
            >
              + NEW
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}