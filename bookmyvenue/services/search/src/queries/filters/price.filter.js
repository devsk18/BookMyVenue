export default function applyPriceFilter (query, filters) {
    if (!filters.priceMax)
        return;

    query.query.bool.filter.push({
        range: {
            pricePerDay: {
                lte: filters.priceMax
            }
        }
    });
};