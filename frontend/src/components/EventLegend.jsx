import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventLegend() {
  const eventTypes = [
    { color: '#48bb78', label: 'Pre-Placement Talk' },
    { color: '#ed8936', label: 'Tests & Assessments' },
    { color: '#9f7aea', label: 'Interviews & GD' },
    { color: '#f56565', label: 'Campus Drive' },
    { color: '#38b2ac', label: 'Results' }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Event Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {eventTypes.map((type, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: type.color }}></div>
            <span className="text-sm text-gray-700">{type.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
