import { SignIn } from '@clerk/clerk-react';
import EmailInstruction from './EmailInstruction';

export default function LoginForm() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl mb-4 sm:mb-5">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/c/c7/Andhra_University_logo.png" 
            alt="Andhra University" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          AUPlacements
        </h1>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 p-6 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Welcome Back</h2>
          <p className="text-sm sm:text-base text-gray-600">Sign in to access your placement dashboard</p>
        </div>

        <EmailInstruction />

        <div className="w-full overflow-hidden">
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'w-full max-w-full',
                card: 'shadow-none border-0 p-0 bg-transparent w-full max-w-full',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-gray-50 text-gray-700 transition-all',
              socialButtonsBlockButtonText: 'font-semibold',
              dividerLine: 'bg-gray-200',
              dividerText: 'text-gray-500',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-xs sm:text-sm w-full text-center flex items-center justify-center',
              formFieldInput: 'border-2 border-gray-200 focus:border-indigo-500 rounded-lg px-3 py-2 transition-all bg-transparent text-sm sm:text-base w-full',
              formFieldLabel: 'text-gray-700 font-medium text-sm sm:text-base w-full',
              formFieldRow: 'w-full',
              form: 'w-full',
              footerActionLink: 'text-indigo-600 hover:text-indigo-700 font-semibold text-sm sm:text-base text-center',
              footerAction: 'w-full text-center flex justify-center items-center',
              footer: 'w-full text-center',
              footerActionText: 'text-gray-600 text-sm sm:text-base text-center',
              identityPreviewText: 'text-gray-700',
              identityPreviewEditButton: 'text-indigo-600 hover:text-indigo-700',
            },
            layout: {
              showOptionalFields: false,
            }
          }}
            signUpUrl="/signup"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>

      <div className="text-center mt-6 sm:mt-8 px-2">
        <p className="text-gray-500 text-xs break-all">
          Need help? <span className="text-blue-600 font-medium">placements@andhrauniversity.edu.in</span>
        </p>
      </div>
    </div>
  );
}
