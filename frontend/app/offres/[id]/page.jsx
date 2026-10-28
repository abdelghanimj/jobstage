
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  Building2,
  Clock,
  RefreshCw,
} from "lucide-react";

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function loadOffer() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(`/api/offers/${id}`);

        if (active) {
          setOffer(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Impossible de charger cette offre."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOffer();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-8 w-40 rounded bg-slate-200" />
          <div className="mt-8 h-48 rounded-2xl bg-slate-200" />
          <div className="mt-6 h-6 w-2/3 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
          <div className="mt-8 h-32 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <BriefcaseBusiness
            size={42}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Offre introuvable
          </h1>

          <p className="mt-3 text-slate-600">
            {error || "Cette offre n'existe pas ou n'est plus disponible."}
          </p>

          <button
            onClick={() => router.push("/offres")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            <ArrowLeft size={18} />
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-800 px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/offres"
            className="inline-flex items-center gap-2 text-sm text-blue-100 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Retour aux offres
          </Link>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Building2 size={32} />
            </div>

            <div className="flex-1">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                Offre d'emploi
              </span>

              <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                {offer.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-blue-100">
                {offer.company_name && (
                  <span className="flex items-center gap-2">
                    <Building2 size={17} />
                    {offer.company_name}
                  </span>
                )}

                {(offer.city || offer.location) && (
                  <span className="flex items-center gap-2">
                    <MapPin size={17} />
                    {offer.city || offer.location}
                  </span>
                )}

                {offer.created_at && (
                  <span className="flex items-center gap-2">
                    <CalendarDays size={17} />
                    Publiée le {formatDate(offer.created_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">
            Description du poste
          </h2>

          <div className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
            {offer.description || "Aucune description disponible."}
          </div>

          {offer.requirements && (
            <>
              <h2 className="mt-8 text-xl font-bold text-slate-900">
                Profil recherché
              </h2>

              <div className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                {offer.requirements}
              </div>
            </>
          )}

          {offer.responsibilities && (
            <>
              <h2 className="mt-8 text-xl font-bold text-slate-900">
                Missions principales
              </h2>

              <div className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                {offer.responsibilities}
              </div>
            </>
          )}
        </article>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Informations sur l'offre
          </h2>

          <div className="mt-6 space-y-5">
            {offer.contract_type && (
              <div className="flex gap-3">
                <BriefcaseBusiness
                  size={20}
                  className="shrink-0 text-blue-700"
                />
                <div>
                  <p className="text-xs text-slate-500">Type de contrat</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {offer.contract_type}
                  </p>
                </div>
              </div>
            )}

            {offer.salary && (
              <div className="flex gap-3">
                <Clock
                  size={20}
                  className="shrink-0 text-blue-700"
                />
                <div>
                  <p className="text-xs text-slate-500">Salaire</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {offer.salary}
                  </p>
                </div>
              </div>
            )}

            {(offer.city || offer.location) && (
              <div className="flex gap-3">
                <MapPin
                  size={20}
                  className="shrink-0 text-blue-700"
                />
                <div>
                  <p className="text-xs text-slate-500">Localisation</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {offer.city || offer.location}
                  </p>
                </div>
              </div>
            )}

            {offer.deadline && (
              <div className="flex gap-3">
                <CalendarDays
                  size={20}
                  className="shrink-0 text-blue-700"
                />
                <div>
                  <p className="text-xs text-slate-500">
                    Date limite de candidature
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(offer.deadline)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push(`/offres/${id}/postuler`)}
            className="mt-8 w-full rounded-xl bg-blue-700 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-800"
          >
            Postuler à cette offre
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            Consultez les informations avant de soumettre votre candidature.
          </p>
        </aside>
      </section>
    </div>
  );
}
