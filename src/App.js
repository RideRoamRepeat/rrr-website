import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Container from './components/Container';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import SectionHeading from './components/SectionHeading';
import RideCard from './components/RideCard';
import RideItinerary from './pages/RideItinerary';
import Users from './pages/Users';
import CreateItinerary from './pages/CreateItinerary';
import SuperUserLogin from './pages/SuperUserLogin';
import AdminDashboard from './pages/AdminDashboard';
import DestinationCard from './components/DestinationCard';
import GearCard from './components/GearCard';
import HomeBanner from './components/HomeBanner';
import Hero from './components/Hero';


function HomePage() {
  const [featuredRide, setFeaturedRide] = useState([]);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const scrollCarousel = (direction) => {
    console.log('scrollCarousel called with direction:', direction);
    const carousel = carouselRef.current;
    if (!carousel) {
      console.log('Carousel ref not found');
      return;
    }
    
    const scrollAmount = 450; // Adjusted for better card visibility
    console.log('Scrolling by:', scrollAmount);
    
    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  useEffect(() => {
    const fetchRideFeatures = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "featured_ride"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setFeaturedRide(data);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };
    fetchRideFeatures();
  }, []);

  const handleNavigate = (rideData) => {
    navigate('/ride-itinerary', { state: { selectedRide: rideData } });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <HomeBanner />
      <main>
        <Hero />

        <section className="py-14">
          <SectionHeading
            id="rides"
            eyebrow="Upcoming rides"
            title="Routes for early mornings and long evenings"
            description="Pick a distance, match your legs, and don't forget the cafe stop. These are sample cards—swap in your real routes when ready."
          />
          <Container className="mt-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {featuredRide?.map((item) => {
                console.log("VDJHVDKJVDKJVDKVKDVKJDVVKD ", item);
                
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

        <section className="py-14">
          <SectionHeading
            id="destinations"
            eyebrow="Past rides"
            title="Ride-and-roam weekends"
            description="Short trips that pair well with cycling: good roads, great views, and food you'll talk about on the ride back."
          />
          <Container className="mt-8">
            <div className="grid gap-6 md:hidden">
              <DestinationCard
                name="Munnar"
                vibe="Coastal breezes and cafe crawls"
                bestTime="17th Jan"
                imageUrl="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=70"
                imageAlt="Ocean road at sunrise"
                highlights={['Beach roads', 'French quarter', 'Coffee']}
              />
              <DestinationCard
                name="Kodaikanal"
                vibe="Climbs, mist, and warm bowls"
                bestTime="Nov–Mar"
                imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70"
                imageAlt="Misty mountain road"
                highlights={['Hill climbs', 'Lakeside', 'Sunrise']}
              />
              <DestinationCard
                name="Ooty"
                vibe="Big views, slow mornings"
                bestTime="Oct–May"
                imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=70"
                imageAlt="Forest hills and winding road"
                highlights={['Tea estates', 'Cool air', 'Long rides']}
              />
              <DestinationCard
                name="Coorg"
                vibe="Coffee plantations and winding roads"
                bestTime="Dec–Feb"
                imageUrl="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=70"
                imageAlt="Coffee plantation road"
                highlights={['Plantation roads', 'Cool climate', 'Scenic views']}
              />
            </div>

            <div className="hidden md:block relative">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <DestinationCard
                    name="Munnar"
                    vibe="Coastal breezes and cafe crawls"
                    bestTime="17th Jan"
                    imageUrl="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=70"
                    imageAlt="Ocean road at sunrise"
                    highlights={['Beach roads', 'French quarter', 'Coffee']}
                  />
                  <DestinationCard
                    name="Kodaikanal"
                    vibe="Climbs, mist, and warm bowls"
                    bestTime="Nov–Mar"
                    imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70"
                    imageAlt="Misty mountain road"
                    highlights={['Hill climbs', 'Lakeside', 'Sunrise']}
                  />
                  <DestinationCard
                    name="Ooty"
                    vibe="Big views, slow mornings"
                    bestTime="Oct–May"
                    imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=70"
                    imageAlt="Forest hills and winding road"
                    highlights={['Tea estates', 'Cool air', 'Long rides']}
                  />
                  <DestinationCard
                    name="Coorg"
                    vibe="Coffee plantations and winding roads"
                    bestTime="Dec–Feb"
                    imageUrl="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=70"
                    imageAlt="Coffee plantation road"
                    highlights={['Plantation roads', 'Cool climate', 'Scenic views']}
                  />
                  <DestinationCard
                    name="Wayanad"
                    vibe="Green hills and spice gardens"
                    bestTime="Oct–Mar"
                    imageUrl="https://images.unsplash.com/photo-1540202404-1b6271e8b6e2?auto=format&fit=crop&w=1200&q=70"
                    imageAlt="Spice garden road"
                    highlights={['Spice gardens', 'Wildlife', 'Scenic views']}
                  />
                </div>
              </div>
              
              {/* Carousel Navigation */}
              <button 
                onClick={() => {
                  console.log('Left button clicked');
                  scrollCarousel('left');
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-zinc-900/90 p-3 text-white/80 backdrop-blur-sm transition hover:bg-zinc-800 hover:text-white z-10"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  console.log('Right button clicked');
                  scrollCarousel('right');
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-zinc-900/90 p-3 text-white/80 backdrop-blur-sm transition hover:bg-zinc-800 hover:text-white z-10"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Container>
        </section>

        <section className="py-14">
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
        </section>

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ride-itinerary" element={<RideItinerary />} />
        <Route path="/users" element={<Users />} />
        <Route path="/create-itinerary" element={<CreateItinerary />} />
        <Route path="/super-user-login" element={<SuperUserLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


