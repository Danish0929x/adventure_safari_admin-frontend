import React, { useState, useRef, useEffect } from "react";
import { Phone, UserCircle, LogOut, Menu, X, ChevronDown, Gauge, Settings, User, History, HelpCircle, FileText, BookAIcon, ListOrdered } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom'; // Add this import for React Router
import "./style.css";
import logo from "../../assets/logo/logo-main.webp";

// Mock logo component since we don't have the actual image
const LogoComponent = () => (
  <div className="logo-placeholder">
    <img src={logo} alt="Logo" className="logo-image" />
  </div>
);

function Navbar() {
  // Use React Router hooks for proper navigation
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;
  
  const isAuthPage = currentPage === "/login" || currentPage === "/register" || currentPage === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menu items that you can easily expand
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge, path: '/dashboard' },
    { id: 'users', label: 'Users', icon: User, path: '/dashboard/users' },
    { id: 'bookings', label: 'Bookings', icon: ListOrdered, path: '/dashboard/bookings' },
  ];

  const handleLogout = () => {
    // Remove from localStorage if needed
    // localStorage.removeItem("authToken");
    console.log("Logging out...");
    navigate("/login"); // Actually navigate to login page
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(prev => !prev);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleMenuItemClick = (path) => {
    console.log("Navigating to:", path);
    navigate(path); // Use navigate instead of setCurrentPage
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="brand-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogoComponent />
          </button>
        </div>

        {/* Desktop Navigation */}
        {!isAuthPage && (
          <div className="navbar-nav desktop-nav">
            {/* Menu Dropdown */}
            <div className="nav-dropdown" ref={dropdownRef}>
              <button 
                className="nav-dropdown-toggle"
                onClick={handleDropdownToggle}
                aria-expanded={dropdownOpen}
              >
                <Menu className="nav-icon" />
                <span>Menu</span>
                <ChevronDown className={`chevron ${dropdownOpen ? 'open' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentPage === item.path;
                    return (
                      <button
                        key={item.id}
                        className={`dropdown-item ${isActive ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick(item.path)}
                      >
                        <IconComponent className="dropdown-icon" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profile & Logout */}
            <div className="nav-actions">
              <button 
                className="nav-btn profile-btn" 
                onClick={handleProfileClick}
                title="Profile"
              >
                <UserCircle className="nav-icon" />
              </button>
              <button className="nav-btn logout-btn" onClick={handleLogout} title="Logout">
                <LogOut className="nav-icon" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        {!isAuthPage && (
          <button 
            className="mobile-menu-toggle"
            onClick={handleMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {!isAuthPage && mobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-content">
            {/* Mobile Menu Items */}
            <div className="mobile-menu-section">
              <h3 className="mobile-menu-title">Navigation</h3>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.path;
                return (
                  <button
                    key={item.id}
                    className={`mobile-menu-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick(item.path)}
                  >
                    <IconComponent className="mobile-menu-icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="mobile-menu-section">
              <h3 className="mobile-menu-title">Account</h3>
              <button 
                className="mobile-menu-item" 
                onClick={() => handleMenuItemClick('/profile')}
              >
                <UserCircle className="mobile-menu-icon" />
                <span>Profile</span>
              </button>
              <button className="mobile-menu-item logout" onClick={handleLogout}>
                <LogOut className="mobile-menu-icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;