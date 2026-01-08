import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ParticipantsModal from '../components/ParticipantsModal';
import SectionHeading from '../components/SectionHeading';

export default function RideItinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRide, setSelectedRide] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if ride data was passed from navigation
    if (location.state?.selectedRide) {
      const passedRide = location.state.selectedRide;

      console.log("LJHVDJHVKJLDVJKVDKJVDKJVKJDVK ", JSON.stringify(passedRide));
      

      
      const newRide = {
          id: Date.now(), // temporary ID
          name: passedRide.title,
          location: passedRide.location,
          distanceKm: passedRide.distanceKm,
          elevationM: passedRide.elevationM,
          time: passedRide.time,
          tags: passedRide.tags,
          imageUrl: passedRide.imageUrl,
          imageAlt: passedRide.imageAlt,
          itinerary: passedRide?.itinerary || [],
          highlights: passedRide?.highlights || ['Scenic route', 'Great views'],
          requirements: passedRide?.requirements || ['Helmet mandatory', 'Water bottle', 'Basic fitness'],
          meetup: passedRide?.meetup,
          difficulty: passedRide?.difficulty,
          description: passedRide?.description,
          selectedRiders: passedRide?.selectedRiders || [],
          rideDate: passedRide?.rideDate,
          exclusions: passedRide?.exclusions || []
        };
        setSelectedRide(newRide);
        
        // Fetch user details for selected riders
        if (passedRide?.selectedRiders && passedRide.selectedRiders.length > 0) {
          fetchSelectedRiders(passedRide.selectedRiders);
        }
    } 
     
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [location.state]);

  const fetchSelectedRiders = async (selectedRiderIds) => {
    try {
      const querySnapshot = await getDocs(collection(db, "user"));
      const allUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter users to only include selected riders who are approved
      const selectedUsers = allUsers.filter(user => 
        selectedRiderIds.includes(user.id) && user.status === 'approved'
      );
      
      setParticipants(selectedUsers);
    } catch (error) {
      console.error('Error fetching selected riders:', error);
    }
  };


  const openModal = () => {
    console.log('Opening modal with participants:', participants);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };
  

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14 bg-zinc-950">
        <Container>
          <div className="mb-12 text-center">
            <SectionHeading
              id="ride-itinerary"
              eyebrow="Ride Itineraries"
              title="Detailed Route Plans"
              description="Complete itineraries for our featured rides with timing, stops, and everything you need to know."
            />
          </div>
           {/* Detailed Itinerary View */}
           {selectedRide && <div>
              <button
                onClick={() => navigate('/')}
                className="mb-6 flex items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                ← Back to all rides
              </button>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Header */}
                  <div>
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl">
                      <img
                        src={selectedRide.imageUrl}
                        alt={selectedRide.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-6">
                      <h1 className="mb-2 text-3xl font-bold">{selectedRide.name}</h1>
                      <p className="mb-2 text-lg text-white/80">{selectedRide.location}</p>
                      {selectedRide.rideDate && (
                        <p className="mb-4 text-lg text-emerald-400 font-medium">
                          � {new Date(selectedRide.rideDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                      <p className="text-white/70">{selectedRide.description}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-white/60">Distance</div>
                      <div className="mt-1 text-xl font-semibold">{selectedRide.distanceKm} km</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-white/60">Elevation</div>
                      <div className="mt-1 text-xl font-semibold">{selectedRide.elevationM} m</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-white/60">Duration</div>
                      <div className="mt-1 text-xl font-semibold">{selectedRide.time}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-white/60">Difficulty</div>
                      <div className="mt-1 text-xl font-semibold">{selectedRide.difficulty}</div>
                    </div>
                  </div>

                  {/* Detailed Itinerary */}
                  <div>
                    <h2 className="mb-6 text-2xl font-semibold">Detailed Itinerary</h2>
                    <div className="space-y-4">
                      {selectedRide?.itinerary?.map((stop, index) => (
                        <div key={index} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                          <div className="flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-4">
                              <span className="font-semibold">{stop.time}</span>
                              <span className="text-sm text-white/60">
                                {stop.distance && stop.distance.toLowerCase().includes('km') ? stop?.distance?.toUpperCase() : `${stop.distance} KM`}
                              </span>
                            </div>
                            <h3 className="mb-1 font-medium">{stop.location}</h3>
                            <p className="text-sm text-white/70">{stop.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Meetup Info */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-4 text-lg font-semibold">Meetup Details</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-white/60">Location</div>
                        <div className="font-medium">{selectedRide.meetup}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60">Start Time</div>
                        <div className="font-medium">{selectedRide.itinerary?.[0]?.time}</div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-4 text-lg font-semibold">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedRide.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 text-emerald-400">•</span>
                          <span className="text-sm text-white/80">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  {selectedRide.exclusions && selectedRide.exclusions.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h3 className="mb-4 text-lg font-semibold">Exclusions</h3>
                      <ul className="space-y-2">
                        {selectedRide.exclusions.map((exclusion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm text-white/80">{exclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Highlights */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-4 text-lg font-semibold">Route Highlights</h3>
                    <ul className="space-y-2">
                      {selectedRide.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 text-emerald-400">•</span>
                          <span className="text-sm text-white/80">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="mb-4 text-lg font-semibold">Ride Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRide.tags.map((tag, index) => (
                        <span key={index} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trip Participants */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <button
                      onClick={openModal}
                      className="w-full text-left group"
                      type="button"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold group-hover:text-emerald-400 transition">
                          Trip Participants ({participants.length})
                        </h3>
                        <svg className="h-5 w-5 text-white/60 group-hover:text-emerald-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                      {participants.length > 0 ? (
                        <div className="flex -space-x-2">
                          {participants.slice(0, 4).map((participant, index) => (
                            <div key={participant.id} className="relative">
                              {participant.userImage ? (
                                <img
                                  src={participant.userImage}
                                  alt={participant.fullName}
                                  className="h-8 w-8 rounded-full object-cover border-2 border-zinc-900"
                                />
                              ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/80 to-sky-400/80 border-2 border-zinc-900">
                                  <span className="text-xs font-medium text-white">
                                    {participant.fullName?.charAt(0)?.toUpperCase() || 'R'}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          {participants.length > 4 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border-2 border-zinc-900 text-xs text-white/80">
                              +{participants.length - 4}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-white/60">
                          No participants yet. Be the first to join!
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </Container>
      </main>

      <Footer />
      
      {/* Participants Modal */}
      <ParticipantsModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        participants={participants} 
      />
    </div>
  );
}
