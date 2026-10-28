
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";

const categories = [
  {
    icon: "⌘",
    title: "Développement Web",
    description: "Frontend, backend et applications web.",
    count: "Web & Software",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: "▣",
    title: "Développement Mobile",
    description: "Applications mobiles et expériences connectées.",
    count: "Mobile Apps",
    color: "bg-violet-50 text-violet-700",
  },
  {
    icon: "◈",
    title: "Data & Intelligence Artificielle",
    description: "Données, automatisation et intelligence artificielle.",
    count: "Data & IA",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: "✳",
    title: "Design & Création",
    description: "UI/UX, graphisme et expérience utilisateur.",
    count: "Creative",
    color: "bg-emerald-50 text-emerald-700",
  },
];

const benefits = [
  {
    number: "01",
    title: "Découvrez les opportunités",
    description:
      "Explorez les offres de stage et d'emploi adaptées à votre profil.",
    icon: "⌕",
  },
  {
    number: "02",
    title: "Valorisez vos compétences",
    description:
      "Présentez votre profil et mettez en avant vos projets et votre CV.",
    icon: "↗",
  },
  {
    number: "03",
    title: "Construisez votre avenir",
    description:
      "Passez à l'étape suivante de votre parcours professionnel.",
    icon: "✦",
  },
];

