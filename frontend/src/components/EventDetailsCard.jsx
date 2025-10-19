import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

export default function EventDetailsCard({ event, onRegister, isRegistering }) {
  if (!event) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 text-center">
            Select an event from the calendar to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{event.company}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Date & Time</p>
          <p className="text-sm text-gray-600">
            {format(event.start, 'PPP p')} - {format(event.end, 'p')}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Venue</p>
          <p className="text-sm text-gray-600">
            {event.venue || 'TBA'} 
            {event.mode && ` (${event.mode})`}
          </p>
        </div>

        {event.maxCapacity && (
          <div>
            <p className="text-sm font-medium text-gray-700">Max Capacity</p>
            <p className="text-sm text-gray-600">{event.maxCapacity} participants</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-700">Description</p>
          <p className="text-sm text-gray-600">{event.desc}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Status</p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {event.status}
          </span>
        </div>

        {event.status === 'scheduled' && (
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            onClick={() => onRegister(event)}
            disabled={isRegistering}
          >
            {isRegistering ? 'Registering...' : 'Register for Event'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
