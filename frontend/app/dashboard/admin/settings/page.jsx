
"use client";

import { useEffect, useState } from "react";
import { apiFetch, getCsrfCookie } from "@/src/lib/api";

const DEFAULT_SETTINGS = {
  platform_name: "JobStage",
  language: "fr",
  description:
    "Plateforme de mise en relation entre candidats et entreprises pour les stages et les offres d'emploi.",
  notifications_enabled: true,
  maintenance_mode: false,
};

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const data = await apiFetch("/api/admin/settings");

        if (active && data.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data.settings,
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Impossible de charger les paramètres."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateField(field, value) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await getCsrfCookie();

      const data = await apiFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          platform_name: settings.platform_name,
          language: settings.language,
          description: settings.description,
          notifications_enabled: settings.notifications_enabled,
          maintenance_mode: settings.maintenance_mode,
        }),
      });

      if (data.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
        });
      }

      setMessage(
        data.message || "Paramètres enregistrés avec succès."
      );
    } catch (err) {
      setError(
        err.message || "Erreur lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  }

  function Toggle({ checked, onChange, danger = false }) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? danger
              ? "bg-red-600"
              : "bg-blue-600"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-sm text-gray-500">
        Chargement des paramètres...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Paramètres
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Gérez les préférences et la configuration de JobStage.
        </p>
      </div>

      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Paramètres généraux
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Informations générales de la plateforme.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="platform_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nom de la plateforme
              </label>
              <input
                id="platform_name"
                type="text"
                required
                maxLength={255}
                value={settings.platform_name}
                onChange={(e) =>
                  updateField("platform_name", e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="language"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Langue
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) =>
                  updateField("language", e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                maxLength={2000}
                value={settings.description ?? ""}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configurez les préférences de notification.
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
            <div>
              <p className="font-medium text-gray-800">
                Notifications administratives
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Recevoir des alertes concernant l'activité de la plateforme.
              </p>
            </div>

            <Toggle
              checked={settings.notifications_enabled}
              onChange={(value) =>
                updateField("notifications_enabled", value)
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Système et sécurité
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Préférences liées au fonctionnement de la plateforme.
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
            <div>
              <p className="font-medium text-gray-800">
                Mode maintenance
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Enregistrer la préférence du mode maintenance.
              </p>
              <p className="mt-2 text-xs text-amber-600">
                Le réglage est enregistré, mais ne bloque pas encore l'accès au site.
              </p>
            </div>

            <Toggle
              checked={settings.maintenance_mode}
              danger
              onChange={(value) =>
                updateField("maintenance_mode", value)
              }
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Enregistrement..."
              : "Enregistrer les paramètres"}
          </button>
        </div>
      </form>
    </div>
  );
}
