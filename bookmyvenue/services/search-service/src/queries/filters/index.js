import applyTextFilter from './text.filter.js'
import applyPriceFilter from './price.filter.js'
import applyGeoFilter from './geo.filter.js'
import applyCityFilter from './city.filter.js';

const filters = [
    applyTextFilter,
    applyPriceFilter,
    applyGeoFilter,
    applyCityFilter
];

export default filters;