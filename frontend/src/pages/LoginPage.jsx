import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, useUser } from '@clerk/clerk-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Branding */}
  <div className="hidden lg:flex flex-col justify-center items-center p-16 bg-gradient-to-br from-indigo-600 to-purple-600">
          <div className="max-w-lg text-white">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-10">
              <span className="text-6xl">🎓</span>
            </div>
            <h1 className="text-5xl font-bold mb-8">AU Placements Portal</h1>
            <p className="text-xl text-indigo-100 mb-10">
              Your gateway to career opportunities at Andhra University
            </p>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
                <span className="text-lg">Track your applications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
                <span className="text-lg">Connect with recruiters</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
                <span className="text-lg">Access resources & forums</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl mb-5">
                <span className="text-3xl">🎓</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AU Placements
              </h1>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
                <p className="text-gray-600">Sign in to access your placement dashboard</p>
              </div>

              <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900 flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  <span>Use: <strong>rollnumber@andhrauniversity.edu.in</strong></span>
                </p>
              </div>

              <SignIn 
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-0 p-0 bg-transparent',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-gray-50 text-gray-700 transition-all',
                    socialButtonsBlockButtonText: 'font-semibold',
                    dividerLine: 'bg-gray-200',
                    dividerText: 'text-gray-500',
                    formButtonPrimary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl',
                    formFieldInput: 'border-2 border-gray-200 focus:border-indigo-500 rounded-lg px-3 py-2 transition-all bg-transparent',
                    formFieldLabel: 'text-gray-700 font-medium',
                    footerActionLink: 'text-indigo-600 hover:text-indigo-700 font-semibold',
                    identityPreviewText: 'text-gray-700',
                    identityPreviewEditButton: 'text-indigo-600 hover:text-indigo-700',
                  }
                }}
                signUpUrl="/signup"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
              />
            </div>

            <div className="text-center mt-8 space-y-3">
              <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                <span className="text-green-500">🔒</span>
                Secured by Clerk Authentication
              </p>
              <p className="text-gray-500 text-xs">
                Need help? <span className="text-indigo-600 font-medium">placements@andhrau niversity.edu.in</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
