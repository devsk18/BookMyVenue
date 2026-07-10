import filters from "./filters/index.js";

export default function createVenueQuery (requestFilters) {
    const query = {
        query: {
            bool: {
                must: [],
                filter: [],
                should: [],
                must_not: []
            }
        }
    };

    for (const filter of filters) {
        filter(query.query, requestFilters);
    }

    return query;
};