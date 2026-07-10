export default function applyPriceFilter (query, filters) {
    if (!filters.priceMax)
        return;

    query.bool.filter.push({
        range: {
            pricePerDay: {
                lte: filters.priceMax
            }
        }
    });
};