
"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { apiFetch } from "@/src/lib/api";

export default function AppShell({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        await apiFetch("/api/me");

        if (active) {
          setIsAuthenticated(true);
        }
      } catch {
        if (active) {
          setIsAuthenticated(false);
        }
      } finally {
        if (active) {
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {!checkingAuth && !isAuthenticated && <Navbar />}

      <main className="flex-1">
        {children}
      </main>

      {!checkingAuth && !isAuthenticated && <Footer />}
    </>
  );
}
