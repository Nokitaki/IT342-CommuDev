// src/components/profile/ProfileEditor.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import useProfile from '../../hooks/useProfile';
import '../../styles/components/profileEditor.css';

const ProfileEditor = ({ profile, onCancel, onSuccess }) => {
  const { updateProfile, loading, error, success } = useProfile();
  
  // Initialize form state with current profile data
  const [formData, setFormData] = useState({
    firstname: profile?.firstname || '',
    lastname: profile?.lastname || '',
    dateOfBirth: profile?.dateOfBirth || '',
    age: profile?.age || '',
    country: profile?.country || '',
    employmentStatus: profile?.employmentStatus || '',
    biography: profile?.biography || '',
    profileVisibility: profile?.profileVisibility || 'PUBLIC'
  });
  
  // Available options for dropdowns
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CN', label: 'China' },
    { value: 'IN', label: 'India' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'RU', label: 'Russia' },
    { value: 'JP', label: 'Japan' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  const employmentOptions = [
    { value: 'EMPLOYED_FULL_TIME', label: 'Employed Full-Time' },
    { value: 'EMPLOYED_PART_TIME', label: 'Employed Part-Time' },
    { value: 'SELF_EMPLOYED', label: 'Self-Employed' },
    { value: 'UNEMPLOYED', label: 'Unemployed' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'RETIRED', label: 'Retired' },
    { value: 'HOMEMAKER', label: 'Homemaker' },
    { value: 'UNABLE_TO_WORK', label: 'Unable to Work' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer Not to Say' }
  ];
  
  const visibilityOptions = [
    { value: 'PUBLIC', label: 'Public - Anyone can view your profile' },
    { value: 'FRIENDS', label: 'Friends Only - Only friends can view your profile' },
    { value: 'PRIVATE', label: 'Private - Only you can view your profile' }
  ];
  
  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstname: profile.firstname || '',
        lastname: profile.lastname || '',
        dateOfBirth: profile.dateOfBirth || '',
        age: profile.age || '',
        country: profile.country || '',
        employmentStatus: profile.employmentStatus || '',
        biography: profile.biography || '',
        profileVisibility: profile.profileVisibility || 'PUBLIC'
      });
    }
  }, [profile]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for age field to ensure it's a number
    if (name === 'age') {
      const numValue = value === '' ? '' : parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send update request
      const updatedProfile = await updateProfile(formData);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(updatedProfile);
      }
    } catch (err) {
      // Error is handled by the useProfile hook
      console.error('Error updating profile:', err);
    }
  };
  
  return (
    <div className="profile-editor">
      <h2>Edit Profile</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              min="0"
              max="120"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              {countryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="employmentStatus">Employment Status</label>
            <select
              id="employmentStatus"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
            >
              <option value="">Select Employment Status</option>
              {employmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="biography">Biography</label>
          <textarea
            id="biography"
            name="biography"
            rows="4"
            value={formData.biography}
            onChange={handleChange}
            placeholder="Tell others about yourself..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="profileVisibility">Profile Visibility</label>
          <select
            id="profileVisibility"
            name="profileVisibility"
            value={formData.profileVisibility}
            onChange={handleChange}
          >
            {visibilityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;