export default function ForumMessage({ message, formatTimestamp }) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
        {message.senderId?.fullName?.charAt(0) || '?'}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-gray-900">
            {message.senderId?.fullName || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500">
            {message.senderId?.universityRegisterNumber || 'N/A'}
          </span>
          <span className="text-xs text-gray-400">
            {formatTimestamp(message.createdAt)}
          </span>
        </div>
        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{message.message}</p>
      </div>
    </div>
  );
}
