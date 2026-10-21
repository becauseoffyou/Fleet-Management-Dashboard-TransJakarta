
import { useEffect, useState } from "react";
import {
    X,
    BusFront,
    MapPin,
    Clock3,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";

import VehicleMap from "./VehicleMap";

export default function VehicleDetail({
    vehicle,
    included = [],
    onClose,
}) {
    const [detail, setDetail] = useState(null);
    const [detailIncluded, setDetailIncluded] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [retryKey, setRetryKey] = useState(0);

    const vehicleId = vehicle?.id;

    useEffect(() => {
        if (!vehicleId) {
            return;
        }

        const controller = new AbortController();

        const fetchDetail = async () => {
            setLoading(true);
            setError("");
            setDetail(null);
            setDetailIncluded([]);

            try {
                const url =
                    `https://api-v3.mbta.com/vehicles/` +
                    `${encodeURIComponent(vehicleId)}` +
                    `?include=route,trip`;

                const response = await fetch(url, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}`
                    );
                }

                const result = await response.json();

                if (controller.signal.aborted) return;

                if (!result.data) {
                    throw new Error(
                        "Vehicle data not found"
                    );
                }

                setDetail(result.data);
                setDetailIncluded(result.included || []);
            } catch (err) {
                if (controller.signal.aborted) return;

                console.error(
                    "Failed to fetch vehicle detail:",
                    err
                );

                setError(
                    "Failed to load vehicle details. Please try again."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchDetail();

        return () => controller.abort();
    }, [vehicleId, retryKey]);
    useEffect(() => {
        if (!vehicleId) return;

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                onKeyDown
            );
        };
    }, [vehicleId, onClose]);
    if (!vehicle) return null;
    const currentVehicle = detail || vehicle;

    const currentIncluded = detail
        ? detailIncluded
        : included;

    const attributes =
        currentVehicle.attributes || {};

    const relationships =
        currentVehicle.relationships || {};

    const routeId =
        relationships.route?.data?.id;

    const tripId =
        relationships.trip?.data?.id;

    const route = currentIncluded.find(
        (item) =>
            item.type === "route" &&
            item.id === routeId
    );

    const trip = currentIncluded.find(
        (item) =>
            item.type === "trip" &&
            item.id === tripId
    );

    const routeName =
        route?.attributes?.long_name ||
        route?.attributes?.short_name ||
        routeId ||
        "-";

    const tripName =
        trip?.attributes?.headsign ||
        trip?.attributes?.name ||
        tripId ||
        "-";

    const updatedAt = attributes.updated_at
        ? new Date(
            attributes.updated_at
        ).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "-";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Vehicle Details"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Detail Kendaraan
                        </h2>

                        <p className="text-sm text-gray-500">
                            Informasi kendaraan dan lokasi saat ini
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-2 hover:bg-gray-100"
                        aria-label="Close popup"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Loading */}
                {loading ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="flex min-h-80 flex-col items-center justify-center gap-4 p-6"
                    >
                        <LoaderCircle
                            size={44}
                            className="animate-spin text-blue-700"
                        />

                        <div className="text-center">
                            <p className="font-semibold text-gray-800">
                                Loading Vehicle Details
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Fetching latest vehicle information...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex min-h-80 flex-col items-center justify-center gap-4 p-6 text-center">
                        <p
                            role="alert"
                            className="text-sm text-red-600"
                        >
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setRetryKey((prev) => prev + 1)
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 p-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                                <BusFront size={27} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {attributes.label ||
                                        `Vehicle ${currentVehicle.id}`}
                                </h3>

                                <p className="text-xs text-gray-500">
                                    ID: {currentVehicle.id}
                                </p>
                            </div>

                            <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                {(
                                    attributes.current_status ||
                                    "UNKNOWN"
                                ).replaceAll("_", " ")}
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                ["Route", routeName],
                                ["Trip", tripName],
                                [
                                    "Latitude",
                                    attributes.latitude ?? "-",
                                ],
                                [
                                    "Longitude",
                                    attributes.longitude ?? "-",
                                ],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl bg-gray-50 p-4"
                                >
                                    <p className="mb-1 text-xs text-gray-400">
                                        {label}
                                    </p>

                                    <p className="break-words text-sm font-semibold text-gray-800">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <MapPin
                                    size={18}
                                    className="text-blue-700"
                                />

                                <h4 className="font-semibold text-gray-900">
                                    Lokasi Saat Ini
                                </h4>
                            </div>

                            <VehicleMap
                                key={currentVehicle.id}
                                latitude={attributes.latitude}
                                longitude={attributes.longitude}
                                label={attributes.label}
                            />
                        </div>

                        {/* Last updated */}
                        <div className="flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                            <Clock3 size={17} />
                            Last Updated: {updatedAt}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
