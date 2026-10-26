import Link from "next/link";
import React from "react";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-extrabold text-blue-700">
            JobStage<span className="text-orange-500">.</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-blue-700">
              Accueil
            </Link>
            <Link
              href="/offres"
              className="text-sm font-medium hover:text-blue-700"
            >
              Offres
            </Link>
            <Link
              href="/entreprise"
              className="text-sm font-medium hover:text-blue-700"
            >
              Entreprises
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 font-semibold hover:bg-slate-100 sm:block"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800"
            >
              S'inscrire
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Votre carrière commence ici
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Trouvez votre prochain{" "}
            <span className="text-blue-700">stage ou emploi</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Découvrez des opportunités au Maroc, développez vos compétences
            et faites le premier pas vers votre avenir professionnel.
          </p>

          {/* Search */}
          <form
            action="/offres"
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-slate-200 sm:flex-row"
          >
            <input
              type="search"
              name="q"
              placeholder="Poste, compétence..."
              className="min-w-0 flex-1 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="search"
              name="city"
              placeholder="Ville"
              className="min-w-0 flex-1 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Rechercher
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            Stage · Premier emploi · Opportunités au Maroc
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Explorez les catégories</h2>
            <p className="mt-3 text-slate-600">
              Trouvez une opportunité qui correspond à vos compétences.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "💻", title: "Développement Web", count: "IT & Digital" },
              { icon: "📱", title: "Développement Mobile", count: "Applications" },
              { icon: "📊", title: "Data & Intelligence Artificielle", count: "Data & IA" },
              { icon: "🎨", title: "Design", count: "UI/UX & Création" },
            ].map((category) => (
              <a
                key={category.title}
                href="/offres"
                className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <span className="text-3xl">{category.icon}</span>
                <h3 className="mt-4 font-bold">{category.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{category.count}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-blue-700 p-8 text-white md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Vous recrutez des stagiaires ?
            </h2>
            <p className="mt-3 max-w-xl text-blue-100">
              Publiez vos offres et trouvez les candidats qui correspondent
              à vos besoins.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Rejoindre JobStage
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} JobStage. Tous droits réservés.</p>
          <p>Votre avenir professionnel commence ici.</p>
        </div>
      </footer>
    </main>
  );
}
