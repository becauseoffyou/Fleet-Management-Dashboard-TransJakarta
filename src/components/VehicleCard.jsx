import {
    BusFront,
    MapPin,
    Clock3,
    ArrowUpRight,
} from "lucide-react";

const statusStyles = {
    IN_TRANSIT_TO: "bg-blue-100 text-blue-700",
    STOPPED_AT: "bg-amber-100 text-amber-700",
    INCOMING_AT: "bg-emerald-100 text-emerald-700",
};

export default function VehicleCard({ vehicle, onDetail }) {
    const { id, attributes = {} } = vehicle;

    const status = attributes.current_status || "UNKNOWN";

    const statusStyle =
        statusStyles[status] || "bg-gray-100 text-gray-600";

    const updatedAt = attributes.updated_at
        ? new Date(attributes.updated_at).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "-";

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <BusFront size={25} />
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                >
                    {status.replaceAll("_", " ")}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900">
                {attributes.label || `Vehicle ${id}`}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
                Vehicle ID: {id}
            </p>

            <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 text-sm">
                    <MapPin size={17} className="mt-0.5 text-gray-400" />

                    <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="font-medium text-gray-700">
                            {attributes.latitude ?? "-"},{" "}
                            {attributes.longitude ?? "-"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                    <Clock3 size={17} className="mt-0.5 text-gray-400" />

                    <div>
                        <p className="text-xs text-gray-400">
                            Last Updated
                        </p>
                        <p className="font-medium text-gray-700">
                            {updatedAt}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onDetail(vehicle)}
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
                View Details
                <ArrowUpRight size={16} />
            </button>
        </div>
    );
}