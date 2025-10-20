
import { useAuth } from '../context/AuthContext';

function AppLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && !loading && <Navbar />}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;


