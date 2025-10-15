"use client";

import "./globals.css";
import Navbar from "./navbar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoutes from "./router/protectedRoutes";
import ReduxProvider from "../redux/reduxProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Rutas donde NO se muestra el navbar
  const publicRoutes = ['/login', '/register'];
  const showNavbar = !publicRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ProtectedRoutes>
            <div className="layout">
              {showNavbar && <Navbar />}
              <main className={showNavbar ? "main" : ""}>
                {children}
              </main>
            </div>
          </ProtectedRoutes>
        </ReduxProvider>
      </body>
    </html>
  );
}