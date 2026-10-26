"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

export default function MesCondidatures() {
  const router = useRouter();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCandidatures() {
      try {
        // Vérifier que l'utilisateur est connecté
        await apiFetch("/api/me");

        // Récupérer les candidatures du candidat
        const data = await apiFetch("/api/candidate/applications");

        setCandidatures(data.candidatures ?? []);
      } catch (err) {
        setError(err.message || "Impossible de charger les candidatures.");
      } finally {
        setLoading(false);
      }
    }

    fetchCandidatures();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Chargement de vos candidatures...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mes candidatures
            </h1>
            <p className="mt-2 text-gray-600">
              Suivez l'état de vos candidatures aux offres d'emploi.
            </p>
          </div>

          <Link
            href="/offres"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Consulter les offres
          </Link>
        </div>

        {candidatures.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Aucune candidature pour le moment
            </h2>
            <p className="mt-3 text-gray-600">
              Consultez les offres disponibles et envoyez votre première
              candidature.
            </p>
            <Link
              href="/offres"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              Voir les offres
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-200">
              {candidatures.map((candidature) => (
                <div
                  key={candidature.id}
                  className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {candidature.job_offer?.title ?? "Offre sans titre"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {candidature.job_offer?.company?.name ??
                        "Entreprise non précisée"}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Envoyée le{" "}
                      {candidature.created_at
                        ? new Date(candidature.created_at).toLocaleDateString(
                            "fr-FR"
                          )
                        : "Date inconnue"}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                    {candidature.status ?? "En attente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}