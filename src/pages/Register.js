import React from 'react';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RegistrationForm from '../components/RegistrationForm';
import SectionHeading from '../components/SectionHeading';

export default function Register() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <SectionHeading
                id="register"
                eyebrow="Join the Community"
                title="Register as a Rider"
                description="Become part of our riding community. Fill in your details to get started with exclusive rides and events."
              />
            </div>
            
            <RegistrationForm />
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
