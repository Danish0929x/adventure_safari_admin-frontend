import './App.css';
import Navbar from './components/navbar/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          {/* Add the email verification route */}
        </Routes>
        
        <Toaster
          position="top-center"
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            // Success/error icons and styles
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: 'red',
                secondary: 'black',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;