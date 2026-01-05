import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Check if user is authenticated
    const isSuperUser = localStorage.getItem('isSuperUser');
    if (!isSuperUser) {
      navigate('/super-user-login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, "user"));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch rides/itineraries
      const ridesSnapshot = await getDocs(collection(db, "featured_ride"));
      const ridesData = ridesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(usersData);
      setRides(ridesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isSuperUser');
    localStorage.removeItem('superUserEmail');
    navigate('/');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, "user", userId));
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handleEditRide = (ride) => {
    // Navigate to create itinerary with ride data for editing
    navigate('/create-itinerary', { state: { editMode: true, rideData: ride } });
  };

  const handleDeleteRide = async (rideId) => {
    if (window.confirm('Are you sure you want to delete this ride?')) {
      try {
        await deleteDoc(doc(db, "featured_ride", rideId));
        setRides(rides.filter(ride => ride.id !== rideId));
        alert('Ride deleted successfully');
      } catch (error) {
        console.error('Error deleting ride:', error);
        alert('Error deleting ride');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <SectionHeading
                  id="admin-dashboard"
                  eyebrow="Admin Dashboard"
                  title="Super User Control Panel"
                  description="Manage users, rides, and system settings."
                />
                <p className="mt-2 text-sm text-white/60">
                  Logged in as: {localStorage.getItem('superUserEmail')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 transition"
              >
                Logout
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10">
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-4 px-2 text-sm font-medium transition ${
                  activeTab === 'users'
                    ? 'border-b-2 border-emerald-400 text-emerald-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('rides')}
                className={`pb-4 px-2 text-sm font-medium transition ${
                  activeTab === 'rides'
                    ? 'border-b-2 border-emerald-400 text-emerald-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Rides ({rides.length})
              </button>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10 bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Rider Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Bike</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 text-sm">{user.fullName || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">{user.email || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">@{user.riderName || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">{user.bikeBrandModel || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Rides Tab */}
          {activeTab === 'rides' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white/80">Manage Rides</h3>
                <button
                  onClick={() => navigate('/create-itinerary')}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Itinerary
                </button>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10 bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Distance</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Difficulty</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {rides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 text-sm">{ride.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">{ride.location || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">{ride.distanceKm || 0} km</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                              {ride.difficulty || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditRide(ride)}
                                className="text-emerald-400 hover:text-emerald-300 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteRide(ride.id)}
                                className="text-red-400 hover:text-red-300 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total Users</p>
                  <p className="text-2xl font-semibold">{users.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total Rides</p>
                  <p className="text-2xl font-semibold">{rides.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">System Status</p>
                  <p className="text-2xl font-semibold text-emerald-400">Active</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
