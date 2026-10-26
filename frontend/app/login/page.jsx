
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getCsrfCookie } from "@/src/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  function redirectByRole(role) {
    switch (role) {
      case "admin":
        router.replace("/dashboard/admin");
        break;
      case "company":
        router.replace("/dashboard/company");
        break;
      case "candidate":
        router.replace("/dashboard/candidate");
        break;
      default:
        setError("Rôle utilisateur inconnu.");
    }
  }

  // Vérifier la session Laravel
  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const data = await apiFetch("/api/me");

        if (active && data.user) {
          redirectByRole(data.user.role);
          return;
        }
      } catch {
        // L'utilisateur n'est probablement pas connecté.
      } finally {
        if (active) {
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // 1. Obtenir le cookie CSRF
      await getCsrfCookie();

      // 2. Connexion avec la session Laravel
      await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // 3. Récupérer l'utilisateur depuis Laravel
      const data = await apiFetch("/api/me");

      if (!data.user) {
        throw new Error("Impossible de récupérer votre compte.");
      }

      // 4. Redirection selon le rôle
      redirectByRole(data.user.role);
    } catch (err) {
      console.error("Erreur de connexion :", err);

      setError(
        err.message ||
          "Connexion impossible. Vérifiez vos identifiants et le serveur."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Link
          href="/"
          className="mb-8 block text-center text-3xl font-bold text-blue-600"
        >
          JobStage
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bon retour !
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous à votre compte JobStage
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              autoComplete="email"
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-24 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-blue-600"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Créer un compte
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
