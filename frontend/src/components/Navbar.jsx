import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef(null);

  const handleLogout = async () => {
    setMobileOpen(false); // Always close mobile menu on logout
    await logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium relative z-10 transition-colors duration-300 flex items-center';
  const activeBase = 'text-white';
  const inactiveBase = 'text-gray-700 hover:text-gray-900';

  useEffect(() => {
    // Only run on desktop (md breakpoint and above)
    const updateIndicator = () => {
      if (window.innerWidth < 768) return; // Skip on mobile
      if (!navRef.current || !isAuthenticated) return;
      
      // Don't show indicator on profile page
      if (location.pathname === '/profile') {
        setIndicatorStyle({});
        return;
      }
      
      const activeLink = navRef.current.querySelector('a[aria-current="page"]');
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [location.pathname, isAuthenticated]);

  return (
    <>
    <nav className="fixed top-0 md:top-4 left-0 md:left-1/2 md:-translate-x-1/2 z-50 w-full md:w-[95vw] md:max-w-7xl md:rounded-full bg-white border-b md:border border-gray-200 md:border-purple-200/50 shadow-lg md:shadow-2xl md:shadow-purple-500/10 overflow-x-hidden">
      <div className="w-full px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left brand + desktop links */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
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

            <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 md:ml-2 flex items-center text-gray-900 font-bold text-xl tracking-wide">
              AU Placements
            </div>

            {isAuthenticated && (
              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div ref={navRef} className="flex items-center space-x-1 relative">
                  {indicatorStyle.width > 0 && (
                    <div 
                      className="absolute top-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md transition-all duration-300 ease-out"
                      style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
                    />
                  )}
                  <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Dashboard</NavLink>
                  <NavLink to="/companies" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Companies</NavLink>
                  <NavLink to="/pipeline" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Pipeline</NavLink>
                  <NavLink to="/calendar" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Calendar</NavLink>
                  <NavLink to="/forum" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Forum</NavLink>
                  <NavLink to="/resources" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Resources</NavLink>
                  <NavLink to="/support" className={({ isActive }) => `${linkBase} ${isActive ? activeBase : inactiveBase}`}>Support</NavLink>
                </div>
              </div>
            )}
          </div>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? 'text-indigo-600' : inactiveBase}`}>{user?.name || 'Profile'}</NavLink>
                <button onClick={() => setShowLogoutModal(true)} className={`${linkBase} ${inactiveBase}`}>Logout</button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `${linkBase} ${isActive ? 'text-indigo-600' : inactiveBase}`}>Login</NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div onClick={() => setMobileOpen(false)} className={`fixed top-0 bottom-0 left-0 right-0 z-[60] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-screen pt-6 pb-6 px-6 gap-2 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <NavLink onClick={() => setMobileOpen(false)} to="/dashboard" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Dashboard</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/companies" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Companies</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/pipeline" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Pipeline</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/calendar" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Calendar</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/forum" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Forum</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/resources" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Resources</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/support" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Support</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/profile" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Profile</NavLink>
                <button onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }} className="w-full text-left py-3 px-4 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all mt-4">Logout</button>
              </>
            ) : (
              <NavLink onClick={() => setMobileOpen(false)} to="/login" className={({ isActive }) => `w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}>Login</NavLink>
            )}
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] md:hidden" onClick={() => setMobileOpen(false)} />
      )}

    </nav>
    <LogoutModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={handleLogout}
    />
    </>
  );
}

export default Navbar;


