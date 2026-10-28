"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";

const API_URL = "http://localhost:8000";

function getLogoUrl(logoPath) {
  if (!logoPath) return null;

  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    return logoPath;
  }

  return `${API_URL}/storage/${logoPath.replace(/^\/+/, "")}`;
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function EntreprisePage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  async function loadCompanies() {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/api/companies");
      const list = Array.isArray(response)
        ? response
        : response.data;

      setCompanies(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(
        err.message ||
          "Impossible de charger les entreprises pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  const cities = useMemo(
    () =>
      [...new Set(companies.map((company) => company.city).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [companies]
  );

  const industries = useMemo(
    () =>
      [
        ...new Set(
          companies.map((company) => company.industry).filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [companies]
  );

  const filteredCompanies = useMemo(() => {
    const term = search.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        !term ||
        [
          company.company_name,
          company.description,
          company.industry,
          company.city,
        ].some((value) => value?.toLowerCase().includes(term));

      const matchesCity =
        !cityFilter || company.city === cityFilter;

      const matchesIndustry =
        !industryFilter || company.industry === industryFilter;

      return matchesSearch && matchesCity && matchesIndustry;
    });
  }, [companies, search, cityFilter, industryFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
              Découvrez nos entreprises
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Trouvez une entreprise qui vous correspond
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              Explorez les entreprises présentes sur JobStage, découvrez
              leurs domaines d'activité et trouvez celles qui correspondent
              à vos ambitions professionnelles.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#entreprises"
                className="rounded-xl bg-white px-6 py-3 font-bold text-blue-800 transition hover:bg-blue-50"
              >
                Explorer les entreprises
              </a>

              <Link
                href="/offres"
                className="rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Voir les offres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section
        id="entreprises"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Annuaire
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              Nos entreprises
            </h2>
            <p className="mt-2 text-slate-500">
              Recherchez une entreprise par nom, ville ou domaine.
            </p>
          </div>

          {!loading && !error && (
            <p className="text-sm font-medium text-slate-500">
              {filteredCompanies.length} entreprise
              {filteredCompanies.length !== 1 ? "s" : ""} trouvée
              {filteredCompanies.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <div>
            <label
              htmlFor="company-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Rechercher
            </label>
            <input
              id="company-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom, domaine, description..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="city-filter"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Ville
            </label>
            <select
              id="city-filter"
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="industry-filter"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Domaine d'activité
            </label>
            <select
              id="industry-filter"
              value={industryFilter}
              onChange={(event) => setIndustryFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Tous les domaines</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-6 h-3 rounded bg-slate-100" />
                <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              Chargement impossible
            </h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={loadCompanies}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Company cards */}
        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => {
              const logoUrl = getLogoUrl(
                company.logo_path || company.logo
              );

              return (
                <article
                  key={company.id}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`Logo ${company.company_name}`}
                        className="h-16 w-16 rounded-2xl border border-slate-100 object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-extrabold text-blue-700">
                        {getInitials(company.company_name)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-bold text-slate-900 transition group-hover:text-blue-700">
                        {company.company_name}
                      </h3>

                      {company.industry && (
                        <p className="mt-1 text-sm text-slate-500">
                          {company.industry}
                        </p>
                      )}

                      {company.city && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <span aria-hidden="true">📍</span>
                          {company.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">
                    {company.description
                      ? company.description.length > 150
                        ? `${company.description.slice(0, 150)}...`
                        : company.description
                      : "Découvrez cette entreprise et son domaine d'activité."}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        Site web <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              🏢
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Aucune entreprise trouvée
            </h3>

            <p className="mt-2 text-slate-500">
              Essayez de modifier votre recherche ou vos filtres.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCityFilter("");
                setIndustryFilter("");
              }}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
