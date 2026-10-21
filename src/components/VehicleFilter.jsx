
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";
import { getRoutes, getTrips } from "../services/api";

function FilterDropdown({
    title,
    selected,
    onChange,
    fetchOptions,
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const containerRef = useRef(null);
    const requestRef = useRef(false);

    const LIMIT = 20;

    const loadMore = async () => {
        if (requestRef.current || !hasMore) return;

        requestRef.current = true;
        setLoading(true);
        setError("");

        try {
            const result = await fetchOptions(LIMIT, offset);
            const incoming = result.data || [];

            setOptions((prev) => {
                const existing = new Set(prev.map((item) => item.id));
                return [
                    ...prev,
                    ...incoming.filter((item) => !existing.has(item.id)),
                ];
            });

            setOffset((prev) => prev + incoming.length);
            setHasMore(Boolean(result.links?.next));
        } catch (err) {
            console.error(err);
            setError("Gagal memuat pilihan. Coba lagi.");
        } finally {
            requestRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && options.length === 0 && hasMore && !loading) {
            loadMore();
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (id) => {
        if (selected.includes(id)) {
            onChange(selected.filter((value) => value !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    const handleScroll = (event) => {
        const element = event.currentTarget;
        const nearBottom =
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - 40;

        if (nearBottom && hasMore && !loading) {
            loadMore();
        }
    };

    return (
        <div ref={containerRef} className="relative w-full md:w-64">
            <button
                type="button"
                disabled={disabled}

                onClick={() => setOpen(!open)}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            >
                <span>
                    {title}
                    {selected.length > 0 && ` (${selected.length})`}
                </span>
                <ChevronDown size={17} />
            </button>

            {open && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div
                        className="max-h-64 overflow-y-auto p-2"
                        onScroll={handleScroll}
                    >
                        {options.map((item) => (
                            <label
                                key={item.id}
                                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(item.id)}
                                    onChange={() => toggleOption(item.id)}
                                    className="accent-blue-700"
                                />

                                <span className="truncate">
                                    {item.attributes?.long_name ||
                                        item.attributes?.name ||
                                        item.id}
                                </span>
                            </label>
                        ))}

                        {loading && (
                            <div
                                role="status"
                                className="flex items-center justify-center gap-2 p-3"
                            >
                                <Loader2
                                    className="animate-spin text-blue-700"
                                    size={18}
                                />
                                <span className="text-xs text-gray-500">
                                    Loading {title.includes("Trip") ? "trips" : "routes"}...
                                </span>
                            </div>
                        )}

                        {error && (
                            <button
                                type="button"
                                onClick={loadMore}
                                className="w-full p-3 text-sm text-red-600"
                            >
                                {error} Klik untuk ulangi.
                            </button>
                        )}

                        {!loading && !error && options.length === 0 && !hasMore && (
                            <p className="p-3 text-center text-sm text-gray-400">
                                No options found
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function VehicleFilter({
    selectedRoutes,
    selectedTrips,
    onRoutesChange,
    onTripsChange,
    onClear,
}) {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-3">
            <FilterDropdown
                title="Filter Routes"
                selected={selectedRoutes}
                onChange={onRoutesChange}
                fetchOptions={getRoutes}
            />

            <FilterDropdown
                key={selectedRoutes.join(",")}
                title={
                    selectedRoutes.length === 0
                        ? "Select Route First"
                        : "Filter Trips"
                }
                selected={selectedTrips}
                onChange={onTripsChange}
                fetchOptions={(limit, offset) =>
                    getTrips(selectedRoutes, limit, offset)
                }
                disabled={selectedRoutes.length === 0}
            />

            <button
                type="button"
                onClick={onClear}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <X size={16} />
                Clear Filters
            </button>
        </div>
    );
}
