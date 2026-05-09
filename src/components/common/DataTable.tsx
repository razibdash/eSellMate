import { EmptyState } from "./EmptyState";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, unknown>>({ columns, data, emptyMessage }: { columns: Column<T>[]; data: T[]; emptyMessage?: string }) {
  if (!data.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-5 py-4">{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <tr key={String((row.id as string | number | undefined) ?? index)} className="transition hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={String(column.key)} className="whitespace-nowrap px-5 py-4 text-slate-700">
                    {column.render ? column.render(row) : String(row[column.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
