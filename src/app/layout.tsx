import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <header className="header">
            <nav className="nav-bar">
              <img src="/logo.png" alt="Logo" className="logo" />
              <ul className="nav">
                <li><Link href="/">Overview</Link></li>
                <li><Link href="/contacts">Contacts</Link></li>
                <li><Link href="/favorites">Favorites</Link></li>
                <li><Link href="/new">+ NEW</Link></li>
              </ul>
            </nav>
          </header>

          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
