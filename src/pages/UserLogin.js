import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAnalytics } from '../hooks/useAnalytics';

export default function UserLogin() {
  const navigate = useNavigate();
  const { logLogin, logFormSubmission, logButtonClick, logApiCall, logNavigation } = useAnalytics();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Track login button click
    logButtonClick('user_login_submit', 'user_login_form');

    try {
      // Track API call start
      logApiCall('user_login', 'POST', true);

      const q = query(collection(db, "user"), where("email", "==", formData.email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('User not found. Please check your email.');
        // Track failed API call
        logApiCall('user_login', 'POST', false, new Error('User not found'));
        return;
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Check if user is approved and password matches
      if (userData.status !== 'approved') {
        setError('Your account is pending approval. Please contact admin.');
        // Track failed API call
        logApiCall('user_login', 'POST', false, new Error('Account not approved'));
        return;
      }
      
      if (userData.password === formData.password) {
        // Store session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isSuperLogin', userData.isSuperAdmin ? 'true' : 'false');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userId', userDoc.id);
        localStorage.setItem('userName', userData.fullName || userData.riderName);
        
        // Track successful login
        logLogin('regular_user', true);
        logFormSubmission('user_login', true);
        logApiCall('user_login', 'POST', true);
        logNavigation('/user-profile', { user_id: userDoc.id });
        
        alert('Login successful! Welcome back.');
        navigate('/user-profile');
      } else {
        setError('Invalid credentials. Please check your email and password.');
        // Track failed login
        logLogin('regular_user', false);
        logFormSubmission('user_login', false);
        logApiCall('user_login', 'POST', false, new Error('Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      // Track API error
      logApiCall('user_login', 'POST', false, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
          <div className="mx-auto max-w-md">
            <div className="mb-12 text-center">
              <SectionHeading
                id="user-login"
                eyebrow="Member Access"
                title="User Login"
                description="Access your rider profile and manage your account details."
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              {/* User Badge */}
              <div className="mb-6 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">Member Login</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="Email Id"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl border border-blue-500/30 bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </form>

              {/* Help Notice */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-white/60">
                    <p className="font-medium text-white/80 mb-1">Need Help?</p>
                    <p>Use your registered email and the password provided during registration. Contact admin if you've forgotten your password.</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                <button
                  onClick={() => {
                    logButtonClick('register_link', 'user_login_form');
                    logNavigation('/register');
                    navigate('/register');
                  }}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  Create Account
                </button>
                <span className="text-white/40">•</span>
                <button
                  onClick={() => {
                    logButtonClick('super_admin_link', 'user_login_form');
                    logNavigation('/super-user-login');
                    navigate('/super-user-login');
                  }}
                  className="text-amber-400 hover:text-amber-300 transition"
                >
                  Admin Access
                </button>
              </div>
              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={() => {
                    logButtonClick('back_to_home', 'user_login_form');
                    navigate('/');
                  }}
                  className="text-sm text-white/60 hover:text-white transition"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
