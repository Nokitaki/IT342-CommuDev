// src/pages/resources/ResourcesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ResourceHubItem from "../../components/resources/ResourceHubItem";
import UserCarousel from "../../components/newsfeed/UserCarousel";
import NotificationItem from "../../components/newsfeed/NotificationItem";
import Calendar from "../../components/common/Calendar";
import useAuth from "../../hooks/useAuth";
import "../../styles/pages/resources.css";

const ResourcesPage = () => {
  const { userData, profilePicture } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for resources
  const [resources, setResources] = useState([
    {
      resource_id: 1,
      resource_title: "Community Guidelines",
      resource_description: "Essential guidelines and rules for community participation and engagement. Includes best practices and code of conduct.",
      resource_category: "Document",
      heart_count: 45,
      upload_date: new Date("2024-03-20").toISOString(),
      creator: "John Doe",
      creator_id: 1,
      creator_profile_picture: null,
      fileSize: "2.5 MB",
      status: "Active"
    },
    {
      resource_id: 2,
      resource_title: "Municipal Development Plan",
      resource_description: "Comprehensive development plan for the municipality. This document outlines goals, strategies, and timelines for various community projects.",
      resource_category: "Document",
      heart_count: 32,
      upload_date: new Date("2024-03-15").toISOString(),
      creator: "Jane Smith",
      creator_id: 2,
      creator_profile_picture: null,
      fileSize: "3.8 MB",
      status: "Active"
    },
    {
      resource_id: 3,
      resource_title: "Barangay Meeting Schedule",
      resource_description: "Schedule of upcoming barangay meetings for the year. Important for community members to stay informed and engaged.",
      resource_category: "Document",
      heart_count: 28,
      upload_date: new Date("2024-03-10").toISOString(),
      creator: "John Doe",
      creator_id: 1,
      creator_profile_picture: null,
      fileSize: "1.2 MB",
      status: "Active"
    },
    {
      resource_id: 4,
      resource_title: "Community Training Videos",
      resource_description: "Collection of training videos for community development skills. Includes farming techniques, small business management, and more.",
      resource_category: "Media",
      heart_count: 67,
      upload_date: new Date("2024-03-05").toISOString(),
      creator: "Maria Rodriguez",
      creator_id: 3,
      creator_profile_picture: null,
      fileSize: "150 MB",
      status: "Active"
    },
    {
      resource_id: 5,
      resource_title: "Budget Allocation Report",
      resource_description: "Detailed report on budget allocation for community projects. Ensures transparency in how community funds are distributed.",
      resource_category: "Document",
      heart_count: 19,
      upload_date: new Date("2024-02-28").toISOString(),
      creator: "David Wilson",
      creator_id: 4,
      creator_profile_picture: null,
      fileSize: "4.7 MB",
      status: "Active"
    }
  ]);

  const [formData, setFormData] = useState({
    resource_title: "",
    resource_description: "",
    resource_category: "",
    heart_count: 0,
    upload_date: new Date().toISOString()
  });

  // Mock notifications
  const notifications = [
    {
      id: 1,
      user: "Keanu",
      image: "prof1.png",
      message: "downloaded your resource",
      time: "2 minutes ago",
    },
    {
      id: 2,
      user: "Ariana",
      image: "prof2.jpg",
      message: "shared your document",
      time: "5 minutes ago",
    },
    {
      id: 3,
      user: "Harry",
      image: "prof3.jpg",
      message: "liked your resource",
      time: "10 minutes ago",
    },
  ];

  const handleAddResource = (e) => {
    e.preventDefault();
    
    // Create new resource with mock data
    const newResource = {
      resource_id: Math.floor(Math.random() * 1000) + 6,
      ...formData,
      creator: userData ? `${userData.firstname} ${userData.lastname}` : 'Anonymous',
      creator_id: userData?.id || 1,
      creator_profile_picture: profilePicture,
      upload_date: new Date().toISOString(),
      status: "Active",
      fileSize: "2.5 MB"
    };
    
    setResources([newResource, ...resources]);
    setIsModalOpen(false);
    setFormData({
      resource_title: "",
      resource_description: "",
      resource_category: "",
      heart_count: 0,
      upload_date: new Date().toISOString()
    });
  };

  const handleUpdateResource = (resource_id) => {
    // Update the resource in our mock data
    setResources(resources.map(resource => 
      resource.resource_id === resource_id 
        ? {
            ...resource,
            resource_title: formData.resource_title,
            resource_description: formData.resource_description,
            resource_category: formData.resource_category,
            upload_date: new Date().toISOString()
          } 
        : resource
    ));
    
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const handleDeleteResource = (resource_id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setResources(resources.filter(resource => resource.resource_id !== resource_id));
    }
  };

  const handleLike = (resource_id) => {
    setResources(resources.map(resource => 
      resource.resource_id === resource_id 
        ? { ...resource, heart_count: resource.heart_count + 1 } 
        : resource
    ));
  };

  const filteredResources = resources.filter(resource => {
    if (selectedCategory === "all") {
      return true;
    } else if (selectedCategory === "documents") {
      return resource.resource_category === "Document";
    } else if (selectedCategory === "media") {
      return resource.resource_category === "Media";
    }
    return true;
  });

  // Right sidebar content for the layout
  const RightSidebar = (
    <div className="right-sidebar-content">
      <div className="calendar-section">
        <h2>Calendar</h2>
        <Calendar />
      </div>

      <div className="notifications-section">
        <h2>Notifications</h2>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification} 
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout rightSidebar={RightSidebar}>
      <div className="resources-content">
        <UserCarousel />
        
        <div className="resources-container">
          <div className="resources-header">
            <h2 className="resources-title">Resource Hub</h2>
            <button
              className="category-button active"
              onClick={() => {
                setEditingResource(null);
                setFormData({
                  resource_title: "",
                  resource_description: "",
                  resource_category: "",
                  heart_count: 0,
                  upload_date: new Date().toISOString(),
                });
                setIsModalOpen(true);
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Resource
            </button>
          </div>
          
          <div className="categories-container">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`category-button ${selectedCategory === "all" ? "active" : ""}`}
            >
              All Resources
            </button>
            <button
              onClick={() => setSelectedCategory("documents")}
              className={`category-button ${selectedCategory === "documents" ? "active" : ""}`}
            >
              Documents
            </button>
            <button
              onClick={() => setSelectedCategory("media")}
              className={`category-button ${selectedCategory === "media" ? "active" : ""}`}
            >
              Media
            </button>
          </div>

          <div className="resources-grid">
            {isLoading ? (
              <div className="loading-message">Loading resources...</div>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <ResourceHubItem
                  key={resource.resource_id}
                  resource={resource}
                  onDelete={handleDeleteResource}
                  onLike={handleLike}
                  onEdit={() => {
                    setEditingResource(resource);
                    setFormData({
                      resource_title: resource.resource_title,
                      resource_description: resource.resource_description,
                      resource_category: resource.resource_category,
                      heart_count: resource.heart_count,
                      upload_date: resource.upload_date
                    });
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="no-resources-message">No resources found</div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {editingResource ? "Edit Resource" : "Create New Resource"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingResource
                  ? handleUpdateResource(editingResource.resource_id)
                  : handleAddResource(e);
              }}
            >
              <input
                type="text"
                value={formData.resource_title}
                onChange={(e) =>
                  setFormData({ ...formData, resource_title: e.target.value })
                }
                placeholder="Resource Title"
                className="modal-input"
                required
              />
              <textarea
                value={formData.resource_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resource_description: e.target.value,
                  })
                }
                placeholder="Resource Description"
                className="modal-textarea"
                required
              />
              <select
                value={formData.resource_category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resource_category: e.target.value,
                  })
                }
                className="modal-select"
                required
              >
                <option value="">Select Category</option>
                <option value="Document">Document</option>
                <option value="Media">Media</option>
                <option value="Other">Other</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingResource ? "Save Changes" : "Create Resource"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingResource(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ResourcesPage;