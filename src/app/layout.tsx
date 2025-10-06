import "./globals.css";
import Navbar from "./navbar";
import { ReactNode } from "react";
import ProtectedRoutes from "./protectedRoutes";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoutes>
          <div className="layout">
            <Navbar />
            <main className="main">{children}</main>
          </div>
        </ProtectedRoutes>
      </body>
    </html>
  );
}