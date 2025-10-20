function EmailInstruction() {
  return (
    <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-l-4 border-indigo-500 rounded-lg shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-indigo-900 mb-1">University Email Required</p>
        <p className="text-xs text-indigo-700 break-all">
          Please use your official email: <span className="font-semibold text-indigo-900">rollnumber@andhrauniversity.edu.in</span>
        </p>
      </div>
    </div>
  );
}

export default EmailInstruction;
