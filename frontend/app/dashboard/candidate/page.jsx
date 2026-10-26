
"use client";

import Link from "next/link";

export default function CandidateDashboard() {
  const stats = [
    { title: "Candidatures", value: "0", icon: "📄" },
    { title: "En attente", value: "0", icon: "⏳" },
    { title: "Favoris", value: "0", icon: "❤️" },
    { title: "Entretiens", value: "0", icon: "🤝" },
  ];

  const offers = [
    {
      title: "Développeur Full Stack Junior",
      company: "Entreprise informatique",
      location: "Oujda",
      type: "Stage pré-embauche",
    },
    {
      title: "Développeur Frontend React",
      company: "Agence digitale",
      location: "Rabat",
      type: "Stage",
    },
    {
      title: "Développeur Laravel",
      company: "Société de services IT",
      location: "Casablanca",
      type: "CDI",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Tableau de bord
          </h1>

          <p className="mt-2 text-gray-500">
            Bienvenue dans votre espace candidat 👋
          </p>
        </div>

        <Link
          href="/offres"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + Trouver un stage
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col justify-between gap-4 rounded-xl bg-blue-600 p-6 text-white md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold">
            Complétez votre profil
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            Ajoutez vos compétences et votre formation pour améliorer
            votre visibilité auprès des recruteurs.
          </p>
        </div>

        <Link
          href="/dashboard/candidate/profile"
          className="shrink-0 rounded-lg bg-white px-5 py-3 text-center font-semibold text-blue-700 hover:bg-blue-50"
        >
          Compléter mon profil
        </Link>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Offres recommandées
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Des exemples d'opportunités pour commencer.
            </p>
          </div>

          <Link
            href="/offres"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Voir toutes les offres →
          </Link>
        </div>

        <div className="space-y-4">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className="flex flex-col justify-between gap-4 rounded-lg border border-gray-100 p-4 transition hover:border-blue-200 sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {offer.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {offer.company} · {offer.location}
                </p>

                <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {offer.type}
                </span>
              </div>

              <Link
                href="/offres"
                className="rounded-lg border border-blue-600 px-4 py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Voir les offres
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-gray-400">
        © 2026 JobStage — Tous droits réservés.
      </footer>
    </div>
  );
}
