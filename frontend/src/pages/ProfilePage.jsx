import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading profile data...');
      const response = await studentAPI.getProfile();
      console.log('📋 Profile response:', response);
      const student = response.data.data;
      console.log('📋 Student data:', student);
      setStudentData(student);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('❌ Profile load error:', err);
      console.error('❌ Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <Loader2 className="inline-block h-16 w-16 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      

      <main className="w-full px-3 sm:px-4 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-600 mt-2">View your personal and academic information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <span className="text-2xl mr-3">❌</span>
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information (Read-only) */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>This information is from your university records and cannot be edited</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={studentData?.fullName || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerNumber">University Register Number</Label>
                  <Input
                    id="registerNumber"
                    value={studentData?.universityRegisterNumber || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <Input
                    id="email"
                    value={studentData?.collegeEmail || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalEmail">Personal Email</Label>
                  <Input
                    id="personalEmail"
                    value={studentData?.personalEmail || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={studentData?.branch || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    value={studentData?.course || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={studentData?.gender || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="btechYearOfPass">B.Tech Year of Passing</Label>
                  <Input
                    id="btechYearOfPass"
                    value={studentData?.btechYearOfPass || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Performance (Read-only) */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Your current academic standing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    value={studentData?.cgpa || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activeBacklogs">Active Backlogs</Label>
                  <Input
                    id="activeBacklogs"
                    value={studentData?.activeBacklogs || '0'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historyBacklogs">History of Backlogs</Label>
                  <Input
                    id="historyBacklogs"
                    value={studentData?.historyOfBacklogs || '0'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completedInTime">Completed in Time</Label>
                  <Input
                    id="completedInTime"
                    value={studentData?.completedInTime || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionTest">Admission Test</Label>
                  <Input
                    id="admissionTest"
                    value={studentData?.admissionEntranceTest || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entranceRank">Entrance Test Rank</Label>
                  <Input
                    id="entranceRank"
                    value={studentData?.entranceTestRank || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information (Read-only) */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={studentData?.phoneNumber || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="currentAddress">Current Address</Label>
                  <Textarea
                    id="currentAddress"
                    value={studentData?.currentAddress || 'N/A'}
                    disabled
                    className="bg-muted"
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea
                    id="permanentAddress"
                    value={studentData?.permanentAddress || 'N/A'}
                    disabled
                    className="bg-muted"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Previous Education</CardTitle>
              <CardDescription>Your 10th, 12th/Diploma details and percentages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tenthPercentage">10th Percentage/CGPA</Label>
                  <Input
                    id="tenthPercentage"
                    value={studentData?.tenthPercentage || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenthBoard">10th Board</Label>
                  <Input
                    id="tenthBoard"
                    value={studentData?.tenthBoard || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenthYear">10th Year of Pass</Label>
                  <Input
                    id="tenthYear"
                    value={studentData?.tenthYearOfPass || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twelfthPercentage">12th Percentage</Label>
                  <Input
                    id="twelfthPercentage"
                    value={studentData?.twelfthPercentage || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twelfthBoard">12th Board</Label>
                  <Input
                    id="twelfthBoard"
                    value={studentData?.twelfthBoard || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diplomaPercentage">Diploma Percentage</Label>
                  <Input
                    id="diplomaPercentage"
                    value={studentData?.diplomaPercentage || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Online Presence</CardTitle>
              <CardDescription>Your portfolio and social links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                  <Input
                    id="portfolioUrl"
                    value={studentData?.portfolioUrl || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    value={studentData?.linkedinUrl || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={studentData?.githubUrl || 'N/A'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Other details from your records (Read-only)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hasPAN">Has PAN Card</Label>
                    <Input
                      id="hasPAN"
                      value={studentData?.hasPAN || 'N/A'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasPassport">Has Passport</Label>
                    <Input
                      id="hasPassport"
                      value={studentData?.hasPassport || 'N/A'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasLaptop">Has Laptop</Label>
                    <Input
                      id="hasLaptop"
                      value={studentData?.hasLaptop || 'N/A'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasInternet">Has Internet Access</Label>
                    <Input
                      id="hasInternet"
                      value={studentData?.hasInternet || 'N/A'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Resume (Read-only) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Your uploaded resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentData?.resumeUrl ? (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Resume uploaded</p>
                    <p className="text-xs text-muted-foreground">Click to view your resume</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                  >
                    <a href={studentData.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No resume uploaded yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
