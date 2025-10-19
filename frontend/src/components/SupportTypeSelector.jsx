import { Card } from "@/components/ui/card";

export default function SupportTypeSelector({ supportTypes, selectedType, onTypeSelect }) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {supportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
              selectedType === type.id
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <div className={`${selectedType === type.id ? 'text-white' : type.color.replace('bg-', 'text-')}`}>
              {type.icon}
            </div>
            <p className="font-semibold text-sm text-center">{type.name}</p>
            <p className={`text-xs text-center ${selectedType === type.id ? 'text-white/80' : 'text-gray-500'}`}>
              {type.description}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
}
