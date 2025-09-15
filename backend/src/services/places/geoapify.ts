import { GEOAPIFY_KEY } from "../../config/env.ts";

const BASE = "https://api.geoapify.com/v2/places";

export async function searchCampsites(q: string) {
    const url =
        `${BASE}?categories=tourism.camping
        &filter=countrycode:gb
        &text=${encodeURIComponent(q)}
        &apiKey=${GEOAPIFY_KEY}`;
    const res = await fetch(url);
    return await res.json();
}

export async function nearbyAttractions(lat: number, lon: number) {
    const url =
        `${BASE}?categories=tourism.attraction
        &filter=circle:${lon},${lat},5000
        &apiKey=${GEOAPIFY_KEY}`;
    const res = await fetch(url);
    return await res.json();
}
