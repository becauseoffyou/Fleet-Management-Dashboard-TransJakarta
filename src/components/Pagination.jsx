import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    page,
    limit,
    total,
    hasNext,
    onPageChange,
    onLimitChange,
}) {
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span>
                    Showing <strong>{start}-{end}</strong> of{" "}
                    <strong>{total}</strong> data
                </span>

                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none"
                >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                <button
                    disabled={!hasNext}
                    onClick={() => onPageChange(page + 1)}
                    className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}