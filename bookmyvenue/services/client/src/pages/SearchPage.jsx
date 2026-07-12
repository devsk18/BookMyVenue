import React, { useState, useEffect } from 'react';
import { 
  MapPin, Star, Users, Navigation, IndianRupee, 
  Wifi, Car, Wind, Zap, ChevronLeft, ChevronRight, 
  Search, Filter, X, SlidersHorizontal
} from 'lucide-react';

const AMENITIES_LIST = ['wifi', 'parking', 'ac', 'generator', 'catering', 'bar'];

const getAmenityIcon = (amenity) => {
  switch (amenity.toLowerCase()) {
    case 'wifi': return <Wifi className="w-3 h-3 mr-1" />;
    case 'parking': return <Car className="w-3 h-3 mr-1" />;
    case 'ac': return <Wind className="w-3 h-3 mr-1" />;
    case 'generator': return <Zap className="w-3 h-3 mr-1" />;
    default: return null;
  }
};

const SearchPage = () => {
  // --- States ---
  const [venues, setVenues] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search & Location
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(15);
  const [locationError, setLocationError] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    capacityMin: '',
    capacityMax: '',
    rating: 0,
    amenities: [],
    sort: 'relevance'
  });

  // --- API Call ---
  const fetchVenues = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      
      // Pagination
      params.append('page', page);
      params.append('limit', 12);
      
      // Text Search
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      
      // Location
      if (userLocation) {
        params.append('lat', userLocation.lat);
        params.append('lon', userLocation.lon);
        params.append('radius', `${radius}km`);
      }

      // Numeric Filters
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.capacityMin) params.append('capacityMin', filters.capacityMin);
      if (filters.capacityMax) params.append('capacityMax', filters.capacityMax);
      if (filters.rating > 0) params.append('rating', filters.rating);
      
      // Amenities (Fastify usually parses multiple same-key values as an array)
      filters.amenities.forEach(amenity => {
        params.append('amenities', amenity);
      });

      // Sorting
      if (filters.sort !== 'relevance') {
        params.append('sort', filters.sort);
      }

      const response = await fetch(`http://localhost:7000/search/venues?${params.toString()}`);
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      setVenues(data.results || []);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage,
        count: data.count
      });
      
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when dependencies change (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchVenues();
    }, 400); // 400ms debounce allows typing in filter inputs without spamming API

    return () => clearTimeout(debounceTimer);
  }, [page, userLocation, radius, searchQuery, filters]);

  // --- Handlers ---
  const handleNearMe = () => {
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
          setPage(1);
        },
        () => setLocationError('Location access denied.')
      );
    } else {
      setLocationError('Geolocation not supported.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset page on filter change
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ priceMin: '', priceMax: '', capacityMin: '', capacityMax: '', rating: 0, amenities: [], sort: 'relevance' });
    setUserLocation(null);
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* --- Top Navbar --- */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex justify-between w-full md:w-auto items-center">
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <MapPin className="w-7 h-7" /> BookMyVenue
            </h1>
            <button 
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex w-full md:w-auto gap-3 flex-1 md:max-w-xl">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search by name, city..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- Left Sidebar (Filters) --- */}
          <aside className={`w-full md:w-64 shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> Filters
                </h3>
                <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline">Clear</button>
              </div>

              {/* Location / Near Me */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <button 
                  onClick={handleNearMe}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userLocation ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {userLocation ? 'Location Active' : 'Near Me Search'}
                </button>
                {locationError && <p className="text-xs text-red-500 mt-1">{locationError}</p>}
                
                {userLocation && (
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-600 flex justify-between">
                      <span>Radius</span> <span>{radius} km</span>
                    </label>
                    <input 
                      type="range" min="5" max="100" step="5"
                      value={radius} onChange={(e) => setRadius(e.target.value)}
                      className="w-full mt-1 accent-indigo-600"
                    />
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="text-sm font-semibold text-gray-900 block mb-3">Price per day (₹)</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={filters.priceMin} onChange={e => handleFilterChange('priceMin', e.target.value)} className="w-full p-2 text-sm border rounded" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" value={filters.priceMax} onChange={e => handleFilterChange('priceMax', e.target.value)} className="w-full p-2 text-sm border rounded" />
                </div>
              </div>

              {/* Capacity */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="text-sm font-semibold text-gray-900 block mb-3">Guest Capacity</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={filters.capacityMin} onChange={e => handleFilterChange('capacityMin', e.target.value)} className="w-full p-2 text-sm border rounded" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" value={filters.capacityMax} onChange={e => handleFilterChange('capacityMax', e.target.value)} className="w-full p-2 text-sm border rounded" />
                </div>
              </div>

              {/* Min Rating */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="text-sm font-semibold text-gray-900 block mb-3">Minimum Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => handleFilterChange('rating', star === filters.rating ? 0 : star)}
                      className={`p-1 rounded ${filters.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-3">Amenities</label>
                <div className="space-y-2">
                  {AMENITIES_LIST.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer capitalize">
                      <input 
                        type="checkbox" 
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* --- Right Content (Results) --- */}
          <section className="flex-1">
            
            {/* Results Header & Sorting */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Venues Found</h2>
                <p className="text-sm text-gray-500">Showing {venues.length} of {pagination.count || 0} results</p>
              </div>

              <select 
                value={filters.sort} 
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 bg-white cursor-pointer"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="capacity">Largest Capacity</option>
                {userLocation && <option value="distance">Nearest to Me</option>}
              </select>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(sk => <div key={sk} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>)}
              </div>
            ) : venues.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No venues found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters or searching a different area.</p>
                <button onClick={clearFilters} className="mt-4 text-indigo-600 font-medium hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <div key={venue.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col group">
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/600x400/?banquet,hall,wedding,${venue.id}`} 
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-sm font-bold">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {venue.rating}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 truncate" title={venue.name}>{venue.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mb-2">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {venue.city}, {venue.state}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(venue.amenities || []).slice(0, 3).map(amenity => (
                          <span key={amenity} className="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-gray-100 text-gray-600 capitalize">
                            {getAmenityIcon(amenity)} {amenity}
                          </span>
                        ))}
                        {(venue.amenities?.length > 3) && <span className="px-2 py-1 rounded text-[11px] font-medium bg-gray-100 text-gray-600">+{venue.amenities.length - 3}</span>}
                      </div>

                      <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-end">
                        <div className="flex flex-col text-sm text-gray-600">
                          <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1" /> Up to {venue.capacity}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-indigo-600 flex items-center justify-end">
                            <IndianRupee className="w-4 h-4" />{venue.pricePerDay.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-gray-500 uppercase font-semibold">per day</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && venues.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Page <span className="font-semibold text-gray-900">{pagination.page}</span> of <span className="font-semibold text-gray-900">{pagination.totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => p - 1)} disabled={!pagination.hasPreviousPage} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </button>
                  <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNextPage} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;