import Link from "next/link";
import type { Sede } from "@prisma/client";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

const DISCIPLINA_LABEL: Record<string, string> = {
  JIU_JITSU: "Jiu-jitsu",
  BOX: "Box",
  FUNCIONAL: "Funcional",
};

type GrupoFormValues = {
  id?: string;
  nombre?: string;
  disciplina?: string;
  horario?: string;
  sedeId?: string;
};

export function GrupoForm({
  action,
  sedes,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  sedes: Sede[];
  defaultValues?: GrupoFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-6 space-y-5">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <label className={labelClass}>
        Nombre
        <input
          type="text"
          name="nombre"
          required
          placeholder="Ej: BJJ avanzado - mar/jue 20hs"
          defaultValue={defaultValues?.nombre}
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Disciplina
          <select
            name="disciplina"
            required
            defaultValue={defaultValues?.disciplina ?? "JIU_JITSU"}
            className={inputClass}
          >
            {Object.entries(DISCIPLINA_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Horario
          <input
            type="text"
            name="horario"
            placeholder="Ej: Mar/Jue 20hs"
            defaultValue={defaultValues?.horario}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Sede
        <select
          name="sedeId"
          defaultValue={defaultValues?.sedeId ?? ""}
          className={inputClass}
        >
          <option value="">Sin sede asignada</option>
          {sedes.map((sede) => (
            <option key={sede.id} value={sede.id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/dashboard/grupos"
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

export { DISCIPLINA_LABEL };
