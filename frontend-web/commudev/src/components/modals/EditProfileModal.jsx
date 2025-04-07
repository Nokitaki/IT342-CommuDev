// src/components/modals/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import '../../styles/components/editModal.css';

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  profileData
}) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    biography: '',
    dateOfBirth: '',
    country: '',
    employmentStatus: '',
    profileVisibility: ''
  });

  // Update form when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstname: profileData.firstname || '',
        lastname: profileData.lastname || '',
        biography: profileData.biography || '',
        dateOfBirth: profileData.dateOfBirth || '',
        country: profileData.country || '',
        employmentStatus: profileData.employmentStatus || '',
        profileVisibility: profileData.profileVisibility || 'PUBLIC'
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // Country options based on your Country.java enum
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CN', label: 'China' },
    { value: 'IN', label: 'India' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'BD', label: 'Bangladesh' },
    { value: 'RU', label: 'Russia' },
    { value: 'MX', label: 'Mexico' },
    { value: 'JP', label: 'Japan' },
    { value: 'PH', label: 'Philippines' },
    { value: 'EG', label: 'Egypt' },
    { value: 'VN', label: 'Vietnam' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Employment status options based on your EmploymentStatus.java enum
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

  // Profile visibility options based on your ProfileVisibility.java enum
  const visibilityOptions = [
    { value: 'PUBLIC', label: 'Public' },
    { value: 'FRIENDS', label: 'Friends Only' },
    { value: 'PRIVATE', label: 'Private' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="modal-input"
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
              className="modal-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="biography">Biography</label>
            <textarea
              id="biography"
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              className="modal-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="modal-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="modal-select"
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
              className="modal-select"
            >
              <option value="">Select Employment Status</option>
              {employmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profileVisibility">Profile Visibility</label>
            <select
              id="profileVisibility"
              name="profileVisibility"
              value={formData.profileVisibility}
              onChange={handleChange}
              className="modal-select"
            >
              {visibilityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;