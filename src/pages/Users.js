import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Helper functions to mask sensitive data
  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.slice(0, 3)}***@${domain}`;
  };

  const maskPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}****`;
    }
    return `${cleaned.slice(0, 4)}****`;
  };

  const maskDateOfBirth = (dob) => {
    if (!dob) return '';
    const date = new Date(dob);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day.toString().padStart(2, '0')}/****`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "user"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.riderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bikeBrandModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p>Loading registered users...</p>
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
          <div className="mb-12 text-center">
            <SectionHeading
              id="users"
              eyebrow="Community Members"
              title="Registered Riders"
              description="Meet the amazing riders who are part of our community. Connect, share experiences, and ride together."
            />
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="mx-auto max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, rider name, bike, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-12 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                />
                <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className="mb-8">
            <div className="text-sm text-white/60 mb-4">
              Showing {filteredUsers.length} of {users.length} riders
            </div>
            
            {filteredUsers.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/7"
                  >
                    <div className="p-6">
                      {/* Avatar */}
                      <div className="mb-4 flex justify-center">
                        {user.userImage ? (
                          <img
                            src={user.userImage}
                            alt={user.fullName}
                            className="h-20 w-20 rounded-full object-cover border-2 border-white/10"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/80 to-sky-400/80 border-2 border-white/10">
                            <span className="text-2xl font-medium text-white">
                              {user.fullName?.charAt(0)?.toUpperCase() || 'R'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="text-center">
                        <h3 className="mb-1 font-semibold">{user.fullName}</h3>
                        {user.riderName && (
                          <p className="mb-3 text-sm text-emerald-400">@{user.riderName}</p>
                        )}
                        
                        {/* Bike Info */}
                        {user.bikeBrandModel && (
                          <div className="mb-3 text-sm text-white/60">
                            🏍️ {user.bikeBrandModel}
                          </div>
                        )}

                        {/* Quick Stats */}
                        <div className="flex justify-center gap-2 text-xs">
                          {user.bikeType && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
                              {user.bikeType}
                            </span>
                          )}
                          {user.bloodGroup && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
                              {user.bloodGroup}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                  <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
                <p className="text-sm text-white/60">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </Container>
      </main>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Rider Profile</h2>
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
            <div className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-4">
                {selectedUser.userImage ? (
                  <img
                    src={selectedUser.userImage}
                    alt={selectedUser.fullName}
                    className="h-16 w-16 rounded-full object-cover border-2 border-white/10"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/80 to-sky-400/80 border-2 border-white/10">
                    <span className="text-xl font-medium text-white">
                      {selectedUser.fullName?.charAt(0)?.toUpperCase() || 'R'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.fullName}</h3>
                  {selectedUser.riderName && (
                    <p className="text-emerald-400">@{selectedUser.riderName}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white/60">Contact Information</h4>
                {selectedUser.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/60">📧</span>
                    <span>{maskEmail(selectedUser.email)}</span>
                  </div>
                )}
                {selectedUser.mobileNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/60">📱</span>
                    <span>{maskPhoneNumber(selectedUser.mobileNumber)}</span>
                  </div>
                )}
                {selectedUser.instagramId && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/60">📷</span>
                    <span>@{selectedUser.instagramId}</span>
                  </div>
                )}
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white/60">Personal Details</h4>
                {selectedUser.dateOfBirth && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/60">🎂</span>
                    <span>{maskDateOfBirth(selectedUser.dateOfBirth)}</span>
                  </div>
                )}
                {selectedUser.bloodGroup && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/60">🩸</span>
                    <span>Blood Group: {selectedUser.bloodGroup}</span>
                  </div>
                )}
              </div>

              {/* Bike Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white/60">Bike Information</h4>
                {selectedUser.bikeBrandModel && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/60">🏍️</span>
                    <span>{selectedUser.bikeBrandModel}</span>
                  </div>
                )}
                {selectedUser.bikeType && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-white/60">🏷️</span>
                    <span>Type: {selectedUser.bikeType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
