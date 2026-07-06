export default function applyCityFilter(query, filters) {
    if (!filters.city)
        return;

    query.bool.must.push({
        term: {
            city: filters.city
        }
    });
};