"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();

  if (password !== passwordConfirmation) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const validationErrors = data.errors
        ? Object.values(data.errors).flat().join("\n")
        : data.message || "Une erreur est survenue.";

      alert(validationErrors);
      return;
    }

    alert("Compte créé avec succès !");

    console.log("Inscription réussie :", {
      user: data.user,
      token: data.token,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    alert(
      "Impossible de contacter le serveur Laravel. Vérifiez que le backend est démarré."
    );
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">

        {/* Logo */}
        <Link
          href="/"
          className="mb-6 block text-center text-3xl font-bold text-blue-600"
        >
          JobStage
        </Link>

        {/* Titre */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un compte
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Rejoignez JobStage et trouvez votre prochaine opportunité.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nom */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nom complet
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom complet"
              autoComplete="name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Type de compte */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Type de compte
            </label>

            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="candidate">Candidat — Je cherche un stage/emploi</option>
              <option value="company">Entreprise — Je recrute</option>
            </select>
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-24 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-blue-600"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>

            <input
              id="passwordConfirmation"
              type={showPassword ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Retapez votre mot de passe"
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Créer mon compte
          </button>
        </form>

        {/* Connexion */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Se connecter
          </Link>
        </p>

        <div className="mt-5 text-center">
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