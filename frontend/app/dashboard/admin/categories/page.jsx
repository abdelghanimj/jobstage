
"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/src/lib/api";

const emptyForm = {
  name: "",
  description: "",
  status: "active",
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Charger les catégories depuis Laravel
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiFetch("/api/categories");

      // Laravel paginate(10) retourne les éléments dans result.data
      const items = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

      setCategories(items);
    } catch (err) {
      console.error("Erreur de chargement :", err);
      setError(
        err.message ||
          "Impossible de récupérer les catégories depuis le serveur."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Recherche et filtrage
  const filteredCategories = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return categories.filter((category) => {
      const matchesSearch =
        (category.name || "").toLowerCase().includes(searchText) ||
        (category.slug || "").toLowerCase().includes(searchText) ||
        (category.description || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const activeCount = categories.filter(
    (category) => category.status === "active"
  ).length;

  const inactiveCount = categories.filter(
    (category) => category.status === "inactive"
  ).length;

  // Ouvrir le formulaire de création
  function openCreateModal() {
    setEditingCategory(null);
    setForm({ ...emptyForm });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  // Ouvrir le formulaire de modification
  function openEditModal(category) {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      status: category.status || "active",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  // Générer un slug côté frontend pour la vérification
  function makeSlug(name) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Ajouter ou modifier une catégorie via l'API
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();

    if (!name) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    const slug = makeSlug(name);

    const duplicate = categories.some(
      (category) =>
        category.slug === slug &&
        category.id !== editingCategory?.id
    );

    if (duplicate) {
      setError("Cette catégorie existe déjà.");
      return;
    }

    setSaving(true);

    const isEditing = Boolean(editingCategory);

    try {
      const payload = {
        name,
        description: form.description.trim(),
        status: form.status,
      };

      // apiFetch gère les headers et les cookies.
      // Obtenir le cookie CSRF avant les requêtes d'écriture
      // si le backend utilise Sanctum en mode SPA.
      const { getCsrfCookie } = await import("@/src/lib/api");
      await getCsrfCookie();

      await apiFetch(
        isEditing
          ? `/api/categories/${editingCategory.id}`
          : "/api/categories",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setModalOpen(false);
      setEditingCategory(null);
      setForm({ ...emptyForm });

      setSuccess(
        isEditing
          ? "Catégorie modifiée avec succès."
          : "Catégorie ajoutée avec succès."
      );

      await fetchCategories();
    } catch (err) {
      console.error("Erreur d'enregistrement :", err);
      setError(
        err.message || "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  }

  // Supprimer une catégorie
  async function deleteCategory(category) {
    const confirmed = window.confirm(
      `Voulez-vous supprimer la catégorie « ${category.name} » ?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const { getCsrfCookie } = await import("@/lib/api");
      await getCsrfCookie();

      await apiFetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      setSuccess("Catégorie supprimée avec succès.");
      await fetchCategories();
    } catch (err) {
      console.error("Erreur de suppression :", err);
      setError(err.message || "Impossible de supprimer cette catégorie.");
    }
  }

  // Activer ou désactiver une catégorie
  async function toggleStatus(category) {
    setError("");
    setSuccess("");

    const newStatus =
      category.status === "active" ? "inactive" : "active";

    try {
      const { getCsrfCookie } = await import("@/src/lib/api");
      await getCsrfCookie();

      await apiFetch(`/api/categories/${category.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: category.name,
          description: category.description || "",
          status: newStatus,
        }),
      });

      setSuccess(
        newStatus === "active"
          ? "Catégorie activée avec succès."
          : "Catégorie désactivée avec succès."
      );

      await fetchCategories();
    } catch (err) {
      console.error("Erreur de statut :", err);
      setError(err.message || "Impossible de modifier le statut.");
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des catégories
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organisez les domaines des offres de stage et d'emploi.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <span className="text-lg">+</span>
          Ajouter une catégorie
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="font-bold"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="font-bold"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total catégories chargées</p>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {categories.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Catégories actives</p>
          <p className="mt-3 text-3xl font-bold text-green-600">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Catégories inactives</p>
          <p className="mt-3 text-3xl font-bold text-orange-500">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Recherche */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie..."
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actives</option>
          <option value="inactive">Inactives</option>
        </select>

        <button
          type="button"
          onClick={fetchCategories}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Actualiser"}
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Liste des catégories
          </h2>
          <span className="text-sm text-gray-500">
            {filteredCategories.length} résultat(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Catégorie</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    Chargement des catégories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    Aucune catégorie trouvée.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="mt-1 max-w-sm text-xs text-gray-500">
                        {category.description || "Aucune description"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {category.slug || makeSlug(category.name || "")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          category.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {category.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="rounded-lg border border-blue-200 px-3 py-2 text-blue-600 hover:bg-blue-50"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatus(category)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {category.status === "active"
                            ? "Désactiver"
                            : "Activer"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
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
      </div>

      {/* Modal d'ajout et de modification */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory
                    ? "Modifier la catégorie"
                    : "Nouvelle catégorie"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Complétez les informations ci-dessous.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nom de la catégorie *
                </label>
                <input
                  id="category-name"
                  required
                  maxLength={255}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Ex. Développement Web"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="category-description"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Décrivez cette catégorie..."
                  className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category-status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Statut
                </label>
                <select
                  id="category-status"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Enregistrement..."
                    : editingCategory
                      ? "Enregistrer"
                      : "Créer la catégorie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
