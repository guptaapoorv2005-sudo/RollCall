import clsx from "clsx";
import { motion } from "framer-motion";
import EmptyState from "../common/EmptyState";
import LoadingState from "../common/LoadingState";

const MotionTr = motion.tr;

function Table({
  columns,
  data,
  loading = false,
  rowKey = "id",
  className,
  emptyTitle = "No records found",
  emptyDescription = "Data will appear here when available.",
}) {
  if (loading) {
    return <LoadingState label="Loading table" />;
  }

  if (!data?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={clsx("overflow-hidden rounded-xl border border-slate-200", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 bg-white text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    "px-4 py-3 font-semibold text-slate-600",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((row, rowIndex) => (
              <MotionTr
                key={row[rowKey] ?? rowIndex}
                whileHover={{ backgroundColor: "#f8fbff" }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={`${column.key}-${row[rowKey] ?? rowIndex}`}
                    className={clsx(
                      "px-4 py-3 text-slate-700",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                    )}
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : (row[column.key] ?? "-")}
                  </td>
                ))}
              </MotionTr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
