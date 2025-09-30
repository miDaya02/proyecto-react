import "./globals.css";
import Navbar from "./navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Navbar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}