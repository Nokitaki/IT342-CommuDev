// src/components/profile/ProfileEditor.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/components/profileEditor.css';

const ProfileEditor = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dateOfBirth: '',
    age: '',
    country: '',
    employmentStatus: '',
    biography: '',
    profileVisibility: 'PUBLIC'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Country options - matches your Country enum
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CN', label: 'China' },
    { value: 'IN', label: 'India' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'NG', label: 'Nigeria' },
    // Add more countries as needed
  ];

  // Employment status options - matches your EmploymentStatus enum
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

  // Privacy options
  const privacyOptions = [
    { value: 'PUBLIC', label: 'Public - Anyone can see your profile' },
    { value: 'FRIENDS', label: 'Friends - Only friends can see your profile' },
    { value: 'PRIVATE', label: 'Private - Only you can see your profile' }
  ];

  return (
    <div className="profile-editor">
      <h2>Edit Profile</h2>
      
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
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country || ''}
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
              value={formData.employmentStatus || ''}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
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
            value={formData.biography || ''}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="profileVisibility">Profile Visibility</label>
          <select
            id="profileVisibility"
            name="profileVisibility"
            value={formData.profileVisibility || 'PUBLIC'}
            onChange={handleChange}
          >
            {privacyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-save">Save Changes</button>
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;