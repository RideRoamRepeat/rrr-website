import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistrationForm({ editMode = false, initialData = null }) {
  const navigate = useNavigate();
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
    modifications: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Populate form with initial data if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        riderName: initialData.riderName || '',
        dateOfBirth: initialData.dateOfBirth || '',
        bloodGroup: initialData.bloodGroup || '',
        mobileNumber: initialData.mobileNumber || '',
        email: initialData.email || '',
        instagramId: initialData.instagramId || '',
        userImage: initialData.userImage || '',
        emergencyContactName: initialData.emergencyContactName || '',
        emergencyContactNumber: initialData.emergencyContactNumber || '',
        bikeBrandModel: initialData.bikeBrandModel || '',
        engineCC: initialData.engineCC || '',
        registrationNumber: initialData.registrationNumber || '',
        bikeType: initialData.bikeType || '',
        modifications: initialData.modifications || ''
      });
    }
  }, [editMode, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setIsUploadingImage(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions to reduce file size
          let width = img.width;
          let height = img.height;
          const maxSize = 800; // Max dimension for resizing
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try different quality levels to get under 500KB
          let quality = 0.8;
          let base64Image = canvas.toDataURL('image/jpeg', quality);
          
          // Reduce quality if still too large
          while (base64Image.length > 500 * 1024 && quality > 0.1) {
            quality -= 0.1;
            base64Image = canvas.toDataURL('image/jpeg', quality);
          }
          
          // If still too large, resize further
          if (base64Image.length > 500 * 1024) {
            const smallerSize = 400;
            canvas.width = smallerSize;
            canvas.height = smallerSize;
            ctx.drawImage(img, 0, 0, smallerSize, smallerSize);
            base64Image = canvas.toDataURL('image/jpeg', 0.5);
          }
          
          setFormData(prev => ({
            ...prev,
            userImage: base64Image
          }));
          setIsUploadingImage(false);
          
          // Show file size info
          const fileSizeKB = Math.round(base64Image.length / 1024);
          console.log(`Image compressed to ${fileSizeKB}KB`);
        };
        img.src = event.target.result;
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
    
    // Validate required fields
    const requiredFields = {
      fullName: 'Full Name',
      riderName: 'Rider Name', 
      dateOfBirth: 'Date of Birth',
      bloodGroup: 'Blood Group',
      mobileNumber: 'Mobile Number',
      email: 'Email',
      instagramId: 'Instagram ID',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactNumber: 'Emergency Contact Number',
      bikeBrandModel: 'Bike Brand & Model',
      engineCC: 'Engine CC',
      registrationNumber: 'Registration Number',
      bikeType: 'Bike Type'
    };

    // Check for empty required fields
    const emptyFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === '') {
        emptyFields.push(label);
      }
    }

    if (emptyFields.length > 0) {
      alert(`Please fill in all required fields:\n${emptyFields.join('\n')}`);
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number');
      setIsSubmitting(false);
      return;
    }

    // Validate emergency contact number (10 digits)
    if (!mobileRegex.test(formData.emergencyContactNumber)) {
      alert('Please enter a valid 10-digit emergency contact number');
      setIsSubmitting(false);
      return;
    }

    // Validate Instagram ID (content exists, not format)
    if (!formData.instagramId || formData.instagramId.trim() === '') {
      alert('Please enter Instagram ID');
      setIsSubmitting(false);
      return;
    }

    // Validate engine CC (numeric)
    if (isNaN(formData.engineCC) || formData.engineCC <= 0) {
      alert('Engine CC must be a positive number');
      setIsSubmitting(false);
      return;
    }

    // Validate bike type
    const validBikeTypes = ['Cruiser', 'Sports', 'Tourer', 'Adventure', 'Commuter', 'Off-road', 'Street', 'Other'];
    if (!validBikeTypes.includes(formData.bikeType)) {
      alert('Please select a valid bike type');
      setIsSubmitting(false);
      return;
    }

    // Validate blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(formData.bloodGroup)) {
      alert('Please select a valid blood group');
      setIsSubmitting(false);
      return;
    }
    
    try {
      if (editMode) {
        // Update existing user
        await updateDoc(doc(db, "user", initialData.id), {
          ...formData,
          email: formData.email.toLowerCase(),
          instagramId: formData.instagramId.toLowerCase(),
          updatedAt: serverTimestamp()
        });
        
        console.log("User updated with ID: ", initialData.id);
        alert('User profile updated successfully!');
        navigate('/user-profile');
      } else {
        // Check for existing email, Instagram ID, and mobile number for new registration
        const validation = await checkExistingUser(formData.email, formData.instagramId, formData.mobileNumber);
        
        if (validation.exists) {
          alert(validation.message);
          setIsSubmitting(false);
          return;
        }

        // Save registration data to Firebase Firestore
        // Generate dummy password
        const dummyPassword = formData.riderName.toLowerCase().replace(/\s+/g, '') + Math.floor(1000 + Math.random() * 9000);
        
        const docRef = await addDoc(collection(db, "user"), {
          ...formData,
          email: formData.email.toLowerCase(), // Store email in lowercase
          instagramId: formData.instagramId.toLowerCase(), // Store Instagram ID in lowercase
          password: dummyPassword, // Add dummy password
          isSuperAdmin: false, // Set isSuperAdmin to false
          createdAt: serverTimestamp(),
          status: "pending" 
        });
        
        console.log("Document written with ID: ", docRef.id);
        alert('Registration submitted successfully! Your ID: ' + docRef.id + '\n\nYour temporary password: ' + dummyPassword + '\n\nYour account is pending approval by admin. You will be able to access the website once approved.');
      }
      
      // Clear form after successful submission (only for new registration)
      if (!editMode) {
        setFormData({
          fullName: '',
          riderName: '',
          dateOfBirth: '',
          bloodGroup: '',
          mobileNumber: '',
          email: '',
          instagramId: '',
          userImage: '',
          emergencyContactName: '',
          emergencyContactNumber: '',
          bikeBrandModel: '',
          engineCC: '',
          registrationNumber: '',
          bikeType: '',
          modifications: ''
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(editMode ? 'Update failed. Please try again.' : 'Registration failed. Please try again. Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
      <h2 className="mb-8 text-2xl font-semibold">
        {editMode ? 'Edit Rider Profile' : 'Rider Registration'}
      </h2>
      
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
                {isUploadingImage ? (
                  <div className="h-20 w-20 flex items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5">
                    <div className="animate-spin h-6 w-6 border-2 border-white/30 border-t-white rounded-full"></div>
                  </div>
                ) : formData.userImage ? (
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
                    disabled={isUploadingImage}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white/70 hover:file:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Will be resized to under 500KB, JPG/PNG/WebP
                  </p>
                  {isUploadingImage && (
                    <p className="mt-1 text-xs text-emerald-400">
                      Processing and compressing image...
                    </p>
                  )}
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
                <option value="Sports">Sports</option>
                <option value="Tourer">Tourer</option>
                <option value="Adventure">Adventure</option>
                <option value="Commuter">Commuter</option>
                <option value="Cruiser">Cruiser</option>
                <option value="Off-road">Off-road</option>
                 <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Modifications (Optional)
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
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => setFormData({})}>
            Clear Form
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (editMode ? 'Updating...' : 'Submitting...') : (editMode ? 'Update Profile' : 'Register')}
          </Button>
        </div>
      </form>
    </div>
  );
}
