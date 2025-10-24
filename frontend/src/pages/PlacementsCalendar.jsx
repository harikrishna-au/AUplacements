import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CalendarView from '../components/CalendarView';
import UpcomingEventsList from '../components/UpcomingEventsList';
import RefreshButton from '../components/RefreshButton';

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



  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="w-full px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Placements Calendar</h1>
            <p className="text-gray-600">Track upcoming placement events</p>
          </div>
          <div className="flex gap-2">
            <RefreshButton onClick={fetchEvents} loading={loading} />
            <Button onClick={() => setCurrentDate(new Date())} className="bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
              📅 Today
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !events.length ? (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                <p className="ml-4 text-gray-600">Loading events...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3 overflow-hidden">
              <CalendarView
                events={events}
                view={view}
                setView={setView}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                selectedEvent={selectedEvent}
                onEventSelect={setSelectedEvent}
              />
            </div>

            {/* Sidebar */}
            <div>
              <UpcomingEventsList 
                events={events} 
                onEventClick={setSelectedEvent}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
