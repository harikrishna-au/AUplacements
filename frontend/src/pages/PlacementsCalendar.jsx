import { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function PlacementsCalendar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventAPI.getMyEvents();
      
      // Transform API data to calendar format
      const transformedEvents = response.data.map(event => ({
        id: event._id,
        title: `${event.companyId?.name || 'Company'} - ${event.title}`,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        desc: event.description,
        type: event.eventType,
        company: event.companyId?.name,
        venue: event.location,
        mode: event.mode,
        maxCapacity: event.maxCapacity,
        status: event.status,
        participants: event.participants || [],
        allDay: false,
        _raw: event // Keep raw data for registration
      }));

      setEvents(transformedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleRegisterForEvent = async (event) => {
    try {
      setIsRegistering(true);
      // Extract companyId and eventId from the event object
      const companyId = event._raw?.companyId?._id;
      const eventId = event._raw?._id;
      
      if (!companyId || !eventId) {
        throw new Error('Invalid event data');
      }
      
      await eventAPI.registerForEvent(companyId, eventId);
      alert('Successfully registered for event!');
      // Refresh events to get updated participant list
      await fetchEvents();
      setSelectedEvent(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setIsRegistering(false);
    }
  };

  // Custom event styling based on type
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3182ce';
    
    switch (event.type) {
      case 'pre-placement':
        backgroundColor = '#48bb78'; // green
        break;
      case 'test':
        backgroundColor = '#ed8936'; // orange
        break;
      case 'interview':
        backgroundColor = '#9f7aea'; // purple
        break;
      case 'group-discussion':
        backgroundColor = '#38b2ac'; // teal
        break;
      case 'drive':
        backgroundColor = '#f56565'; // red
        break;
      case 'result':
        backgroundColor = '#4299e1'; // blue
        break;
      default:
        backgroundColor = '#3182ce'; // blue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Placements Calendar</h2>
            <p className="text-gray-600 mt-2">Track upcoming placement drives, interviews, and company visits</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchEvents}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setCurrentDate(new Date())}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              📅 Today
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">❌ {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !events.length ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                <p className="ml-4 text-gray-600">Loading events...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
            <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Placement Schedule</CardTitle>
                    <CardDescription>Click on any event for more details</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={view === 'month' ? 'default' : 'outline'}
                      onClick={() => setView('month')}
                    >
                      Month
                    </Button>
                    <Button 
                      size="sm" 
                      variant={view === 'week' ? 'default' : 'outline'}
                      onClick={() => setView('week')}
                    >
                      Week
                    </Button>
                    <Button 
                      size="sm" 
                      variant={view === 'day' ? 'default' : 'outline'}
                      onClick={() => setView('day')}
                    >
                      Day
                    </Button>
                    <Button 
                      size="sm" 
                      variant={view === 'agenda' ? 'default' : 'outline'}
                      onClick={() => setView('agenda')}
                    >
                      Agenda
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg" style={{ height: '60vh' }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day', 'agenda']}
                    view={view}
                    onView={setView}
                    date={currentDate}
                    onNavigate={setCurrentDate}
                    popup
                    selectable
                    onSelectSlot={(slotInfo) => {
                      console.log('Selected slot:', slotInfo);
                      // Can be used to add new events
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details & Legend */}
          <div className="space-y-6">
            {/* Event Details */}
            {selectedEvent ? (
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedEvent.company}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {format(selectedEvent.start, 'PPP p')} - {format(selectedEvent.end, 'p')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Venue</p>
                    <p className="text-sm text-gray-600">
                      {selectedEvent.venue || 'TBA'} 
                      {selectedEvent.mode && ` (${selectedEvent.mode})`}
                    </p>
                  </div>

                  {selectedEvent.maxCapacity && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Max Capacity</p>
                      <p className="text-sm text-gray-600">{selectedEvent.maxCapacity} participants</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-sm text-gray-600">{selectedEvent.desc}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      selectedEvent.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      selectedEvent.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      selectedEvent.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedEvent.status}
                    </span>
                  </div>

                  {selectedEvent.status === 'scheduled' && (
                    <Button 
                      className="w-full mt-4"
                      onClick={() => handleRegisterForEvent(selectedEvent)}
                      disabled={isRegistering}
                    >
                      {isRegistering ? 'Registering...' : 'Register for Event'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500 text-center">
                    Select an event from the calendar to view details
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#48bb78' }}></div>
                  <span className="text-sm text-gray-700">Pre-Placement Talk</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ed8936' }}></div>
                  <span className="text-sm text-gray-700">Tests & Assessments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9f7aea' }}></div>
                  <span className="text-sm text-gray-700">Interviews & GD</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f56565' }}></div>
                  <span className="text-sm text-gray-700">Campus Drive</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#38b2ac' }}></div>
                  <span className="text-sm text-gray-700">Results</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
                ) : (
                  events
                    .filter(e => new Date(e.start) >= new Date())
                    .sort((a, b) => new Date(a.start) - new Date(b.start))
                    .slice(0, 5)
                    .map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                        <div className="text-2xl">📅</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{event.company}</p>
                          <p className="text-xs text-gray-600">{format(event.start, 'PPP')}</p>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
