import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/feed" replace />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ROLE_USER', 'ROLE_MANAGER', 'ROLE_ADMIN']} />}>
              <Route path="/feed" element={<Feed />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ROLE_MANAGER', 'ROLE_ADMIN']} />}>
              <Route path="/analytics" element={<Analytics />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ROLE_ADMIN']} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
