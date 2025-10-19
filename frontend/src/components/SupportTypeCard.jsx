import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function SupportTypeCard({ type, isSelected, onSelect }) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : ''
      }`}
      onClick={() => onSelect(type.id)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`${type.color} text-white p-3 rounded-lg`}>
            {type.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </div>
          {isSelected && (
            <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
