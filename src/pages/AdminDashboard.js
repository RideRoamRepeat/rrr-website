import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');

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
        alert('Failed to delete user');
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleMoveRideToPast = async (rideId) => {
    try {
      const rideRef = doc(db, "featured_ride", rideId);
      const rideDoc = await getDoc(rideRef);
      
      if (rideDoc.exists()) {
        const rideData = rideDoc.data();
        
        // Check if ride has a date and if it's in past
        if (rideData.rideDate) {
          const rideDate = new Date(rideData.rideDate);
          const today = new Date();
          
          if (rideDate < today) {
            // Delete from featured_ride collection
            await deleteDoc(rideRef);
            
            // Create new document in past_rides collection
            await addDoc(collection(db, "past_rides"), {
              ...rideData,
              movedToPastAt: serverTimestamp(),
              originalCollection: "featured_ride",
              pastStatus: "completed"
            });
            
            // Remove from current rides state
            setRides(prev => prev.filter(ride => ride.id !== rideId));
            
            alert('Ride moved to past rides successfully!');
          } else {
            alert('This ride date is in the future. Cannot move to past rides.');
          }
        } else {
          alert('Ride date not found');
        }
      } else {
        alert('Ride not found');
      }
    } catch (error) {
      console.error('Error moving ride to past:', error);
      alert('Failed to move ride to past rides');
    }
  };

  const handleUnapproveUser = async (user) => {
    if (window.confirm(`Are you sure you want to unapprove ${user.fullName}? They will no longer be visible on the website.`)) {
      try {
        await updateDoc(doc(db, "user", user.id), {
          ...user,
          status: "pending",
          unapprovedAt: serverTimestamp()
        });
        
        // Update local state to reflect the change
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: "pending" } : u
        ));
        
        alert(`${user.fullName} has been unapproved successfully! They are now pending approval.`);
      } catch (error) {
        console.error('Error unapproving user:', error);
        alert('Failed to unapprove user. Please try again.');
      }
    }
  };

  const handleApproveUser = async (user) => {
    if (window.confirm(`Are you sure you want to approve ${user.fullName}?`)) {
      try {
        await updateDoc(doc(db, "user", user.id), {
          ...user,
          status: "approved",
          approvedAt: serverTimestamp()
        });
        
        // Update local state to reflect the change
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: "approved" } : u
        ));
        
        alert(`${user.fullName} has been approved successfully!`);
      } catch (error) {
        console.error('Error approving user:', error);
        alert('Failed to approve user. Please try again.');
      }
    }
  };

  const handleEditUser = (user) => {
    // Navigate to registration page with user data for editing
    navigate('/register', { state: { editMode: true, userData: user } });
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
        <SectionHeading
          id="admin-dashboard"
          eyebrow="Admin Dashboard"
          title="Super User Control Panel"
          description="Manage users, rides, and system settings."
        />
        <Container>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white/80">Manage Users</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name, email, or rider name..."
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                  <button
                    onClick={() => setUserSearch('')}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
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
                      {users
                        .filter(user => 
                          userSearch === '' || 
                          user.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.riderName?.toLowerCase().includes(userSearch.toLowerCase())
                        )
                        .map((user) => (
                        <tr key={user.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 text-sm">{user.fullName || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">{user.email || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">@{user.riderName || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-white/60">{user.bikeBrandModel || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm">
                            {user.status === 'approved' ? (
                              <button
                                onClick={() => handleUnapproveUser(user)}
                                className="rounded-lg border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-orange-400 hover:bg-orange-400/20 transition mr-2"
                                title="Unapprove user"
                              >
                                ✗ Unapprove
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApproveUser(user)}
                                className="rounded-lg border border-green-400/20 bg-green-400/10 px-3 py-1 text-green-400 hover:bg-green-400/20 transition mr-2"
                                title="Approve user"
                              >
                                ✓ Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleEditUser(user)}
                              className="rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-blue-400 hover:bg-blue-400/20 transition mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleViewUser(user)}
                              className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-400 hover:bg-emerald-400/20 transition mr-2"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1 text-red-400 hover:bg-red-400/20 transition"
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
                                className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-400 hover:text-emerald-300 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleMoveRideToPast(ride.id)}
                                className="rounded-lg border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-orange-400 hover:bg-orange-400/20 transition"
                                title="Move to Past Rides"
                              >
                                Move to Past
                              </button>
                              <button
                                onClick={() => handleDeleteRide(ride.id)}
                                className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1 text-red-400 hover:text-red-300 transition"
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-8">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-6 pb-6 border-b border-white/10">
                <div className="flex-shrink-0">
                  {selectedUser.userImage ? (
                    <img
                      src={selectedUser.userImage}
                      alt={selectedUser.fullName}
                      className="h-20 w-20 rounded-full object-cover border-2 border-white/10"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/80 to-sky-400/80 border-2 border-white/10">
                      <span className="text-2xl font-medium text-white">
                        {selectedUser.fullName?.charAt(0)?.toUpperCase() || 'R'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{selectedUser.fullName}</h3>
                  {selectedUser.riderName && (
                    <p className="text-emerald-400 text-lg mb-1">@{selectedUser.riderName}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedUser.status && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {selectedUser.status}
                      </span>
                    )}
                    {selectedUser.bikeType && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {selectedUser.bikeType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/10">Personal Information</h4>
                  <div className="space-y-4">
                    {selectedUser.dateOfBirth && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Date of Birth:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.dateOfBirth}</span>
                      </div>
                    )}
                    {selectedUser.bloodGroup && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Blood Group:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.bloodGroup}</span>
                      </div>
                    )}
                    {selectedUser.mobileNumber && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Mobile Number:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.mobileNumber}</span>
                      </div>
                    )}
                    {selectedUser.email && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Email:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.email}</span>
                      </div>
                    )}
                    {selectedUser.instagramId && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Instagram:</span>
                        <span className="text-sm text-white font-medium">@{selectedUser.instagramId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/10">Emergency Contact</h4>
                  <div className="space-y-4">
                    {selectedUser.emergencyContactName && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Contact Name:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.emergencyContactName}</span>
                      </div>
                    )}
                    {selectedUser.emergencyContactNumber && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Contact Number:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.emergencyContactNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bike Details */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/10">Bike Information</h4>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    {selectedUser.bikeBrandModel && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Brand & Model:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.bikeBrandModel}</span>
                      </div>
                    )}
                    {selectedUser.engineCC && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Engine CC:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.engineCC}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {selectedUser.registrationNumber && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Registration Number:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.registrationNumber}</span>
                      </div>
                    )}
                    {selectedUser.bikeType && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Bike Type:</span>
                        <span className="text-sm text-white font-medium">{selectedUser.bikeType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser.modifications && (
                  <div className="py-2 border-b border-white/5">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-white/60 font-medium">Modifications:</span>
                      <span className="text-sm text-white font-medium text-right max-w-[60%]">{selectedUser.modifications}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Info */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/10">Registration Information</h4>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    {selectedUser.status && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Status:</span>
                        <span className="text-sm text-white font-medium capitalize">{selectedUser.status}</span>
                      </div>
                    )}
                    {selectedUser.createdAt && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Registration Date:</span>
                        <span className="text-sm text-white font-medium">
                          {selectedUser.createdAt?.toDate?.() ? 
                            new Date(selectedUser.createdAt.toDate()).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 
                            'N/A'
                          }
                        </span>
                      </div>
                    )}
                    {selectedUser.createdAt && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-white/60 font-medium">Registration Time:</span>
                        <span className="text-sm text-white font-medium">
                          {selectedUser.createdAt?.toDate?.() ? 
                            new Date(selectedUser.createdAt.toDate()).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 
                            'N/A'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
