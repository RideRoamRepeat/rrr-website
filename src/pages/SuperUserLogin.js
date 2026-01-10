import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAnalytics } from '../hooks/useAnalytics';

export default function SuperUserLogin() {
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
    logButtonClick('super_user_login_submit', 'super_user_login_form');

    try {
      // Track API call start
      logApiCall('super_user_login', 'POST', true);

      const q = query(collection(db, "user"), where("email", "==", formData.email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('User not found. Please check your email.');
        // Track failed API call
        logApiCall('super_user_login', 'POST', false, new Error('User not found'));
        return;
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Check if user is super admin and password matches
      if (userData.isSuperAdmin && userData.password === formData.password) {
        // Store session (in production, use secure tokens)
        localStorage.setItem('isSuperUser', 'true');
        localStorage.setItem('isSuperLogin', 'true');
        localStorage.setItem('superUserEmail', formData.email);
        
        // Track successful super admin login
        logLogin('super_admin', true);
        logFormSubmission('super_user_login', true);
        logApiCall('super_user_login', 'POST', true);
        logNavigation('/admin-dashboard', { user_id: userDoc.id });
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('authChange', { detail: { type: 'superUserLogin' } }));
        
        alert('Login successful! Welcome Super User.');
        navigate('/admin-dashboard');
      } else if (!userData.isSuperAdmin) {
        setError('Access denied. You do not have super admin privileges.');
        // Track access denied
        logLogin('super_admin', false);
        logFormSubmission('super_user_login', false);
        logApiCall('super_user_login', 'POST', false, new Error('Access denied - not super admin'));
      } else {
        setError('Invalid credentials. Please check your email and password.');
        // Track failed login
        logLogin('super_admin', false);
        logFormSubmission('super_user_login', false);
        logApiCall('super_user_login', 'POST', false, new Error('Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      // Track API error
      logApiCall('super_user_login', 'POST', false, error);
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
                id="super-user-login"
                eyebrow="Admin Access"
                title="Super User Login"
                description="Secure access for system administrators and content managers."
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              {/* Security Badge */}
              <div className="mb-6 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium">Secure Authentication</span>
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
                  className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500 px-6 py-3 text-white font-semibold transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : 'Login as Super User'}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm text-white/60">
                    <p className="font-medium text-white/80 mb-1">Security Notice</p>
                    <p>This is a restricted area for authorized personnel only. All login attempts are logged and monitored.</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                <button
                  onClick={() => {
                    logButtonClick('register_link', 'super_user_login_form');
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
                    logButtonClick('user_login_link', 'super_user_login_form');
                    logNavigation('/user-login');
                    navigate('/user-login');
                  }}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  User Login
                </button>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    logButtonClick('back_to_home', 'super_user_login_form');
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
