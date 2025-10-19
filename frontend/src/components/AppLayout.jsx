import Navbar from './Navbar';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;


