import React from 'react';
import { useLocation } from 'react-router-dom';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RegistrationForm from '../components/RegistrationForm';
import SectionHeading from '../components/SectionHeading';

export default function Register() {
  const location = useLocation();
  const isEditMode = location.state?.editMode;
  const userData = location.state?.userData;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
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
        </Container>
      </main>

      <Footer />
    </div>
  );
}
