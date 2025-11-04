import React, { useState } from "react";
import { Megaphone, Send, AlertCircle, CheckCircle } from "lucide-react";
import "./Announcements.css";

const Announcements = () => {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.subject.trim() || !formData.body.trim()) {
      setNotification({
        type: "error",
        message: "Please fill in both subject and body fields.",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: Replace with your actual API call
      // const response = await sendAnnouncement(formData);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Sending announcement:", formData);

      // Success notification
      setNotification({
        type: "success",
        message: "Announcement sent successfully!",
      });

      // Reset form
      setFormData({
        subject: "",
        body: "",
      });

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error sending announcement:", error);
      setNotification({
        type: "error",
        message: "Failed to send announcement. Please try again.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="announcements-container">
      {/* Header */}
      <div className="announcements-header">
        <div className="header-content">
          <div className="header-icon">
            <Megaphone size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="announcements-title">Send Announcement</h1>
            <p className="announcements-subtitle">
              Broadcast messages to all users
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Form */}
      <div className="announcements-form-container">
        <form onSubmit={handleSubmit} className="announcements-form">
          {/* Subject Field */}
          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject <span className="required">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter announcement subject"
              className="form-input"
              disabled={isSubmitting}
            />
          </div>

          {/* Body Field */}
          <div className="form-group">
            <label htmlFor="body" className="form-label">
              Message <span className="required">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Enter your announcement message here..."
              className="form-textarea"
              disabled={isSubmitting}
            />
            <div className="character-count">
              {formData.body.length} characters
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Announcements;
