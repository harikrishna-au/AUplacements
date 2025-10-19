import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium';
  const activeBase = 'bg-gray-900 text-white';
  const inactiveBase = 'text-gray-300 hover:bg-gray-700 hover:text-white';

  return (
    <nav className="bg-gray-800 w-full">
      <div className="w-full px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left brand + desktop links */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {/* Hamburger icon */}
              <svg className={`h-6 w-6 ${mobileOpen ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg className={`h-6 w-6 ${mobileOpen ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="ml-2 flex items-center text-white font-semibold tracking-wide">
              AU Placements
            </div>

            {isAuthenticated && (
              <div className="hidden md:ml-6 md:flex md:space-x-2 ml-4">
                <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Dashboard</NavLink>
                <NavLink to="/companies" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Companies</NavLink>
                <NavLink to="/pipeline" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Pipeline</NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Calendar</NavLink>
                <NavLink to="/forum" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Forum</NavLink>
                <NavLink to="/resources" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Resources</NavLink>
                <NavLink to="/support" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Support</NavLink>
              </div>
            )}
          </div>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>{user?.name || 'Profile'}</NavLink>
                <button onClick={handleLogout} className={`${linkBase} ${inactiveBase}`}>Logout</button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Login</NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-700">
          <div className="space-y-1 px-3 pb-3 pt-2">
            {isAuthenticated ? (
              <>
                <NavLink onClick={() => setMobileOpen(false)} to="/dashboard" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Dashboard</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/companies" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Companies</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/pipeline" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Pipeline</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/calendar" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Calendar</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/forum" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Forum</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/resources" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Resources</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/support" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Support</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/profile" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Profile</NavLink>
                <button onClick={handleLogout} className={`${linkBase} block w-full text-left ${inactiveBase}`}>Logout</button>
              </>
            ) : (
              <NavLink onClick={() => setMobileOpen(false)} to="/login" className={({ isActive }) => `${linkBase} block ${isActive ? activeBase : inactiveBase}`}>Login</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;


