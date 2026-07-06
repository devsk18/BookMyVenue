import createVenueQuery from "../queries/venue.query.js";

export default class VenueSearchRepository {
    async search(elastic, filters) {
        const query = createVenueQuery(filters);
        const response = await elastic.search({
            index: "venues",
            ...query,
        });
        const res = response.hits.hits.map(hit => ({
            score: hit._score,
            ...hit._source
        }));

        console.log(res)

        return {
            count: response.hits.total.value,
            time: response.took + "ms",
            results: res
        }
    }
}
