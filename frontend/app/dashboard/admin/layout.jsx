
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch, getCsrfCookie } from "@/src/lib/api";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await getCsrfCookie();

      await apiFetch("/api/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      setLoggingOut(false);
    }
  }

  const links = [
    { href: "/dashboard/admin", label: "🏠 Tableau de bord" },
    { href: "/dashboard/admin/users", label: "👥 Utilisateurs" },
    { href: "/dashboard/admin/offers", label: "💼 Offres d'emploi" },
    { href: "/dashboard/admin/categories", label: "📂 Catégories" },
    { href: "/dashboard/admin/applications", label: "📋 Candidatures" },
    { href: "/dashboard/admin/settings", label: "⚙️ Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-auto bg-slate-950 p-6 text-white">
        <Link href="/" className="text-2xl font-bold">
          Job<span className="text-blue-400">Stage</span>
        </Link>

        <p className="mb-8 mt-2 text-sm text-slate-400">
          Administration
        </p>

        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-6 w-full rounded-lg px-4 py-3 text-left text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          {loggingOut ? "Déconnexion..." : "🚪 Déconnexion"}
        </button>
      </aside>

      <main className="ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
