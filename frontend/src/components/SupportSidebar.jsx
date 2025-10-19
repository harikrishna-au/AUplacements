import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, RefreshCw, Loader2 } from "lucide-react";

export default function SupportSidebar({ 
  ticketStats, 
  myTickets, 
  ticketsLoading, 
  onRefresh,
  getStatusBadge,
  formatDate
}) {
  return (
    <div className="space-y-6">
      {ticketStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Ticket Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Tickets</span>
                <span className="font-bold text-lg">{ticketStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-600">Pending</span>
                <span className="font-bold text-yellow-600">{ticketStats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600">In Progress</span>
                <span className="font-bold text-blue-600">{ticketStats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600">Resolved</span>
                <span className="font-bold text-green-600">{ticketStats.resolved}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Us</CardTitle>
          <CardDescription>Reach out to the Placement Cell</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Email</p>
              <p className="text-sm text-gray-600">placements@andhrauniversity.edu.in</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Phone</p>
              <p className="text-sm text-gray-600">+91 891 234 5678</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Office</p>
              <p className="text-sm text-gray-600">
                Placement Cell<br />
                Andhra University<br />
                Visakhapatnam, AP 530003
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Office Hours</p>
              <p className="text-sm text-gray-600">
                Monday - Friday<br />
                9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Recent Tickets</CardTitle>
            <Button size="sm" variant="ghost" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>Track your submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {ticketsLoading ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            </div>
          ) : myTickets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No tickets yet. Submit your first feedback above!
            </p>
          ) : (
            <div className="space-y-4">
              {myTickets.slice(0, 5).map((ticket) => (
                <div key={ticket._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">
                        {ticket.ticketNumber}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {ticket.subject}
                      </p>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>
                  {ticket.response?.message && (
                    <p className="text-xs text-gray-600 mb-2">
                      {ticket.response.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li>• Be specific and detailed</li>
            <li>• Include error messages if any</li>
            <li>• Check FAQ before submitting</li>
            <li>• Response time: 24-48 hours</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
