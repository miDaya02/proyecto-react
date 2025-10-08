import "./globals.css";
import Navbar from "./navbar";
import { ReactNode } from "react";
import ProtectedRoutes from "./protectedRoutes";
import ReduxProvider from "../redux/reduxProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ProtectedRoutes>
            <div className="layout">
              <Navbar />
              <main className="main">{children}</main>
            </div>
          </ProtectedRoutes>
        </ReduxProvider>
      </body>
    </html>
  );
}