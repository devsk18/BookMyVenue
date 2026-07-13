import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin } from "lucide-react";
import { fetchBookings } from "../apis/dashboard";

export default function Bookings() {
  const { data: bookings, isLoading } = useQuery({ 
    queryKey: ['bookings'], 
    queryFn: fetchBookings
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          <p className="text-gray-500 mt-1">Manage your upcoming and past reservations.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1, 2].map(i => <div key={i} className="h-48 w-full bg-gray-200 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              <img 
                src={booking.image} 
                alt={booking.name} 
                className="w-full md:w-64 h-48 md:h-auto object-cover rounded-xl"
              />
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{booking.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600 gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm">{booking.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">{booking.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm">{booking.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900">{booking.price}</p>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};