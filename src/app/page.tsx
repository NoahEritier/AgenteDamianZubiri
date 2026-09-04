import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="max-w-md space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-red-700 dark:text-red-400">
          Codice — Secretario por rubro
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Secretario Tropa BJJ
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Alumnos, cuotas, entrenamientos, competencias y avisos por WhatsApp
          para Damián Zubiri. Todavía en construcción.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Ir al panel
      </Link>
    </div>
  );
}
