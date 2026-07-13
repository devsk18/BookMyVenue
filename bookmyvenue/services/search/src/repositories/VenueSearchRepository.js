import createVenueQuery from "../queries/venue.query.js";

export default class VenueSearchRepository {
    async search(elastic, filters) {
        const query = createVenueQuery(filters);
        const response = await elastic.search({
            index: "venues",
            ...query,
        });
        const results = response.hits.hits.map(hit => ({
            score: hit._score,
            ...hit._source
        }));

        const total = response.hits.total.value;
        const page = Number(filters.page ?? 1);
        const limit = Number(filters.limit ?? 20);

        return {
            count: total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1,
            time: `${response.took}ms`,
            results
        };
    }
}
