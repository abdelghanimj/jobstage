"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/src/lib/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "candidate",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");

  // Pagination
 
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [pagination, setPagination] = useState({
  current_page: 1,
  last_page: 1,
  total: 0,
});


  // Charger les utilisateurs depuis Laravel
  
async function fetchUsers(page = currentPage, perPage = itemsPerPage) {
  try {
    setError("");

    const data = await apiFetch(
      `/api/admin/users?page=${page}&per_page=${perPage}`
    );

    setUsers(data.data || []);

    setPagination({
      current_page: data.current_page || 1,
      last_page: data.last_page || 1,
      total: data.total || 0,
    });

    setCurrentPage(data.current_page || 1);
  } catch (err) {
    setError(err.message || "Impossible de charger les utilisateurs.");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchUsers();
  }, []);

  // Statistiques
  const totalUsers = users.length;

  const totalCandidates = users.filter(
    (user) => user.role === "candidate"
  ).length;

  const totalCompanies = users.filter(
    (user) => user.role === "company"
  ).length;

  // Recherche et filtre
  const filteredUsers = users.filter((user) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue);

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const startResult =
    filteredUsers.length === 0 ? 0 : startIndex + 1;

  const endResult = Math.min(
    startIndex + itemsPerPage,
    filteredUsers.length
  );

  // Revenir à la première page si la recherche ou le filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, itemsPerPage]);

  // Ouvrir les détails
  function showDetails(user) {
    setSelectedUser(user);
  }

  // Ouvrir le formulaire de modification
  function changeRole(user) {
    if (user.role !== "candidate" && user.role !== "company") {
      return;
    }

    setEditingUser(user);

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role,
    });

    setEditError("");
  }

  // Enregistrer les modifications dans Laravel
  async function saveUser(event) {
    event.preventDefault();

    if (!editingUser || saving) return;

    setSaving(true);
    setEditError("");

    try {
      const data = await apiFetch(
        `/api/admin/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            role: editForm.role,
          }),
        }
      );

      if (!data.user) {
        throw new Error("La réponse du serveur est invalide.");
      }

      const updatedUser = data.user;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      if (selectedUser?.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }

      setEditingUser(null);

      alert(data.message || "Utilisateur modifié avec succès.");
    } catch (err) {
      setEditError(
        err.message || "Impossible de modifier cet utilisateur."
      );
    } finally {
      setSaving(false);
    }
  }

  // Supprimer un utilisateur via Laravel
  async function deleteUser(user) {
    if (user.role !== "candidate" && user.role !== "company") {
      return;
    }

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le compte de ${user.name} ?`
    );

    if (!confirmed) return;

    setDeletingId(user.id);

    try {
      const data = await apiFetch(
        `/api/admin/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      setUsers((currentUsers) =>
        currentUsers.filter((item) => item.id !== user.id)
      );

      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
      }

      if (editingUser?.id === user.id) {
        setEditingUser(null);
      }

      alert(data.message || "Utilisateur supprimé avec succès.");
    } catch (err) {
      console.error("Erreur de suppression :", err);

      alert(
        err.message ||
          "Une erreur est survenue lors de la suppression."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Chargement
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-500">
            Chargement des utilisateurs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des utilisateurs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les comptes de la plateforme JobStage.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Actualiser
        </button>
      </div>

      {/* Erreur de chargement */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={fetchUsers}
            className="text-sm font-semibold text-red-700 underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total utilisateurs"
          value={totalUsers}
          description="Candidats et entreprises"
          color="gray"
        />

        <StatCard
          title="Candidats"
          value={totalCandidates}
          description="Comptes candidats"
          color="blue"
        />

        <StatCard
          title="Entreprises"
          value={totalCompanies}
          description="Comptes entreprises"
          color="purple"
        />
      </div>

      {/* Recherche et filtre */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>

          <input
            type="search"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">Tous les rôles</option>
          <option value="candidate">Candidats</option>
          <option value="company">Entreprises</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">
              Liste des utilisateurs
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Gérez les comptes candidats et entreprises.
            </p>
          </div>

          <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {filteredUsers.length} résultat(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Utilisateur</th>
                <th className="px-5 py-4 font-semibold">Rôle</th>
                <th className="px-5 py-4 font-semibold">
                  Date d'inscription
                </th>
                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          user.role === "candidate"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="mt-1 text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString(
                          "fr-FR"
                        )
                      : "—"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => showDetails(user)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Voir
                      </button>

                      <button
                        type="button"
                        onClick={() => changeRole(user)}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === user.id}
                        onClick={() => deleteUser(user)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === user.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <SearchIcon />
                    </div>

                    <p className="mt-3 font-medium text-gray-700">
                      Aucun utilisateur trouvé
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Essayez de modifier votre recherche ou votre filtre.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-4">
            <p>
              Affichage de{" "}
              <span className="font-semibold text-gray-900">
                {startResult}-{endResult}
              </span>{" "}
              sur{" "}
              <span className="font-semibold text-gray-900">
                {filteredUsers.length}
              </span>{" "}
              utilisateurs
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="items-per-page">Par page :</label>

              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(event) =>
                  setItemsPerPage(Number(event.target.value))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Précédent
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  currentPage === page
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={
                currentPage >= totalPages || totalPages === 0
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Fenêtre des détails */}
      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
              {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Détails de l'utilisateur
              </h2>
              <p className="text-sm text-gray-500">
                Informations du compte
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <DetailRow label="ID" value={selectedUser.id} />
            <DetailRow label="Nom" value={selectedUser.name} />
            <DetailRow label="Email" value={selectedUser.email} />

            <div>
              <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                Rôle
              </p>
              <RoleBadge role={selectedUser.role} />
            </div>

            <DetailRow
              label="Inscription"
              value={
                selectedUser.created_at
                  ? new Date(selectedUser.created_at).toLocaleString(
                      "fr-FR"
                    )
                  : "—"
              }
            />
          </div>

          <button
            type="button"
            onClick={() => setSelectedUser(null)}
            className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Fermer
          </button>
        </Modal>
      )}

      {/* Fenêtre de modification */}
      {editingUser && (
        <Modal
          onClose={() => {
            if (!saving) setEditingUser(null);
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Modifier l'utilisateur
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Modifiez les informations du compte.
            </p>
          </div>

          <form onSubmit={saveUser} className="space-y-5">
            {editError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {editError}
              </div>
            )}

            <div>
              <label
                htmlFor="user-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nom complet
              </label>

              <input
                id="user-name"
                type="text"
                required
                maxLength={255}
                value={editForm.name}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    name: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="user-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Adresse e-mail
              </label>

              <input
                id="user-email"
                type="email"
                required
                maxLength={255}
                value={editForm.email}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    email: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="user-role"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Rôle
              </label>

              <select
                id="user-role"
                value={editForm.role}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    role: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="candidate">Candidat</option>
                <option value="company">Entreprise</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditingUser(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Carte statistique
function StatCard({ title, value, description, color }) {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-400">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors[color]}`}
        >
          <UsersIcon />
        </div>
      </div>
    </div>
  );
}

// Badge du rôle
function RoleBadge({ role }) {
  const isCandidate = role === "candidate";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isCandidate
          ? "bg-blue-50 text-blue-700"
          : "bg-purple-50 text-purple-700"
      }`}
    >
      {isCandidate ? "Candidat" : "Entreprise"}
    </span>
  );
}

// Fenêtre modale réutilisable
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

// Ligne d'information
function DetailRow({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-gray-900">
        {value ?? "—"}
      </p>
    </div>
  );
}

// Icône de recherche
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

// Icône utilisateurs
function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}