import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RegistrationForm from '../components/RegistrationForm';
import SectionHeading from '../components/SectionHeading';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const edit = urlParams.get('edit');
    const userId = urlParams.get('userId');
    
    const fetchUserData = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, "user", userId));
        if (userDoc.exists()) {
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          console.error('User not found');
          navigate('/user-profile');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/user-profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (edit === 'true' && userId) {
      setIsEditMode(true);
      fetchUserData(userId);
    } else {
      setIsEditMode(false);
      setLoading(false);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin h-8 w-8 border-2 border-white/30 border-t-white rounded-full"></div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <SectionHeading
                  id="register"
                  eyebrow={isEditMode ? "Edit Rider Profile" : "Join the Community"}
                  title={isEditMode ? "Update Your Information" : "Register as a Rider"}
                  description={isEditMode ? 
                    "Update your rider profile information below. Make sure to save your changes when done." :
                    "Become part of our riding community. Fill in your details to get started with exclusive rides and events."
                  }
                />
              </div>
              
              <RegistrationForm 
                editMode={isEditMode} 
                initialData={userData} 
              />
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
