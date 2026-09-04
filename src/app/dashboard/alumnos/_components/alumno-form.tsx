import Link from "next/link";

type AlumnoFormValues = {
  id?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  nivel?: string;
  fechaIngreso?: string; // yyyy-mm-dd, listo para <input type="date">
  lesiones?: string;
  objetivos?: string;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className={labelClass}>
      {label}
      {required && <span className="text-red-600 dark:text-red-400"> *</span>}
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className={labelClass}>
      {label}
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </label>
  );
}

export function AlumnoForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: AlumnoFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-6 space-y-5">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Nombre"
          name="nombre"
          required
          defaultValue={defaultValues?.nombre}
        />
        <Field
          label="Apellido"
          name="apellido"
          required
          defaultValue={defaultValues?.apellido}
        />
        <Field
          label="Teléfono"
          name="telefono"
          type="tel"
          placeholder="5492235551234 (formato E.164, sin +)"
          defaultValue={defaultValues?.telefono}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultValues?.email}
        />
        <Field
          label="Nivel / cinturón"
          name="nivel"
          placeholder="Ej: Blanco, Azul, Púrpura..."
          defaultValue={defaultValues?.nivel}
        />
        <Field
          label="Fecha de ingreso"
          name="fechaIngreso"
          type="date"
          defaultValue={defaultValues?.fechaIngreso}
        />
      </div>

      <TextArea
        label="Lesiones"
        name="lesiones"
        defaultValue={defaultValues?.lesiones}
      />
      <TextArea
        label="Objetivos"
        name="objetivos"
        defaultValue={defaultValues?.objetivos}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/dashboard"
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
