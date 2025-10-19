export default function QuickActionCard({ icon: Icon, title, description, onClick, bgColor = "bg-indigo-100", iconColor = "text-indigo-600" }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 transform duration-200"
    >
      <div className="flex items-center mb-4">
        <div className={`${bgColor} p-3 rounded-full mr-4`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
