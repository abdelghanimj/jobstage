import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                J
              </span>

              <span className="text-2xl font-extrabold text-white">
                Job<span className="text-blue-400">Stage</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
              Votre plateforme pour découvrir des offres de stage et d'emploi,
              développer vos compétences et préparer votre avenir professionnel.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Candidats
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/offres"
                  className="transition hover:text-blue-400"
                >
                  Toutes les offres
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-blue-400"
                >
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition hover:text-blue-400"
                >
                  Se connecter
                </Link>
              </li>
            </ul>
          </div>

          {/* Companies */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Entreprises
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/entreprise"
                  className="transition hover:text-blue-400"
                >
                  Espace recruteur
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition hover:text-blue-400"
                >
                  Accès recruteur
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-blue-400"
                >
                  Rejoindre JobStage
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              À propos
            </h3>

            <p className="text-sm leading-7 text-slate-400">
              JobStage facilite la rencontre entre les candidats et les
              entreprises au Maroc.
            </p>

            <Link
              href="/offres"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Découvrir les offres
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-400">
            © {currentYear} JobStage. Tous droits réservés.
          </p>

          <p className="text-slate-500">
            Conçu pour accompagner votre avenir professionnel.
          </p>
        </div>
      </div>
    </footer>
  );
}
