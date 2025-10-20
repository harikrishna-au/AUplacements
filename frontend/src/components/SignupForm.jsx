import { SignUp } from '@clerk/clerk-react';

export default function SignupForm() {
  return (
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Account</h2>
          <p className="text-gray-600">Join the AU Placements portal today</p>
        </div>

        <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900 flex items-center gap-2">
            <span className="text-lg">📧</span>
            <span>Use: <strong>rollnumber@andhrauniversity.edu.in</strong></span>
          </p>
        </div>

        <SignUp 
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
          signInUrl="/login"
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
          Need help? <span className="text-indigo-600 font-medium">placements@andhrauniversity.edu.in</span>
        </p>
      </div>
    </div>
  );
}
