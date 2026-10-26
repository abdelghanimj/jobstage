
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../src/lib/api";

const initialProfile = {
  phone: "",
  city: "",
  bio: "",
  linkedin_url: "",
  github_url: "",
  cv_path: null,
};

const initialAccount = {
  name: "",
  email: "",
};

export default function ProfileCandidate() {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(initialAccount);
  const [profile, setProfile] = useState(initialProfile);
  const [originalAccount, setOriginalAccount] = useState(initialAccount);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMessage, setCvMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch("/api/candidate/profile");

        const nextAccount = {
          name: data.user?.name || "",
          email: data.user?.email || "",
        };

        const nextProfile = {
          ...initialProfile,
          ...(data.profile || {}),
        };

        setUser(data.user);
        setAccount(nextAccount);
        setProfile(nextProfile);
        setOriginalAccount(nextAccount);
        setOriginalProfile(nextProfile);
      } catch (err) {
        setError(
          err.message ||
            "Impossible de charger votre profil. Veuillez vous reconnecter."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleAccountChange(event) {
    const { name, value } = event.target;

    setAccount((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  }

  async function handleCvUpload(event) {
    event.preventDefault();

    if (!cvFile) {
      setCvMessage("Veuillez sélectionner un fichier PDF.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData();
    formData.append("cv", cvFile);

    setCvUploading(true);
    setCvMessage("");

    try {
      const data = await apiFetch("/api/candidate/profile/cv", {
        method: "POST",
        body: formData,
      });

      setProfile((previous) => ({
        ...previous,
        cv_path: data.cv_path,
      }));

      setOriginalProfile((previous) => ({
        ...previous,
        cv_path: data.cv_path,
      }));

      setCvFile(null);
      form.reset();
      setCvMessage(data.message || "CV importé avec succès.");
    } catch (err) {
      setCvMessage(
        err.message || "Erreur lors de l'importation du CV."
      );
    } finally {
      setCvUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiFetch("/api/candidate/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: account.name.trim(),
          email: account.email.trim(),
          phone: profile.phone || null,
          city: profile.city || null,
          bio: profile.bio || null,
          linkedin_url: profile.linkedin_url || null,
          github_url: profile.github_url || null,
        }),
      });

      if (data.user) {
        setUser(data.user);

        const nextAccount = {
          name: data.user.name || "",
          email: data.user.email || "",
        };

        setAccount(nextAccount);
        setOriginalAccount(nextAccount);
      } else {
        setOriginalAccount({ ...account });
      }

      const nextProfile = {
        ...profile,
        ...(data.profile || {}),
      };

      setProfile(nextProfile);
      setOriginalProfile(nextProfile);

      setSuccess(
        data.message || "Votre profil a été mis à jour avec succès."
      );
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setAccount({ ...originalAccount });
    setProfile({ ...originalProfile });
    setError("");
    setSuccess("");
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement du profil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
          <p className="mb-4 text-red-600">
            {error || "Impossible de charger votre profil."}
          </p>

          <a
            href="/login"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            Se connecter
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <a
          href="/dashboard/candidate"
          className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Retour au tableau de bord
        </a>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-blue-700 to-indigo-500" />

          <div className="px-6 pb-8 sm:px-10">
            <div className="-mt-12 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700">
              {(account.name || user.name)?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {account.name || "Candidat"}
                </h1>
                <p className="mt-1 text-gray-500">Profil candidat</p>
              </div>

              <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Compte actif
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 border-t border-gray-100 pt-6"
            >
              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                Informations du compte et profil
              </h2>

              <p className="mb-6 text-sm text-gray-500">
                Modifiez vos informations personnelles et vos liens professionnels.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                >
                  {success}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Nom complet
                  <input
                    type="text"
                    name="name"
                    value={account.name}
                    onChange={handleAccountChange}
                    required
                    maxLength={255}
                    autoComplete="name"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Adresse e-mail
                  <input
                    type="email"
                    name="email"
                    value={account.email}
                    onChange={handleAccountChange}
                    required
                    maxLength={255}
                    autoComplete="email"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Téléphone
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    maxLength={30}
                    placeholder="Ex. : 06XXXXXXXX"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Ville
                  <input
                    type="text"
                    name="city"
                    value={profile.city || ""}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Ex. : Oujda"
                    autoComplete="address-level2"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                  À propos de moi
                  <textarea
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleChange}
                    maxLength={2000}
                    rows={5}
                    placeholder="Présentez votre parcours, vos objectifs et vos compétences..."
                    className={inputClass}
                  />

                  <span className="mt-1 block text-right text-xs text-gray-400">
                    {(profile.bio || "").length}/2000
                  </span>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Profil LinkedIn
                  <input
                    type="url"
                    name="linkedin_url"
                    value={profile.linkedin_url || ""}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="https://www.linkedin.com/in/..."
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Profil GitHub
                  <input
                    type="url"
                    name="github_url"
                    value={profile.github_url || ""}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Annuler les modifications
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Mon CV</h2>

          <p className="mt-2 text-sm text-gray-500">
            Importez votre CV au format PDF (5 Mo maximum).
          </p>

          {profile.cv_path && (
            <p className="mt-3 text-sm text-green-700">
              Un CV est enregistré sur votre profil.
            </p>
          )}

          <form onSubmit={handleCvUpload} className="mt-5 space-y-4">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;

                if (file && file.size > 5 * 1024 * 1024) {
                  setCvFile(null);
                  setCvMessage("Le fichier ne doit pas dépasser 5 Mo.");
                  event.target.value = "";
                  return;
                }

                if (
                  file &&
                  file.type &&
                  file.type !== "application/pdf"
                ) {
                  setCvFile(null);
                  setCvMessage("Veuillez sélectionner un fichier PDF.");
                  event.target.value = "";
                  return;
                }

                setCvFile(file);
                setCvMessage("");
              }}
              className="block w-full rounded-xl border border-gray-200 p-3 text-sm"
            />

            {cvMessage && (
              <p role="status" className="text-sm text-blue-700">
                {cvMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={cvUploading || !cvFile}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {cvUploading ? "Importation..." : "Importer mon CV"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
