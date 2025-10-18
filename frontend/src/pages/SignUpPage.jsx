import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUp, useUser } from '@clerk/clerk-react';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
            <span className="text-5xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AU Placements Portal
          </h1>
          <p className="text-gray-600">
            Andhra University - Student Placement System
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            📧 Use your university email: <strong>rollnumber@andhrauniversity.edu.in</strong>
          </div>
          <SignUp 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none',
              }
            }}
            signInUrl="/login"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>🔒 Secure authentication via Clerk</p>
          <p className="mt-2">Having trouble? Contact placement office</p>
        </div>
      </div>
    </div>
  );
}
