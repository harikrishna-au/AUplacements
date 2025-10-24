import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import NoticeBoard from './NoticeBoard';

function AppLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && !loading && <Navbar />}
      <main className="w-full">
        {children}
      </main>
      {isAuthenticated && !loading && <NoticeBoard />}
    </div>
  );
}

export default AppLayout;


