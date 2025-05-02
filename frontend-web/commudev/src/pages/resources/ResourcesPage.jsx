// src/pages/resources/ResourcesPage.jsx
import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import ResourceHubItem from "../../components/resources/ResourceHubItem";
import UserCarousel from "../../components/newsfeed/UserCarousel";
import NotificationItem from "../../components/newsfeed/NotificationItem";
import Calendar from "../../components/common/Calendar";
import useResourcehub from "../../hooks/useResourcehub";
import useProfile from "../../hooks/useProfile";
import "../../styles/pages/resources.css";

const ResourcesPage = () => {
  const { profile } = useProfile();
  const { 
    resources, 
    loading, 
    error, 
    success, 
    fetchResources,
    fetchResourcesByCategory,
    createResource,
    updateResource,
    deleteResource,
    likeResource,
    setError
  } = useResourcehub();
  
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Form data for create/edit
  const [formData, setFormData] = useState({
    resourceTitle: "",
    resourceDescription: "",
    resourceCategory: "",
  });

  // Handle category change
  useEffect(() => {
    if (selectedCategory === "all") {
      fetchResources();
    } else {
      fetchResourcesByCategory(selectedCategory === "documents" ? "Document" : "Media");
    }
  }, [selectedCategory, fetchResources, fetchResourcesByCategory]);

  // Handle adding a new resource
  const handleAddResource = async (e) => {
    e.preventDefault();
    
    const result = await createResource({
      ...formData,
      creator: profile?.username
    });
    
    if (result) {
      // Reset form and close modal
      setFormData({
        resourceTitle: "",
        resourceDescription: "",
        resourceCategory: "",
      });
      setIsModalOpen(false);
    }
  };

  // Handle updating an existing resource
  const handleUpdateResource = async (resourceId) => {
    const result = await updateResource(resourceId, formData);
    
    if (result) {
      // Reset form and close modal
      setIsModalOpen(false);
      setEditingResource(null);
    }
  };

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
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem 
                key={notification.id}
                notification={notification} 
              />
            ))
          ) : (
            <div className="no-notifications">No new notifications</div>
          )}
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
                  resourceTitle: "",
                  resourceDescription: "",
                  resourceCategory: "",
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

          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchResources} className="retry-button">
                Retry
              </button>
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="resources-grid">
            {loading ? (
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Loading resources...</p>
              </div>
            ) : resources.length > 0 ? (
              resources.map((resource) => (
                <ResourceHubItem
                  key={resource.resourceId}
                  resource={resource}
                  onDelete={deleteResource}
                  onLike={likeResource}
                  onEdit={() => {
                    setEditingResource(resource);
                    setFormData({
                      resourceTitle: resource.resourceTitle,
                      resourceDescription: resource.resourceDescription,
                      resourceCategory: resource.resourceCategory,
                    });
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="no-resources-message">
                <div className="empty-state-icon">📚</div>
                <p>No resources found</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setFormData({
                      resourceTitle: "",
                      resourceDescription: "",
                      resourceCategory: "",
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Create your first resource
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Resource Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">
              {editingResource ? "Edit Resource" : "Create New Resource"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingResource
                  ? handleUpdateResource(editingResource.resourceId)
                  : handleAddResource(e);
              }}
            >
              <input
                type="text"
                value={formData.resourceTitle}
                onChange={(e) =>
                  setFormData({ ...formData, resourceTitle: e.target.value })
                }
                placeholder="Resource Title"
                className="modal-input"
                required
              />
              <textarea
                value={formData.resourceDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resourceDescription: e.target.value,
                  })
                }
                placeholder="Resource Description"
                className="modal-textarea"
                required
              />
              <select
                value={formData.resourceCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resourceCategory: e.target.value,
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
                <button type="submit" className="btn btn-primary">
                  {editingResource ? "Save Changes" : "Create Resource"}
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