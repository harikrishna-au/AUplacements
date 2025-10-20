import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { useLocation, Navigate } from 'react-router-dom';

export default function AuthPage() {
  const location = useLocation();

  const isLogin = location.pathname.includes('login');
  const isSignup = location.pathname.includes('signup');

  if (!isLogin && !isSignup) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col lg:flex-row items-stretch overflow-x-hidden">
      {/* Left column: Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center items-center lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 lg:p-12 xl:p-16">
        <div className="max-w-lg text-white">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 lg:mb-10">
            <span className="text-5xl lg:text-6xl">🎓</span>
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 lg:mb-8">AU Placements Portal</h1>
          <p className="text-lg lg:text-xl text-indigo-100 mb-8 lg:mb-10">
            Your gateway to career opportunities at Andhra University
          </p>
          <div className="space-y-4 lg:space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">✓</div>
              <span className="text-base lg:text-lg">Track your applications</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">✓</div>
              <span className="text-base lg:text-lg">Connect with recruiters</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">✓</div>
              <span className="text-base lg:text-lg">Access resources & forums</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right column: Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
        {isLogin && <LoginForm />}
        {isSignup && <SignupForm />}
      </div>
    </div>
  );
}