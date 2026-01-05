import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';

export default function CreateItinerary() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRideId, setEditRideId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    distanceKm: '',
    elevationM: '',
    time: '',
    difficulty: 'Easy',
    type: 'Road',
    imageUrl: '',
    tags: [],
    description: '',
    meetup: '',
    requirements: [],
    highlights: []
  });

  const [itinerary, setItinerary] = useState([
    { time: '', location: '', activity: '', distance: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [availableRiders, setAvailableRiders] = useState([]);
  const [selectedRiders, setSelectedRiders] = useState([]);
  const [riderSearch, setRiderSearch] = useState('');

  useEffect(() => {
    // Check if we're in edit mode and have ride data
    if (location.state?.editMode && location.state?.rideData) {
      const rideData = location.state.rideData;
      setIsEditMode(true);
      setEditRideId(rideData.id);
      
      // Populate form with existing data
      setFormData({
        name: rideData.name || '',
        location: rideData.location || '',
        distanceKm: rideData.distanceKm?.toString() || '',
        elevationM: rideData.elevationM?.toString() || '',
        time: rideData.time || '',
        difficulty: rideData.difficulty || 'Easy',
        type: rideData.type || 'Road',
        imageUrl: rideData.imageUrl || '',
        tags: rideData.tags || [],
        description: rideData.description || '',
        meetup: rideData.meetup || '',
        requirements: rideData.requirements || [],
        highlights: rideData.highlights || []
      });
      
      // Set image preview if existing image URL
      if (rideData.imageUrl) {
        setImagePreview(rideData.imageUrl);
      }
      
      // Populate selected riders if they exist
      if (rideData.selectedRiders && rideData.selectedRiders.length > 0) {
        setSelectedRiders(rideData.selectedRiders);
      }
      
      // Populate itinerary if it exists
      if (rideData.itinerary && rideData.itinerary.length > 0) {
        setItinerary(rideData.itinerary);
      }
    }

    // Fetch available riders from Firebase
    const fetchRiders = async () => {
      try {
        const ridersSnapshot = await getDocs(collection(db, "user"));
        const ridersList = ridersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableRiders(ridersList);
      } catch (error) {
        console.error('Error fetching riders:', error);
      }
    };

    fetchRiders();
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }
      
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        // Store base64 in imageUrl field
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleRiderSelection = (riderId) => {
    setSelectedRiders(prev => {
      if (prev.includes(riderId)) {
        return prev.filter(id => id !== riderId);
      } else {
        return [...prev, riderId];
      }
    });
  };

  // Filter riders based on search
  const filteredRiders = availableRiders.filter(rider => 
    riderSearch === '' || 
    rider.fullName?.toLowerCase().includes(riderSearch.toLowerCase()) ||
    rider.riderName?.toLowerCase().includes(riderSearch.toLowerCase()) ||
    rider.bikeBrandModel?.toLowerCase().includes(riderSearch.toLowerCase())
  );

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[index][field] = value;
    setItinerary(newItinerary);
  };

  const addItineraryItem = () => {
    setItinerary([...itinerary, { time: '', location: '', activity: '', distance: '' }]);
  };

  const removeItineraryItem = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itineraryData = {
        ...formData,
        distanceKm: Number(formData.distanceKm),
        elevationM: Number(formData.elevationM),
        itinerary: itinerary.filter(item => item.time && item.location && item.activity),
        selectedRiders: selectedRiders,
        updatedAt: serverTimestamp()
      };

      if (isEditMode && editRideId) {
        // Update existing ride
        await updateDoc(doc(db, "featured_ride", editRideId), itineraryData);
        alert('Itinerary updated successfully!');
      } else {
        // Create new ride
        itineraryData.createdAt = serverTimestamp();
        await addDoc(collection(db, "featured_ride"), itineraryData);
        alert('Itinerary created successfully!');
      }
      
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Error saving itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
          <div className="mb-12 text-center">
            <SectionHeading
              id="create-itinerary"
              eyebrow={isEditMode ? "Edit Itinerary" : "Create Itinerary"}
              title={isEditMode ? "Update Your Ride" : "Design Your Perfect Ride"}
              description={isEditMode ? "Update your ride itinerary with new details and timing." : "Create detailed ride itineraries with timing, stops, and everything riders need to know."}
            />
          </div>

          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
            {/* Basic Information */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-6 text-xl font-semibold">Basic Information</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Ride Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="Sunrise Coastal Loop"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="ECR · Chennai"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    name="distanceKm"
                    value={formData.distanceKm}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="42"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Elevation (m) *
                  </label>
                  <input
                    type="number"
                    name="elevationM"
                    value={formData.elevationM}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="180"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="2h 10m"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Ride Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  >
                    <option value="Road">Road</option>
                    <option value="Hills">Hills</option>
                    <option value="Gravel">Gravel</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Cover Image
                  </label>
                  
                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Cover"
                          className="h-48 w-full rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 rounded-lg border border-white/10 bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Always show upload option */}
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition">
                      <svg className="mx-auto h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="mt-4">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition">
                            {imagePreview ? 'Change Image' : 'Choose Image'}
                          </span>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="mt-2 text-xs text-white/60">
                          PNG, JPG, GIF up to 5MB (Base64)
                        </p>
                        {imagePreview && (
                          <p className="mt-1 text-xs text-emerald-400">
                            Current image will be replaced
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Fallback URL input */}
                    <div className="text-center">
                      <p className="text-xs text-white/40 mb-2">Or enter image URL:</p>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-6 text-xl font-semibold">Description</h3>
              
              <label className="mb-2 block text-sm font-medium text-white/80">
                Ride Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="Perfect morning ride along East Coast Road with stunning ocean views and multiple breakfast stops."
              />
            </div>

            {/* Rider Selection */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-6 text-xl font-semibold">Select Riders</h3>
              
              <div className="mb-4">
                <p className="text-sm text-white/60 mb-2">Choose riders to participate in this itinerary. Selected riders will appear in the participants list when viewing the itinerary.</p>
                
                {/* Search Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={riderSearch}
                    onChange={(e) => setRiderSearch(e.target.value)}
                    placeholder="Search riders by name, username, or bike..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>
                
                {/* Riders Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRiders.map((rider) => (
                    <div key={rider.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                      <input
                        type="checkbox"
                        id={`rider-${rider.id}`}
                        checked={selectedRiders.includes(rider.id)}
                        onChange={() => handleRiderSelection(rider.id)}
                        className="h-4 w-4 rounded border-white/10 bg-emerald-500/20 text-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                      />
                      <label htmlFor={`rider-${rider.id}`} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium text-white">{rider.fullName || 'Unknown Rider'}</div>
                          <div className="text-xs text-white/60">@{rider.riderName || 'unknown'}</div>
                          <div className="text-xs text-white/40">{rider.bikeBrandModel || 'No bike info'}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {/* Search Results Info */}
                {riderSearch && filteredRiders.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-white/60">No riders found matching "{riderSearch}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-6 text-xl font-semibold">Tags</h3>
              
              <div className="mb-4 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-white/60 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="Add tag (e.g., Road, Cafe stop)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
                >
                  Add
                </button>
              </div>
            </div>
         

            {/* Itinerary */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Itinerary</h3>
                <button
                  type="button"
                  onClick={addItineraryItem}
                  className="rounded-xl border border-white/10 bg-emerald-500/20 px-4 py-2 text-emerald-400 transition hover:bg-emerald-500/30"
                >
                  + Add Stop
                </button>
              </div>

              <div className="space-y-4">
                {itinerary.map((item, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Time
                      </label>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => handleItineraryChange(index, 'time', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="6:00 AM"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Location
                      </label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => handleItineraryChange(index, 'location', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="Meetup Point"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Activity
                      </label>
                      <input
                        type="text"
                        value={item.activity}
                        onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="Gather and briefing"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Distance
                      </label>
                      <input
                        type="text"
                        value={item.distance}
                        onChange={(e) => handleItineraryChange(index, 'distance', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="0 km"
                      />
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryItem(index)}
                        className="md:col-span-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500/20"
                      >
                        Remove Stop
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-6 text-xl font-semibold">Requirements</h3>
              
              <div className="mb-4 flex flex-wrap gap-2">
                {formData.requirements.map((requirement, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                  >
                    {requirement}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-white/60 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="Add requirement (e.g., Helmet mandatory)"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
                >
                  Add
                </button>
              </div>
            </div>


            {/* Highlights */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-6 text-xl font-semibold">Highlights</h3>
              
              <div className="mb-4 flex flex-wrap gap-2">
                {formData.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                  >
                    {highlight}
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-white/60 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="Add highlight (e.g., Ocean sunrise views)"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
                >
                  Add
                </button>
              </div>
            </div>
 

            {/* Meetup Info */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-6 text-xl font-semibold">Meetup Information</h3>
              
              <label className="mb-2 block text-sm font-medium text-white/80">
                Meetup Point *
              </label>
              <input
                type="text"
                name="meetup"
                value={formData.meetup}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="Adyar Bridge, Chennai - 5:30 AM sharp"
              />
            </div>
        

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500 px-8 py-4 text-white font-semibold transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isEditMode ? 'Updating Itinerary...' : 'Creating Itinerary...') : (isEditMode ? 'Update Itinerary' : 'Create Itinerary')}
              </button>
            </div>
          </form>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
