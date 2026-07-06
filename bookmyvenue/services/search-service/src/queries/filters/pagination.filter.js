export default function applyPagination(query, filters) {
    const page = Number(filters.page ?? 1);
    const limit = Number(filters.limit ?? 20);

    query.from = (page - 1) * limit;
    query.size = limit;
}