import React, { useState } from 'react';
import Button from './Button';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    riderName: '',
    dateOfBirth: '',
    bloodGroup: '',
    mobileNumber: '',
    email: '',
    instagramId: '',
    userImage: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactNumber: '',
    
    // Bike Details
    bikeBrandModel: '',
    engineCC: '',
    registrationNumber: '',
    bikeType: '',
    modifications: '',
    hasModifications: '',
    
    // License & Documents
    licenseNumber: '',
    licenseExpiry: '',
    insuranceValidTill: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          userImage: reader.result // This will be base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const checkExistingUser = async (email, instagramId, mobileNumber) => {
    try {
      // Check for existing email
      const emailQuery = query(
        collection(db, "user"),
        where("email", "==", email.toLowerCase())
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        return {
          exists: true,
          field: 'email',
          message: 'An account with this email already exists!'
        };
      }

      // Check for existing Instagram ID
      const instagramQuery = query(
        collection(db, "user"),
        where("instagramId", "==", instagramId.toLowerCase())
      );
      const instagramSnapshot = await getDocs(instagramQuery);
      
      if (!instagramSnapshot.empty) {
        return {
          exists: true,
          field: 'instagramId',
          message: 'An account with this Instagram ID already exists!'
        };
      }

      // Check for existing mobile number
      const mobileQuery = query(
        collection(db, "user"),
        where("mobileNumber", "==", mobileNumber)
      );
      const mobileSnapshot = await getDocs(mobileQuery);
      
      if (!mobileSnapshot.empty) {
        return {
          exists: true,
          field: 'mobileNumber',
          message: 'An account with this mobile number already exists!'
        };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error checking existing user:', error);
      return { exists: false }; // Allow registration if check fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check for existing email, Instagram ID, and mobile number
      const validation = await checkExistingUser(formData.email, formData.instagramId, formData.mobileNumber);
      
      if (validation.exists) {
        alert(validation.message);
        setIsSubmitting(false);
        return;
      }

      // Save registration data to Firebase Firestore
      const docRef = await addDoc(collection(db, "user"), {
        ...formData,
        email: formData.email.toLowerCase(), // Store email in lowercase
        instagramId: formData.instagramId.toLowerCase(), // Store Instagram ID in lowercase
        createdAt: serverTimestamp(),
        status: "registered"
      });
      
      console.log("Document written with ID: ", docRef.id);
      
      // Clear form after successful submission
      setFormData({
        fullName: '',
        riderName: '',
        dateOfBirth: '',
        bloodGroup: '',
        mobileNumber: '',
        email: '',
        instagramId: '',
        userImage: '',
        bikeBrandModel: '',
        engineCC: '',
        registrationNumber: '',
        bikeType: '',
        modifications: '',
        hasModifications: '',
        licenseNumber: '',
        licenseExpiry: '',
        insuranceValidTill: ''
      });
      
      alert('Registration submitted successfully! Your ID: ' + docRef.id);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again. Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
      <h2 className="mb-8 text-2xl font-semibold">Rider Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Section */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-white/90">Personal Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/70">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                {formData.userImage ? (
                  <div className="h-20 w-20 overflow-hidden rounded-full">
                    <img
                      src={formData.userImage}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5">
                    <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white/70 hover:file:bg-white/20"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Max size: 5MB, JPG/PNG/WebP
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Nickname / Rider Name
              </label>
              <input
                type="text"
                name="riderName"
                value={formData.riderName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="Your rider name (optional)"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Blood Group 🩸 *
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Mobile Number (WhatsApp) *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="10-digit mobile number"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Email ID *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Instagram ID *
              </label>
              <input
                type="text"
                name="instagramId"
                value={formData.instagramId}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="@yourusername"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-white/90">🆘 Emergency Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Emergency Contact Name *
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="Enter emergency contact name"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Emergency Contact Number *
              </label>
              <input
                type="tel"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>
        </div>

        {/* Bike Details Section */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-white/90">🏍️ Bike Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Bike Brand & Model *
              </label>
              <input
                type="text"
                name="bikeBrandModel"
                value={formData.bikeBrandModel}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="e.g., Royal Enfield Himalayan"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Engine CC *
              </label>
              <input
                type="number"
                name="engineCC"
                value={formData.engineCC}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="e.g., 411"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Registration Number *
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="e.g., KL-01-AB-1234"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Bike Type *
              </label>
              <select
                name="bikeType"
                value={formData.bikeType}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              >
                <option value="">Select bike type</option>
                <option value="Street">Street</option>
                <option value="ADV">ADV</option>
                <option value="Cruiser">Cruiser</option>
                <option value="Off-road">Off-road</option>
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Any Modifications *
              </label>
              <select
                name="hasModifications"
                value={formData.hasModifications}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            
            {formData.hasModifications === 'Yes' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Describe Modifications
                </label>
                <input
                  type="text"
                  name="modifications"
                  value={formData.modifications}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="e.g., Exhaust, Suspension, etc."
                />
              </div>
            )}
          </div>
        </div>

        {/* License & Documents Section */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-white/90">🪪 License & Documents</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Driving License Number *
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="License number"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                License Expiry Date *
              </label>
              <input
                type="date"
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Bike Insurance Valid Till *
              </label>
              <input
                type="date"
                name="insuranceValidTill"
                value={formData.insuranceValidTill}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => setFormData({})}>
            Clear Form
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Submitting...' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
  );
}
