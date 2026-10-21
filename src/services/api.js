
import axios from "axios";

const api = axios.create({
    baseURL: "https://api-v3.mbta.com",
    timeout: 15000,
});


export const getVehicles = async (
    limit = 10,
    offset = 0,
    routeIds = [],
    tripIds = []
) => {
    const params = {
        "page[limit]": limit,
        "page[offset]": offset,
        include: "route,trip",
    };

    // Filter kendaraan berdasarkan Route
    if (routeIds.length > 0) {
        params["filter[route]"] = routeIds.join(",");
    }

    // MBTA tidak mengizinkan filter trip digabung
    // dengan filter route pada endpoint vehicles.
    if (tripIds.length > 0) {
        delete params["filter[route]"];
        params["filter[trip]"] = tripIds.join(",");
    }

    const response = await api.get("/vehicles", { params });

    return response.data;
};


export const getRoutes = async (limit = 20, offset = 0) => {
    const response = await api.get("/routes", {
        params: {
            "page[limit]": limit,
            "page[offset]": offset,
        },
    });
    return response.data;
};

export const getTrips = async (
    routeIds,
    limit = 20,
    offset = 0
) => {
    if (!routeIds?.length) {
        return { data: [], links: { next: null } };
    }

    const response = await api.get("/trips", {
        params: {
            "filter[route]": routeIds.join(","),
            "page[limit]": limit,
            "page[offset]": offset,
        },
    });

    return response.data;
};

// export async function getVehicleDetail(vehicleId) {
//     const response = await fetch(
//         `https://api-v3.mbta.com/vehicles/${encodeURIComponent(vehicleId)}?include=route,trip`
//     );

//     if (!response.ok) {
//         throw new Error("Failed to fetch vehicle details");
//     }

//     return response.json();
// }
export default api;
