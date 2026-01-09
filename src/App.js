import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Container from './components/Container';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import SectionHeading from './components/SectionHeading';
import RideCard from './components/RideCard';
import RideItinerary from './pages/RideItinerary';
import Users from './pages/Users';
import CreateItinerary from './pages/CreateItinerary';
import SuperUserLogin from './pages/SuperUserLogin';
import UserLogin from './pages/UserLogin';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import HomeBanner from './components/HomeBanner';
import Hero from './components/Hero';
import Register from './pages/Register';
import Accessories from './pages/Accessories';

function HomePage() {
  const [featuredRide, setFeaturedRide] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  // const carouselRef = useRef(null);
  const navigate = useNavigate();

  // const scrollCarousel = (direction) => {
  //   console.log('scrollCarousel called with direction:', direction);
  //   const carousel = carouselRef.current;
  //   if (!carousel) {
  //     console.log('Carousel ref not found');
  //     return;
  //   }
    
  //   const scrollAmount = 450; // Adjusted for better card visibility
  //   console.log('Scrolling by:', scrollAmount);
    
  //   if (direction === 'left') {
  //     carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  //   } else {
  //     carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  //   }
  // };

  useEffect(() => {

    const fetchRideFeatures = async () => {
      const querySnapshot = await getDocs(collection(db, "featured_ride"));

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFeaturedRide(data);
    };
    fetchRideFeatures();
  }, []);

  useEffect(() => {
    const fetchPastRides = async () => {
      const querySnapshot = await getDocs(collection(db, "past_rides"));

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPastRides(data);
    };
    fetchPastRides();
  }, []);

  const handleNavigate = (rideData) => {
    navigate('/ride-itinerary', { state: { selectedRide: rideData } });
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white overflow-x-hidden">
      <Navbar />
      <HomeBanner />
      <main>
        <Hero />

        <section className="py-14">
          <SectionHeading
            id="rides"
            eyebrow="Upcoming rides"
            title="Ride Roam Repeat | Upcoming Ride"
            description="Gear up for our next adventure on the open road. The upcoming Ride Roam Repeat ride is all about scenic routes, smooth rides, and shared experiences. Join us as we ride together, explore new destinations, and create memories worth repeating."
          />
          <Container className="mt-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {featuredRide?.map((item) => {
                return (
                  <RideCard
                    key={item?.id}
                    rideData={item}
                    handleNavigate={handleNavigate}
                  />
                )
              })}
            </div>
          </Container>
        </section>

        {pastRides?.length > 0 && <section className="py-14">
          <SectionHeading
            id="destinations"
            eyebrow="Past rides"
            title="Ride Roam Repeat | Recent Rides"
            description="A snapshot of our latest journeys on the open road. Every Ride Roam Repeat trip is about scenic routes, meaningful connections, and unforgettable riding experiences. These rides reflect who we are and why we ride."
          />

          <Container className="mt-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {pastRides?.slice(-3).map((item) => {
                return (
                   <RideCard
                    key={item?.id}
                    rideData={item}
                    handleNavigate={handleNavigate}
                  />
  
                )
              })}
            </div>
          </Container>
        </section> }

        {/* About Section */}
        <section className="py-14">
          <SectionHeading
            id="about"
            eyebrow="Why Ride Roam Repeat?"
            title="Ride Roam Repeat is a rider-driven community focused on meaningful motorcycle journeys. We bring together passionate riders to explore scenic destinations, well-planned routes, and shared experiences—without the chaos."
          />
          <Container className="mt-8">


            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Every ride includes:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Carefully chosen routes</h4>
                      <p className="text-sm text-white/60">Scenic roads with optimal riding conditions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Comfortable stay options</h4>
                      <p className="text-sm text-white/60">Quality accommodations for rest and recovery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Group coordination & safety</h4>
                      <p className="text-sm text-white/60">Organized group rides with safety protocols</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Memories worth repeating</h4>
                      <p className="text-sm text-white/60">Unforgettable experiences that keep you coming back</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Curated Rides, Not Just Destinations</h3>
                <p className="text-white/70 leading-relaxed">
                  Our rides are more than pin drops on a map. Each journey is planned with road quality, scenery, riding time, and group comfort in mind. From early morning starts to relaxed campfire nights, we focus on the complete riding experience.
                </p>
                
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">Complete Experience</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      Road quality assessment and route optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      Scenic stops and photo opportunities
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      Local cuisine and cultural experiences
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      Flexible riding pace for all skill levels
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      Emergency support and backup plans
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Gear Section - Commented out for now */}
        {/* <section className="py-14">
          <SectionHeading
            id="gear"
            eyebrow="Gear"
            title="Pack light. Ride far. Stay comfy."
            description="A simple starter kit you can evolve into your own packing system." 
          />
          <Container className="mt-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <GearCard
                title="Ride essentials"
                price={2999}
                imageUrl="https://www.blesserhouse.com/wp-content/uploads/2021/06/2-2.jpg"
                imageAlt="Cycling repair kit and tools"
                features={['Two tubes', 'Mini pump', 'Tire levers', 'Multi-tool']}
              />
              <GearCard
                title="Riding jacket"
                price={4999}
                imageUrl="https://planetdsg.com/cdn/shop/files/dsg-race-pro-v2-yellow-fluo-riding-jacket2.jpg?v=1761829540&width=1400"
                imageAlt="Cycling jacket for all weather"
                features={['Waterproof', 'Breathable', 'Reflective', 'Pockets']}
              />
              <GearCard
                title="Riding boots"
                price={3499}
                imageUrl="https://www.mxstore.in/cdn/shop/files/Boots-Cross-White_0fdc4678-c2fa-4c7c-af47-4490a4dcbd67.webp?v=1725960901&width=1214"
                imageAlt="Cycling boots for off-road"
                features={['Waterproof', 'Grip sole', 'Ankle support', 'Quick lace']}
              />
            </div>
          </Container>
        </section> */}

        {/* <section className="py-14">
          <SectionHeading
            id="stories"
            eyebrow="Stories"
            title="Travel notes from the saddle"
            description="Turn your rides into short posts: where you stopped, what you ate, and the one moment that made the whole trip worth it." 
          />
          <Container className="mt-8">
            <SubscribeCard />
          </Container>
        </section> */}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/ride-itinerary" element={<RideItinerary />} />
        <Route path="/users" element={<Users />} />
        <Route path="/create-itinerary" element={<CreateItinerary />} />
        <Route path="/super-user-login" element={<SuperUserLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