export default function Home() {
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [offersError, setOffersError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOffers() {
      try {
        const data = await apiFetch("/api/offers");

        // Laravel peut retourner une liste directe ou une pagination.
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        if (!cancelled) {
          setOffers(list);
          setOffersError("");
        }
      } catch (error) {
        if (!cancelled) {
          setOffersError(
            error.message || "Impossible de charger les offres."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingOffers(false);
        }
      }
    }

    loadOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">


      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 -z-10 h-[400px] w-[400px] rounded-full bg-orange-100/50 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Votre avenir professionnel commence ici
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.13] tracking-tight sm:text-5xl lg:text-[62px]">
              Le début de votre carrière{" "}
              <span className="relative text-blue-700">
                se construit ici.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Trouvez votre stage ou votre premier emploi au Maroc.
              Découvrez de nouvelles opportunités, valorisez vos compétences
              et rapprochez-vous de vos ambitions.
            </p>

            <form
              action="/offres"
              method="GET"
              className="mt-9 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60 sm:flex sm:items-center"
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
                <span className="text-xl text-blue-700" aria-hidden="true">
                  ⌕
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-800">
                    Que recherchez-vous ?
                  </span>
                  <input
                    type="search"
                    name="q"
                    placeholder="Poste, métier, compétence..."
                    className="mt-1 w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <div className="mx-3 hidden h-10 w-px bg-slate-200 sm:block" />

              <label className="flex min-w-0 flex-1 items-center gap-3 border-t border-slate-100 px-3 py-3 sm:border-0 sm:py-2">
                <span className="text-xl text-blue-700" aria-hidden="true">
                  ◎
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-800">
                    Où ?
                  </span>
                  <input
                    type="search"
                    name="city"
                    placeholder="Ville ou région"
                    className="mt-1 w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-blue-700 px-5 py-4 text-sm font-bold text-white transition hover:bg-blue-800 sm:mt-0 sm:w-auto"
              >
                Rechercher <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Explorez :</span>
              <Link
                href="/offres?q=Développement"
                className="transition hover:text-blue-700"
              >
                Développement
              </Link>
              <Link
                href="/offres?q=Stage"
                className="transition hover:text-blue-700"
              >
                Stages
              </Link>
              <Link
                href="/offres?q=Data"
                className="transition hover:text-blue-700"
              >
                Data & IA
              </Link>
            </div>

            <div className="mt-9 flex items-center gap-3 border-t border-slate-200 pt-6">
              <div className="flex -space-x-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-50 bg-blue-100 text-sm font-bold text-blue-800">
                  D
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-50 bg-orange-100 text-sm font-bold text-orange-700">
                  S
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-50 bg-emerald-100 text-sm font-bold text-emerald-700">
                  E
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-500">
                <span className="font-bold text-slate-800">
                  Étudiants et recruteurs
                </span>
                <br />
                Un même espace pour aller plus loin.
              </p>
            </div>
          </div>

          {/* Visual panel */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -right-5 top-10 h-28 w-28 rounded-full bg-orange-200/60 blur-2xl" />
            <div className="absolute -bottom-5 left-5 h-32 w-32 rounded-full bg-blue-300/50 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 p-5 shadow-2xl shadow-blue-950/20 sm:p-8">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/5" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-orange-400/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">
                      Votre prochaine étape
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-white">
                      Les opportunités vous attendent.
                    </h2>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl text-orange-300">
                    ↗
                  </span>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white p-5 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-black text-blue-700">
                        &lt;/&gt;
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          Développeur Web
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Stage · Informatique
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Opportunité
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["React", "Laravel", "JavaScript"].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/offres"
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                  >
                    Découvrir les offres <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <span className="text-xl text-orange-300">✦</span>
                    <p className="mt-2 font-bold text-white">Votre profil</p>
                    <p className="mt-1 text-xs leading-5 text-blue-200">
                      Mettez en avant vos compétences.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <span className="text-xl text-emerald-300">↗</span>
                    <p className="mt-2 font-bold text-white">Votre avenir</p>
                    <p className="mt-1 text-xs leading-5 text-blue-200">
                      Faites avancer votre carrière.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto mt-4 max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:absolute sm:-bottom-5 sm:-left-7 sm:mt-0">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-600">
                  ✦
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Chaque parcours compte.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Commencez par une opportunité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest offers from Laravel API */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Opportunités récentes
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Les dernières offres
              </h2>
              <p className="mt-3 text-slate-600">
                Découvrez les opportunités disponibles sur JobStage.
              </p>
            </div>

            <Link
              href="/offres"
              className="inline-flex items-center gap-2 font-bold text-blue-700 transition hover:gap-3"
            >
              Toutes les offres →
            </Link>
          </div>

          {loadingOffers && (
            <p className="mt-8 text-slate-500">Chargement des offres...</p>
          )}

          {!loadingOffers && offersError && (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
            >
              {offersError}
              <p className="mt-1 text-sm">
                Vérifiez que Laravel fonctionne et que l'API est accessible.
              </p>
            </div>
          )}

          {!loadingOffers && !offersError && offers.length === 0 && (
            <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              Aucune offre disponible pour le moment.
            </p>
          )}

          {!loadingOffers && !offersError && offers.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {offers.slice(0, 6).map((offer) => (
                <article
                  key={offer.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">
                      &lt;/&gt;
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {offer.type || "Opportunité"}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                    {offer.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    <span aria-hidden="true">📍 </span>
                    {offer.location || "Maroc"}
                  </p>

                  {offer.salary && (
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      Salaire : {offer.salary}
                    </p>
                  )}

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {offer.description ||
                      "Consultez les détails de cette opportunité."}
                  </p>

                  <Link
                    href="/offres"
                    className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
                  >
                    Voir les offres →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Explorez les domaines
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Trouvez votre voie professionnelle.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">
                Des opportunités dans plusieurs domaines pour vous aider à
                transformer vos compétences en expérience concrète.
              </p>
            </div>
            <Link
              href="/offres"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:gap-3"
            >
              Toutes les offres →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={`/offres?q=${encodeURIComponent(category.title)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold ${category.color}`}
                  >
                    {category.icon}
                  </span>
                  <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700">
                    ↗
                  </span>
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {category.count}
                </p>
                <h3 className="mt-2 text-lg font-extrabold leading-7 text-slate-900">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Simple et accessible
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Votre prochain chapitre commence ici.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Quelques étapes pour avancer vers une nouvelle expérience
              professionnelle.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.number}
                className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-700">
                    {benefit.icon}
                  </span>
                  <span className="text-3xl font-black text-slate-100">
                    {benefit.number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold">
                  {benefit.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-blue-950 px-7 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
                Vous recrutez ?
              </span>
              <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">
                Rencontrez les talents de demain.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-blue-100/80">
                Publiez vos opportunités et donnez aux étudiants et jeunes
                diplômés la chance de faire leurs premiers pas professionnels.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Rejoindre JobStage →
              </Link>
              <Link
                href="/entreprise"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Espace entreprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 font-black text-white">
              J
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              JobStage<span className="text-orange-500">.</span>
            </span>
          </Link>

          <p className="text-sm leading-6 text-slate-500">
            © {new Date().getFullYear()} JobStage. Tous droits réservés.
          </p>

          <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-500">
            <Link href="/offres" className="transition hover:text-blue-700">
              Offres
            </Link>
            <Link
              href="/entreprise"
              className="transition hover:text-blue-700"
            >
              Entreprises
            </Link>
            <Link href="/login" className="transition hover:text-blue-700">
              Connexion
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
