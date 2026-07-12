export default function applyCityFilter(query, filters) {
    if (!filters.city)
        return;

    query.query.bool.must.push({
        term: {
            city: filters.city
        }
    });
};