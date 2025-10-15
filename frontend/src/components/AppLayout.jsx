import Navbar from './Navbar';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full max-w-none px-3 sm:px-4 lg:px-8 py-4">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;


