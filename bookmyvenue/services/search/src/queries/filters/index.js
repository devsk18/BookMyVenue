import applyTextFilter from './text.filter.js'
import applyPriceFilter from './price.filter.js'
import applyGeoFilter from './geo.filter.js'
import applyCityFilter from './city.filter.js';
import applyPagination from './pagination.filter.js';

const filters = [
    applyTextFilter,
    applyPriceFilter,
    applyGeoFilter,
    applyCityFilter,
    applyPagination
];

export default filters;