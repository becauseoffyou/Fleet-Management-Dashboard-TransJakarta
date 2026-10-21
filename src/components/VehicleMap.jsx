import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const vehicleIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            background:#1d4ed8;
            border:3px solid white;
            border-radius:50%;
            width:20px;
            height:20px;
            box-shadow:0 2px 8px #0004;
        "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

export default function VehicleMap({ latitude, longitude, label }) {
    const [loading, setLoading] = useState(true);

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
        latitude == null ||
        longitude == null ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        Math.abs(lat) > 90 ||
        Math.abs(lng) > 180
    ) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
                Vehicle location is unavailable.
            </div>
        );
    }

    return (
        <div className="relative h-64 overflow-hidden rounded-xl border border-gray-200">
            <MapContainer
                key={`${lat}-${lng}`}
                center={[lat, lng]}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    eventHandlers={{
                        loading: () => setLoading(true),
                        load: () => setLoading(false),
                        tileerror: () => setLoading(false),
                    }}
                />

                <Marker position={[lat, lng]} icon={vehicleIcon}>
                    <Popup>{label || "Vehicle Location"}</Popup>
                </Marker>
            </MapContainer>

            {loading && (
                <div
                    role="status"
                    className="absolute inset-0 z-[1000] flex flex-col items-center justify-center gap-3 bg-white/80"
                >
                    <Loader2
                        size={36}
                        className="animate-spin text-blue-700"
                    />

                    <p className="text-sm font-medium text-gray-600">
                        Loading Map...
                    </p>
                </div>
            )}
        </div>
    );
}