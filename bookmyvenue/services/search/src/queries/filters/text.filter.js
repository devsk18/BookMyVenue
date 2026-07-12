export default function applyTextFilter(query, filters) {
    if (!filters.q)
        return;

    query.query.bool.must.push({
        multi_match: {
            query: filters.q,
            fields: [
                "name^5",
                "description"
            ]
        }
    });
};