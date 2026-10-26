"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/src/lib/api";

const statusLabels = {
  pending: "En attente",
  approved: "Publiée",
  rejected: "Refusée",
};

function getOfferValue(offer, key, fallback = "—") {
  const value = offer?.[key];
  return value === null || value === undefined || value === ""
    ? fallback
    : value;
}

function getCompanyName(offer) {
  if (typeof offer.company === "string") return offer.company;

  return (
    offer.company?.name ||
    offer.company_name ||
    offer.company?.company_name ||
    "—"
  );
}

function getCategoryName(offer) {
  if (typeof offer.category === "string") return offer.category;

  return offer.category?.name || offer.category_name || "—";
}

function getOfferType(offer) {
  const type = offer.type || offer.contract_type;

  if (!type) return "—";

  const labels = {
    internship: "Stage",
    stage: "Stage",
    job: "Emploi",
    emploi: "Emploi",
    full_time: "Temps plein",
    part_time: "Temps partiel",
    freelance: "Freelance",
  };

  return labels[String(type).toLowerCase()] || type;
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("fr-FR");
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    approved: "bg-green-50 text-green-700 ring-green-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || "bg-gray-100 text-gray-600 ring-gray-200"
      }`}
    >
      {statusLabels[status] || status || "Inconnu"}
    </span>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const result = await apiFetch(
        `/api/admin/offers?${params.toString()}`
      );

      // Laravel paginate() retourne les résultats dans result.data.
      setOffers(Array.isArray(result.data) ? result.data : []);
      setPage(Number(result.current_page) || 1);
      setLastPage(Number(result.last_page) || 1);
      setTotal(Number(result.total) || 0);
    } catch (err) {
      setError(
        err?.message ||
          "Impossible de charger les offres. Vérifiez votre connexion."
      );
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await apiFetch("/api/admin/offers/stats");

      setStats({
        total: Number(result.total) || 0,
        pending: Number(result.pending) || 0,
        approved: Number(result.approved) || 0,
        rejected: Number(result.rejected) || 0,
      });
    } catch (err) {
      console.error("Erreur de chargement des statistiques :", err);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateStatus = async (offer, status) => {
    setActionId(offer.id);
    setError("");
    setNotice("");

    try {
      await apiFetch(`/api/admin/offers/${offer.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      setNotice(
        status === "approved"
          ? "L'offre a été approuvée."
          : "L'offre a été refusée."
      );

      if (selectedOffer?.id === offer.id) {
        setSelectedOffer((current) =>
          current ? { ...current, status } : null
        );
      }

      await Promise.all([fetchOffers(), fetchStats()]);
    } catch (err) {
      setError(err?.message || "Impossible de modifier le statut.");
    } finally {
      setActionId(null);
    }
  };

  const deleteOffer = async (offer) => {
    const confirmed = window.confirm(
      `Voulez-vous supprimer l'offre « ${offer.title} » ?`
    );

    if (!confirmed) return;

    setActionId(offer.id);
    setError("");
    setNotice("");

    try {
      await apiFetch(`/api/admin/offers/${offer.id}`, {
        method: "DELETE",
      });

      setNotice("L'offre a été supprimée.");

      if (selectedOffer?.id === offer.id) {
        setSelectedOffer(null);
      }

      // Si on supprime le dernier élément de la page,
      // on revient à la page précédente si nécessaire.
      if (offers.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchOffers();
      }

      await fetchStats();
    } catch (err) {
      setError(err?.message || "Impossible de supprimer cette offre.");
    } finally {
      setActionId(null);
    }
  };

  const visibleOffers = useMemo(() => offers, [offers]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des offres
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Consultez et modérez les offres de stage et d'emploi publiées sur
          JobStage.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {notice}
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total des offres"
          value={stats.total}
          color="text-gray-900"
        />
        <StatCard
          title="En attente"
          value={stats.pending}
          color="text-amber-600"
        />
        <StatCard
          title="Publiées"
          value={stats.approved}
          color="text-green-600"
        />
        <StatCard
          title="Refusées"
          value={stats.rejected}
          color="text-red-600"
        />
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Rechercher une offre, entreprise ou ville..."
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Publiées</option>
          <option value="rejected">Refusées</option>
        </select>

        <select
          value={perPage}
          onChange={(event) => {
            setPerPage(Number(event.target.value));
            setPage(1);
          }}
          aria-label="Nombre d'offres par page"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value={5}>5 par page</option>
          <option value={10}>10 par page</option>
          <option value={20}>20 par page</option>
          <option value={50}>50 par page</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Liste des offres
          </h2>
          <span className="text-sm text-gray-500">
            {total} résultat(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Offre</th>
                <th className="px-5 py-4">Entreprise</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Chargement des offres...
                  </td>
                </tr>
              ) : visibleOffers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Aucune offre trouvée.
                  </td>
                </tr>
              ) : (
                visibleOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {getOfferValue(offer, "title")}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {getCategoryName(offer)} ·{" "}
                        {getOfferValue(offer, "city")}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {getCompanyName(offer)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {getOfferType(offer)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                      {formatDate(offer.created_at || offer.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={offer.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOffer(offer)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Voir
                        </button>

                        {offer.status !== "approved" && (
                          <button
                            type="button"
                            disabled={actionId === offer.id}
                            onClick={() => updateStatus(offer, "approved")}
                            className="rounded-lg border border-green-200 px-3 py-2 text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Approuver
                          </button>
                        )}

                        {offer.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={actionId === offer.id}
                            onClick={() => updateStatus(offer, "rejected")}
                            className="rounded-lg border border-amber-200 px-3 py-2 text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Refuser
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={actionId === offer.id}
                          onClick={() => deleteOffer(offer)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination backend */}
        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Page {page} sur {lastPage}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Précédent
            </button>

            <button
              type="button"
              disabled={loading || page >= lastPage}
              onClick={() =>
                setPage((current) => Math.min(lastPage, current + 1))
              }
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Détails de l'offre */}
      {selectedOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="offer-details-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Détails de l'offre
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Offre #{selectedOffer.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Titre</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {getOfferValue(selectedOffer, "title")}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Entreprise</p>
                <p className="mt-1 font-medium text-gray-900">
                  {getCompanyName(selectedOffer)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Catégorie</p>
                <p className="mt-1 text-gray-900">
                  {getCategoryName(selectedOffer)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Ville</p>
                <p className="mt-1 text-gray-900">
                  {getOfferValue(selectedOffer, "city")}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Type</p>
                <p className="mt-1 text-gray-900">
                  {getOfferType(selectedOffer)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Date de création</p>
                <p className="mt-1 text-gray-900">
                  {formatDate(
                    selectedOffer.created_at || selectedOffer.createdAt
                  )}
                </p>
              </div>

              <div>
                <p className="mb-2 text-gray-500">Statut</p>
                <StatusBadge status={selectedOffer.status} />
              </div>

              {selectedOffer.description && (
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-gray-900">
                    {selectedOffer.description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
              {selectedOffer.status !== "approved" && (
                <button
                  type="button"
                  disabled={actionId === selectedOffer.id}
                  onClick={() => updateStatus(selectedOffer, "approved")}
                  className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Approuver
                </button>
              )}

              {selectedOffer.status !== "rejected" && (
                <button
                  type="button"
                  disabled={actionId === selectedOffer.id}
                  onClick={() => updateStatus(selectedOffer, "rejected")}
                  className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  Refuser
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
