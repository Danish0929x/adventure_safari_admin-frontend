import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./style.css";
import Loader from "../../components/loader/Loader";
import { loginUser } from "../../services/auth";

function Login() {
  const [formData, setFormData] = useState({
    email: "adventuresafari@gmail.com",
    password: "Adventure@123"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();

  // Check if page assets are loaded
  useEffect(() => {
    const handleLoad = () => setIsPageLoading(false);
    
    if (document.readyState === 'complete') {
      setIsPageLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Use your existing auth service
      const data = await loginUser(formData);

      // Store the admin token in localStorage
      localStorage.setItem("adminToken", data.token);
      
      // Optional: Store token expiry if provided by backend
      if (data.expiresIn) {
        const expiryDate = new Date(Date.now() + data.expiresIn * 1000);
        localStorage.setItem("adminTokenExpiry", expiryDate.toString());
      }

      // Optional: Store user data if needed
      if (data.user) {
        localStorage.setItem("adminUser", JSON.stringify(data.user));
      }

      toast.success("Login successful!");
      navigate("/dashboard");

    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isPageLoading && <Loader />}
      
      <div className={`login-container ${isPageLoading ? 'content-loading' : ''}`}>
        <div className="login-inner max-width">
          <div className="login-form">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="email">
                  <FaEnvelope />
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your e-mail"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="password">
                  <FaLock />
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                />
              </div>
              <div className="login-btn-group">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={isLoading ? "login-loading" : ""}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="login-spin" /> Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;