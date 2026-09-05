import Link from "next/link";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

type CompetenciaFormValues = {
  id?: string;
  nombre?: string;
  fecha?: string;
  lugar?: string;
  inscripcionHasta?: string;
};

export function CompetenciaForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: CompetenciaFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-6 space-y-5">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <label className={`block ${labelClass}`}>
        Nombre
        <input
          type="text"
          name="nombre"
          required
          defaultValue={defaultValues?.nombre}
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Fecha
          <input
            type="date"
            name="fecha"
            required
            defaultValue={defaultValues?.fecha}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Inscripción hasta
          <input
            type="date"
            name="inscripcionHasta"
            defaultValue={defaultValues?.inscripcionHasta}
            className={inputClass}
          />
        </label>
      </div>

      <label className={`block ${labelClass}`}>
        Lugar
        <input
          type="text"
          name="lugar"
          defaultValue={defaultValues?.lugar}
          className={inputClass}
        />
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/dashboard/competencias"
          className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
