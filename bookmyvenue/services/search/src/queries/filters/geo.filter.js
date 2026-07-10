export default function applyGeoFilter(query, filters) {
    if (!filters.lat && !filters.lon && !filters.radius)
        return;

    query.bool.filter.push({
        geo_distance: {
            distance: filters.radius,
            location: {
                lat: filters.lat,
                lon: filters.lon
            }
        }
    });
};