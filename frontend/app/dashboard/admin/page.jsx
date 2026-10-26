
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const data = await apiFetch("/api/me");
        const currentUser = data.user;

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        if (currentUser.role !== "admin") {
          if (currentUser.role === "candidate") {
            router.replace("/dashboard/candidate");
          } else if (currentUser.role === "company") {
            router.replace("/dashboard/company");
          } else {
            router.replace("/login");
          }
          return;
        }

        if (active) setUser(currentUser);
      } catch (error) {
        console.error("Erreur de vérification :", error);
        router.replace("/login");
      } finally {
        if (active) setChecking(false);
      }
    }

    checkUser();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return <p className="text-gray-500">Chargement du tableau de bord...</p>;
  }

  if (!user || user.role !== "admin") return null;

  const stats = [
    { title: "Utilisateurs", value: "0", icon: "👥" },
    { title: "Offres d'emploi", value: "0", icon: "💼" },
    { title: "Entreprises", value: "0", icon: "🏢" },
    { title: "Candidatures", value: "0", icon: "📄" },
  ];

  const activities = [
    {
      title: "Gestion des utilisateurs",
      description: "Consultez les comptes candidats et entreprises.",
      icon: "👥",
      href: "/dashboard/admin/users",
    },
    {
      title: "Gestion des offres",
      description: "Consultez et modérez les offres publiées.",
      icon: "💼",
      href: "/dashboard/admin/offers",
    },
    {
      title: "Gestion des catégories",
      description: "Organisez les catégories des offres.",
      icon: "📂",
      href: "/dashboard/admin/categories",
    },
    {
      title: "Gestion des candidatures",
      description: "Consultez les candidatures de la plateforme.",
      icon: "📋",
      href: "/dashboard/admin/applications",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Espace administrateur
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Tableau de bord
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Bienvenue {user.name || "Administrateur"} 👋
        </p>
      </header>

      <section className="mb-8 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white">
        <h2 className="text-2xl font-bold">
          Gérez votre plateforme en un seul endroit.
        </h2>

        <p className="mt-3 text-sm leading-6 text-blue-100">
          Suivez les utilisateurs, contrôlez les offres d'emploi
          et organisez les catégories de JobStage.
        </p>

        <a
          href="/dashboard/admin/users"
          className="mt-5 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
        >
          Gérer les utilisateurs →
        </a>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{stat.title}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              À connecter à la base de données
            </p>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-2 text-xl font-bold text-slate-900">
          Gestion de la plateforme
        </h2>

        <p className="mb-5 text-sm text-slate-500">
          Accédez rapidement aux principales fonctionnalités.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {activities.map((activity) => (
            <a
              key={activity.title}
              href={activity.href}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <span className="text-2xl">{activity.icon}</span>

              <h3 className="mt-3 font-semibold text-slate-900">
                {activity.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {activity.description}
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600">
                Accéder à la gestion →
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
