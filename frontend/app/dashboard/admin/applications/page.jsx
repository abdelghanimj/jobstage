
"use client";

import { useMemo, useState } from "react";

const initialApplications = [
  {
    id: 1,
    candidate: "Ahmed Benali",
    email: "ahmed@example.com",
    offer: "Développeur Full Stack",
    company: "Tech Solutions",
    date: "2026-10-10",
    status: "pending",
  },
  {
    id: 2,
    candidate: "Sara Amrani",
    email: "sara@example.com",
    offer: "Développeur React",
    company: "Digital Agency",
    date: "2026-10-09",
    status: "accepted",
  },
  {
    id: 3,
    candidate: "Youssef Karim",
    email: "youssef@example.com",
    offer: "Développeur Mobile",
    company: "Mobile Apps",
    date: "2026-10-08",
    status: "rejected",
  },
  {
    id: 4,
    candidate: "Salma Idrissi",
    email: "salma@example.com",
    offer: "Data Analyst Junior",
    company: "Data Maroc",
    date: "2026-10-07",
    status: "pending",
  },
];

const statusLabels = {
  pending: "En attente",
  accepted: "Acceptée",
  rejected: "Refusée",
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default function Candidatures() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const totalApplications = applications.length;

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  const filteredApplications = useMemo(() => {
    const value = search.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesSearch = [
        application.candidate,
        application.email,
        application.offer,
        application.company,
      ].some((item) => item.toLowerCase().includes(value));

      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  function updateStatus(application, status) {
    setApplications((current) =>
      current.map((item) =>
        item.id === application.id ? { ...item, status } : item
      )
    );

    setSelectedApplication((current) =>
      current?.id === application.id
        ? { ...current, status }
        : current
    );
  }

  function deleteApplication(application) {
    const confirmed = window.confirm(
      `Voulez-vous supprimer la candidature de ${application.candidate} ?`
    );

    if (!confirmed) return;

    setApplications((current) =>
      current.filter((item) => item.id !== application.id)
    );

    if (selectedApplication?.id === application.id) {
      setSelectedApplication(null);
    }
  }

  function formatDate(date) {
    return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR");
  }

  function StatusBadge({ status }) {
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des candidatures
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Consultez et suivez les candidatures envoyées sur JobStage.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total candidatures</p>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {totalApplications}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Acceptées</p>
          <p className="mt-3 text-3xl font-bold text-green-600">
            {acceptedCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Refusées</p>
          <p className="mt-3 text-3xl font-bold text-red-600">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* Recherche et filtre */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un candidat, une offre ou une entreprise..."
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Acceptées</option>
          <option value="rejected">Refusées</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Liste des candidatures
          </h2>
          <span className="text-sm text-gray-500">
            {filteredApplications.length} résultat(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Candidat</th>
                <th className="px-5 py-4">Offre</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {application.candidate}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {application.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">
                      {application.offer}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {application.company}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {formatDate(application.date)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={application.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Voir
                      </button>

                      {application.status !== "accepted" && (
                        <button
                          onClick={() =>
                            updateStatus(application, "accepted")
                          }
                          className="rounded-lg border border-green-200 px-3 py-2 text-green-700 hover:bg-green-50"
                        >
                          Accepter
                        </button>
                      )}

                      {application.status !== "rejected" && (
                        <button
                          onClick={() =>
                            updateStatus(application, "rejected")
                          }
                          className="rounded-lg border border-amber-200 px-3 py-2 text-amber-700 hover:bg-amber-50"
                        >
                          Refuser
                        </button>
                      )}

                      <button
                        onClick={() => deleteApplication(application)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApplications.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Aucune candidature trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Détails */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de la candidature
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Référence #{selectedApplication.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Candidat</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedApplication.candidate}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">
                  {selectedApplication.email}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Offre</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedApplication.offer}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Entreprise</p>
                <p className="mt-1 text-gray-900">
                  {selectedApplication.company}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Date de candidature</p>
                <p className="mt-1 text-gray-900">
                  {formatDate(selectedApplication.date)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-gray-500">Statut</p>
                <StatusBadge status={selectedApplication.status} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
              {selectedApplication.status !== "accepted" && (
                <button
                  onClick={() =>
                    updateStatus(selectedApplication, "accepted")
                  }
                  className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                >
                  Accepter
                </button>
              )}

              {selectedApplication.status !== "rejected" && (
                <button
                  onClick={() =>
                    updateStatus(selectedApplication, "rejected")
                  }
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  Refuser
                </button>
              )}

              <button
                onClick={() => setSelectedApplication(null)}
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
