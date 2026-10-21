import { useEffect, useState } from "react";
import { BusFront, RefreshCw, LoaderCircle } from "lucide-react";

import { getVehicles } from "../services/api";
import VehicleCard from "../components/VehicleCard";
import Pagination from "../components/Pagination";
import VehicleFilter from "../components/VehicleFilter";
import VehicleDetail from "../components/VehicleDetail";

export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [selectedTrips, setSelectedTrips] = useState([]);

    const [total, setTotal] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [included, setIncluded] = useState([]);

    useEffect(() => {
        let active = true;

        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const offset = (page - 1) * limit;
                const result = await getVehicles(
                    limit,
                    offset,
                    selectedRoutes,
                    selectedTrips
                );
                if (!active) return;

                setVehicles(result.data || []);
                setIncluded(result.included || []);
                // API MBTA dapat mengembalikan pagination links
                // tanpa total keseluruhan yang eksplisit.
                const apiTotal = result.meta?.total;

                if (typeof apiTotal === "number") {
                    setTotal(apiTotal);
                } else {
                    // Estimasi sementara, bukan total pasti.
                    setTotal(
                        offset +
                        (result.data?.length || 0) +
                        (result.links?.next ? limit : 0)
                    );
                }

                setHasNext(Boolean(result.links?.next));
            } catch (err) {
                if (!active) return;

                console.error(err);
                setError("Gagal mengambil data kendaraan. Silakan coba lagi.");
                setVehicles([]);
                setIncluded([]);
                setTotal(0);
                setHasNext(false);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, [page,
        limit,
        refreshKey,
        selectedRoutes,
        selectedTrips,]);
    useEffect(() => {
        setSelectedVehicle(null);
    }, [selectedRoutes, selectedTrips, page, limit]);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-5">
                    <div className="rounded-xl bg-blue-700 p-3 text-white">
                        <BusFront size={24} />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Fleet Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Vehicle Monitoring Dashboard
                        </p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Vehicle Overview
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Monitor vehicle information and current status.
                        </p>
                    </div>

                    <button
                        onClick={() => setRefreshKey((value) => value + 1)}
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "animate-spin" : ""}
                        />
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-5">
                        <h3 className="font-semibold text-gray-900">
                            All Vehicles
                        </h3>
                        <VehicleFilter
                            selectedRoutes={selectedRoutes}
                            selectedTrips={selectedTrips}
                            onRoutesChange={(routes) => {
                                setSelectedRoutes(routes);
                                setSelectedTrips([]);
                                setPage(1);
                            }}
                            onTripsChange={(trips) => {
                                setSelectedTrips(trips);
                                setPage(1);
                            }}
                            onClear={() => {
                                setSelectedRoutes([]);
                                setSelectedTrips([]);
                                setPage(1);
                            }}
                        />
                    </div>


                    <div className="p-6">
                        {loading ? (
                            <div
                                role="status"
                                aria-live="polite"
                                className="flex min-h-64 flex-col items-center justify-center gap-4 py-16"
                            >
                                <LoaderCircle
                                    size={42}
                                    className="animate-spin text-blue-700"
                                />

                                <div className="text-center">
                                    <p className="font-semibold text-gray-800">
                                        Loading Vehicles
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Fetching vehicle data, please wait...
                                    </p>
                                </div>
                            </div>
                        )
                            : error ? (
                                <div className="py-16 text-center">
                                    <p className="text-red-600">{error}</p>
                                    <button
                                        onClick={() => setRefreshKey((value) => value + 1)}
                                        className="mt-4 cursor-pointer text-sm font-semibold text-blue-700"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : vehicles.length === 0 ? (
                                <div className="flex flex-col items-center gap-2">
                                    <BusFront size={36} className="text-gray-300" />

                                    <p className="font-semibold text-gray-700">
                                        No Active Vehicles Found
                                    </p>

                                    <p className="max-w-md text-center text-sm text-gray-500">
                                        No active vehicles match the selected route or trip.
                                        Please try another filter.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {vehicles.map((vehicle) => (
                                        <VehicleCard
                                            key={vehicle.id}
                                            vehicle={vehicle}
                                            onDetail={setSelectedVehicle}
                                        />
                                    ))}
                                </div>
                            )}
                    </div>

                    {!loading && !error && (
                        <Pagination
                            page={page}
                            limit={limit}
                            total={total}
                            hasNext={hasNext}
                            onPageChange={setPage}
                            onLimitChange={(newLimit) => {
                                setLimit(newLimit);
                                setPage(1);
                            }}
                        />
                    )}
                </div>
            </main>

            <VehicleDetail
                vehicle={selectedVehicle}
                included={included}
                onClose={() => setSelectedVehicle(null)}
            />
        </div>
    );
}