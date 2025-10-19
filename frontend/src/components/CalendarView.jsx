import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from 'lucide-react';
import CompanyLogo from './CompanyLogo';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarView({ events, view, setView, currentDate, setCurrentDate, selectedEvent, onEventSelect }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const eventColors = {
    'pre-placement': '#48bb78',
    'test': '#ed8936',
    'interview': '#9f7aea',
    'group-discussion': '#38b2ac',
    'drive': '#f56565',
    'result': '#4299e1'
  };

  const eventStyleGetter = (event) => {
    const color = eventColors[event.type] || '#6366f1';
    console.log('Event:', event.title, 'Type:', event.type, 'Color:', color);
    return {
      style: {
        backgroundColor: color,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        cursor: 'pointer'
      }
    };
  };

  const handleSelectEvent = (event, e) => {
    onEventSelect(event);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg md:text-xl">Placement Schedule</CardTitle>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block z-50 w-72 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-2xl">
                <p className="text-xs font-semibold text-gray-900 mb-3">Event Types</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: '#48bb78' }}></div>
                    <span className="text-xs text-gray-700">Pre-Placement Talk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ed8936' }}></div>
                    <span className="text-xs text-gray-700">Tests & Assessments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#9f7aea' }}></div>
                    <span className="text-xs text-gray-700">Interviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#38b2ac' }}></div>
                    <span className="text-xs text-gray-700">Group Discussion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f56565' }}></div>
                    <span className="text-xs text-gray-700">Campus Drive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4299e1' }}></div>
                    <span className="text-xs text-gray-700">Results</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 pt-3 border-t">Hover over any event to see details</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Button size="sm" variant={view === 'month' ? 'default' : 'outline'} onClick={() => setView('month')} className="text-xs px-2 py-1">
              Month
            </Button>
            <Button size="sm" variant={view === 'week' ? 'default' : 'outline'} onClick={() => setView('week')} className="text-xs px-2 py-1">
              Week
            </Button>
            <Button size="sm" variant={view === 'day' ? 'default' : 'outline'} onClick={() => setView('day')} className="text-xs px-2 py-1">
              Day
            </Button>
            <Button size="sm" variant={view === 'agenda' ? 'default' : 'outline'} onClick={() => setView('agenda')} className="text-xs px-2 py-1">
              Agenda
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Custom Navigation Toolbar */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              const newDate = new Date(currentDate);
              if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
              else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
              else if (view === 'day') newDate.setDate(newDate.getDate() - 1);
              setCurrentDate(newDate);
            }}
            className="text-xs"
          >
            ← Prev
          </Button>
          <h3 className="font-semibold text-gray-900">
            {format(currentDate, view === 'month' ? 'MMMM yyyy' : view === 'week' ? "'Week of' MMM d, yyyy" : 'MMMM d, yyyy')}
          </h3>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              const newDate = new Date(currentDate);
              if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
              else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
              else if (view === 'day') newDate.setDate(newDate.getDate() + 1);
              setCurrentDate(newDate);
            }}
            className="text-xs"
          >
            Next →
          </Button>
        </div>
        <div 
          className="bg-white rounded-lg relative" 
          style={{ height: '60vh', minHeight: '400px' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onEventSelect(null);
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
            view={view}
            onView={setView}
            date={currentDate}
            onNavigate={setCurrentDate}
            onSelectEvent={handleSelectEvent}
            popup
          />
          
          {/* Event Overlay */}
          {selectedEvent && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
              onClick={() => onEventSelect(null)}
            >
              <Card 
                className="w-96 shadow-2xl border-2 border-indigo-200 bg-white relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEventSelect(null)}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
                <CardContent className="p-5 space-y-3 bg-white">
                  <div className="flex items-start gap-3 pr-6">
                    <CompanyLogo 
                      logo={selectedEvent._raw?.companyId?.logo}
                      companyName={selectedEvent.company}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg">{selectedEvent.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{selectedEvent.company}</p>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: eventColors[selectedEvent.type] || '#6366f1' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Type: {selectedEvent.type || 'N/A'}</p>
                  <div className="text-xs text-gray-500">
                    <p>{format(selectedEvent.start, 'PPP p')} - {format(selectedEvent.end, 'p')}</p>
                    <p className="mt-1">{selectedEvent.venue || 'TBA'} {selectedEvent.mode && `(${selectedEvent.mode})`}</p>
                  </div>
                  {selectedEvent.desc && (
                    <p className="text-xs text-gray-600 pt-2 border-t">{selectedEvent.desc}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
