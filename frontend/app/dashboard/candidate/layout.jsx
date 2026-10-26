
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch, getCsrfCookie } from "@/src/lib/api";

export default function CandidateLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const data = await apiFetch("/api/me");

        if (!data.user) {
          throw new Error("Session invalide.");
        }

        if (data.user.role !== "candidate") {
          if (active) {
            if (data.user.role === "admin") {
              router.replace("/dashboard/admin");
            } else if (data.user.role === "company") {
              router.replace("/dashboard/company");
            } else {
              router.replace("/login");
            }
          }
          return;
        }

        if (active) {
          setUser(data.user);
        }
      } catch {
        if (active) {
          router.replace("/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      await getCsrfCookie();

      await apiFetch("/api/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch (err) {
      setError(
        err.message || "Impossible de se déconnecter. Réessayez."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const links = [
    {
      href: "/dashboard/candidate",
      label: "🏠 Tableau de bord",
      exact: true,
    },
    {
      href: "/offres",
      label: "🔎 Offres d'emploi",
    },
    {
      href: "/dashboard/candidate/applications",
      label: "📄 Mes candidatures",
    },
    {
      href: "/dashboard/candidate/favorites",
      label: "❤️ Mes favoris",
    },
    {
      href: "/dashboard/candidate/profile",
      label: "👤 Mon profil",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="w-full bg-white p-6 shadow-sm md:min-h-screen md:w-64 md:shrink-0">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          JobStage
        </Link>

        <p className="mb-6 mt-2 text-sm text-gray-500">
          Espace candidat
        </p>

        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-4 py-3 font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-gray-100 pt-5">
          <p className="truncate text-sm font-medium text-gray-800">
            {user.name}
          </p>
          <p className="truncate text-xs text-gray-500">
            {user.email}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <button
          onClick={logout}
          disabled={loggingOut}
          className="mt-5 w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          {loggingOut ? "Déconnexion..." : "↪ Déconnexion"}
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        {children}
      </main>
    </div>
  );
}
