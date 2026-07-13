export const fetchStats = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({
    upcomingBookings: 2,
    totalSpent: '$4,250',
    savedVenues: 5,
  }), 800));
};

export const fetchBookings = async () => {
  return new Promise((resolve) => setTimeout(() => resolve([
    {
      id: 1,
      name: 'Grand Plaza Banquet Hall',
      date: 'Aug 15, 2026',
      time: '18:00 - 23:00',
      status: 'Upcoming',
      location: 'Downtown District',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400',
      price: '$1,200'
    },
    {
      id: 2,
      name: 'Sunset Beach Pavilion',
      date: 'Sep 02, 2026',
      time: '10:00 - 16:00',
      status: 'Upcoming',
      location: 'West Coast Marina',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400',
      price: '$850'
    },
    {
      id: 3,
      name: 'Urban Loft Workspace',
      date: 'Jun 10, 2026',
      time: '09:00 - 17:00',
      status: 'Completed',
      location: 'City Center',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
      price: '$450'
    }
  ]), 1000));
};
