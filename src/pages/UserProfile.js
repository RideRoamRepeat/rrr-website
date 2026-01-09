import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkAuthAndFetchUserData = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userId = localStorage.getItem('userId');

      if (!isLoggedIn || !userId) {
        navigate('/user-login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "user", userId));
        
        if (userDoc.exists()) {
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          setError('User data not found');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          navigate('/user-login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isSuperLogin');
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <main className="py-14">
          <Container>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin h-8 w-8 border-2 border-white/30 border-t-white rounded-full"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <main className="py-14">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8">
                <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
                <p className="text-white/60">{error}</p>
                <button
                  onClick={() => navigate('/user-login')}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <SectionHeading
                id="user-profile"
                eyebrow="My Profile"
                title="Rider Profile"
                description="View and manage your personal information and riding details."
              />
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  {userData.userImage ? (
                    <div className="h-20 w-20 overflow-hidden rounded-full">
                      <img
                        src={userData.userImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {userData.fullName || userData.riderName || 'Rider'}
                    </h2>
                    <p className="text-white/60">{userData.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        userData.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {userData.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                >
                  Logout
                </button>
              </div>

              {/* Profile Details Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Personal Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Full Name</span>
                      <span className="text-white">{userData.fullName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Rider Name</span>
                      <span className="text-white">{userData.riderName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Date of Birth</span>
                      <span className="text-white">{formatDate(userData.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Blood Group</span>
                      <span className="text-white">{userData.bloodGroup || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Mobile Number</span>
                      <span className="text-white">{userData.mobileNumber || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Instagram ID</span>
                      <span className="text-white">{userData.instagramId || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Contact Name</span>
                      <span className="text-white">{userData.emergencyContactName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Contact Number</span>
                      <span className="text-white">{userData.emergencyContactNumber || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Bike Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Bike Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Bike Brand & Model</span>
                      <span className="text-white">{userData.bikeBrandModel || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Engine CC</span>
                      <span className="text-white">{userData.engineCC || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Registration Number</span>
                      <span className="text-white">{userData.registrationNumber || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Bike Type</span>
                      <span className="text-white">{userData.bikeType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Modifications</span>
                      <span className="text-white">{userData.modifications || 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Account Status</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        userData.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {userData.status || 'pending'}
                      </span>
                    </div>
                    {/* <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60">Member Since</span>
                      <span className="text-white">{formatDate(userData.createdAt)}</span>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate(`/register?edit=true&userId=${userData.id}`)}
                  className="px-6 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-white/20 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
                >
                  ← Back to Home
                </button>
                {/* <button
                  onClick={() => navigate('/user-login')}
                  className="px-6 py-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition"
                >
                  Switch Account
                </button> */}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
