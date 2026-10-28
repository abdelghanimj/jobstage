
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

const offerTypes = [
  { value: "", label: "Tous les types" },
  { value: "stage", label: "Stage" },
  { value: "emploi", label: "Emploi" },
  { value: "freelance", label: "Freelance" },
  { value: "alternance", label: "Alternance" },
];

export default function OffresPage() {
  const router = useRouter();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    setCity(params.get("city") || "");
    setType(params.get("type") || "");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOffers() {
      setLoading(true);
      setError("");

      try {
        const result = await apiFetch("/api/offers");

        const list = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        if (!cancelled) {
          setOffers(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Impossible de récupérer les offres. Vérifiez la connexion à l'API."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOffers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    const normalizedCity = city.trim().toLocaleLowerCase("fr");
    const normalizedType = type.trim().toLocaleLowerCase("fr");

    return offers.filter((offer) => {
      const title = String(offer.title || "").toLocaleLowerCase("fr");
      const description = String(
        offer.description || ""
      ).toLocaleLowerCase("fr");
      const location = String(
        offer.location || ""
      ).toLocaleLowerCase("fr");
      const offerType = String(offer.type || "").toLocaleLowerCase("fr");

      const matchesQuery =
        !normalizedQuery ||
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        offerType.includes(normalizedQuery);

      const matchesCity =
        !normalizedCity || location.includes(normalizedCity);

      const matchesType =
        !normalizedType || offerType.includes(normalizedType);

      return matchesQuery && matchesCity && matchesType;
    });
  }, [offers, query, city, type]);

  function handleSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (city.trim()) params.set("city", city.trim());
    if (type) params.set("type", type);

    const search = params.toString();
    router.push(search ? `/offres?${search}` : "/offres");
  }

  function resetSearch() {
    setQuery("");
    setCity("");
    setType("");
    router.push("/offres");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      

      {/* Page heading */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
            Votre prochaine opportunité
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Trouvez le stage ou l'emploi qui vous correspond.
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-blue-100/80">
            Explorez les opportunités disponibles et trouvez celle qui
            correspond à vos compétences et à vos objectifs professionnels.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              Opportunités au Maroc
            </span>
            <span className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              Stages et premiers emplois
            </span>
          </div>
        </div>
      </section>

      {/* Search and results */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_auto]"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Poste ou compétence
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex. Laravel, React, développeur..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Ville
            </span>
            <input
              type="search"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ex. Oujda, Nador..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Type de contrat
            </span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {offerTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 xl:w-auto"
            >
              Rechercher
            </button>
          </div>
        </form>

        <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black">
              Les offres disponibles
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {loading
                ? "Chargement des opportunités..."
                : `${filteredOffers.length} offre(s) trouvée(s)`}
            </p>
          </div>

          {(query || city || type) && (
            <button
              type="button"
              onClick={resetSearch}
              className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 sm:self-auto"
            >
              Effacer les filtres
            </button>
          )}
        </div>

        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-6 h-4 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6"
          >
            <h3 className="font-bold text-red-800">
              Erreur de chargement
            </h3>
            <p className="mt-2 text-sm leading-6 text-red-700">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-800"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && filteredOffers.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-700">
              ⌕
            </div>
            <h3 className="mt-5 text-xl font-extrabold">
              Aucune offre trouvée
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Essayez un autre poste, une autre ville ou supprimez les
              filtres pour afficher toutes les opportunités.
            </p>
            <button
              type="button"
              onClick={resetSearch}
              className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
            >
              Voir toutes les offres
            </button>
          </div>
        )}

        {!loading && !error && filteredOffers.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer) => (
              <article
                key={offer.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-black text-blue-700">
                    &lt;/&gt;
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    {offer.type || "Opportunité"}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-extrabold leading-7 text-slate-900 transition group-hover:text-blue-700">
                  {offer.title || "Offre sans titre"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  <span aria-hidden="true">📍 </span>
                  {offer.location || "Maroc"}
                </p>

                {offer.salary && (
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Salaire : {offer.salary}
                  </p>
                )}

                <p className="mt-4 line-clamp-4 flex-1 text-sm leading-6 text-slate-600">
                  {offer.description ||
                    "Consultez les détails de cette opportunité."}
                </p>

                {offer.application_deadline && (
                  <p className="mt-4 text-xs text-slate-500">
                    Date limite : {String(offer.application_deadline).slice(0, 10)}
                  </p>
                )}

                <Link
                  href={`/offres/${offer.id}`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Voir les détails <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 font-black text-white">
              J
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              JobStage<span className="text-orange-500">.</span>
            </span>
          </Link>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} JobStage. Tous droits réservés.
          </p>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-blue-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </footer>
    </main>
  );
}
