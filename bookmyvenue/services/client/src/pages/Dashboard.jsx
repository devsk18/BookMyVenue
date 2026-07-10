import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Heart, Wallet } from "lucide-react";
import { fetchStats } from "../apis/dashboard";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({ 
    queryKey: ['dashboardStats'], 
    queryFn: fetchStats
  });

  if (isLoading) {
    return <div className="animate-pulse flex gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 w-full bg-gray-200 rounded-2xl"></div>)}
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Alex! 👋</h2>
        <p className="text-gray-500 mt-1">Here is what's happening with your venue bookings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <CalendarCheck size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Upcoming Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSpent}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">
            <Heart size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Saved Venues</p>
            <p className="text-2xl font-bold text-gray-900">{stats.savedVenues}</p>
          </div>
        </div>
      </div>
    </div>
  );
};