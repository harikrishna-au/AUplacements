import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import CompanyLogo from './CompanyLogo';

export default function UpcomingEventsList({ events, onEventClick }) {
  const upcomingEvents = events
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
        ) : (
          upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onEventClick(event)}
            >
              <CompanyLogo 
                logo={event._raw?.companyId?.logo}
                companyName={event.company}
                size="sm"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-600 mt-1">{event.company}</p>
                <p className="text-xs text-gray-500 mt-1">{format(event.start, 'PPP')}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
