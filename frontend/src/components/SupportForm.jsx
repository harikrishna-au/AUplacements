import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle2, AlertCircle, Loader2, Star } from "lucide-react";

export default function SupportForm({ 
  currentType, 
  formData, 
  onInputChange, 
  onRatingClick, 
  onSubmit, 
  loading, 
  submitted, 
  error,
  categories,
  user
}) {
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <Card>
      <CardHeader className={`${currentType?.color} text-white`}>
        <div className="flex items-center gap-3">
          {currentType?.icon}
          <div>
            <CardTitle className="text-white">{currentType?.name}</CardTitle>
            <CardDescription className="text-white/80 mt-1">
              {currentType?.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {formData.type === 'feedback' ? 'Thank You!' : 'Submitted Successfully!'}
            </h3>
            <p className="text-gray-600">
              {formData.type === 'feedback' 
                ? 'Thank you for taking your valuable time to share your feedback with us. Your input helps us improve!'
                : `Thank you for your ${formData.type}. We'll get back to you within 24-48 hours.`
              }
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {formData.type === 'feedback' && (
              <div>
                <Label>How would you rate your experience? *</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onRatingClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredStar || formData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={onInputChange}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories[formData.type]?.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={onInputChange}
                placeholder="Brief description of your feedback"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Your message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={onInputChange}
                placeholder="Please provide detailed information..."
                rows={6}
                required
              />
            </div>

            {(formData.type === 'bug' || formData.type === 'help') && (
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={onInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Submitting as:</p>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{user?.registerNumber}</p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {formData.type === 'feedback' ? 'Sending...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {formData.type === 'feedback' ? 'Send Feedback' : `Submit ${currentType?.name}`}
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
