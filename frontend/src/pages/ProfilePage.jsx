import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import ProfileSection from '../components/ProfileSection';

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
    <div className="min-h-screen pt-20 flex items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <Loader2 className="inline-block h-16 w-16 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      

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
          <ProfileSection
            title="Basic Information"
            description="This information is from your university records"
            studentData={studentData}
            fields={[
              { id: 'fullName', label: 'Full Name', key: 'fullName' },
              { id: 'registerNumber', label: 'Register Number', key: 'universityRegisterNumber' },
              { id: 'email', label: 'College Email', key: 'collegeEmail' },
              { id: 'personalEmail', label: 'Personal Email', key: 'personalEmail' },
              { id: 'branch', label: 'Branch', key: 'branch' },
              { id: 'course', label: 'Course', key: 'course' },
              { id: 'gender', label: 'Gender', key: 'gender' },
              { id: 'btechYear', label: 'B.Tech Year of Passing', key: 'btechYearOfPass' }
            ]}
          />

          <ProfileSection
            title="Academic Performance"
            description="Your current academic standing"
            studentData={studentData}
            fields={[
              { id: 'cgpa', label: 'CGPA', key: 'cgpa' },
              { id: 'activeBacklogs', label: 'Active Backlogs', key: 'activeBacklogs' },
              { id: 'historyBacklogs', label: 'History of Backlogs', key: 'historyOfBacklogs' },
              { id: 'completedInTime', label: 'Completed in Time', key: 'completedInTime' },
              { id: 'admissionTest', label: 'Admission Test', key: 'admissionEntranceTest' },
              { id: 'entranceRank', label: 'Entrance Test Rank', key: 'entranceTestRank' }
            ]}
          />

          <ProfileSection
            title="Contact Information"
            description="Your contact details"
            studentData={studentData}
            fields={[
              { id: 'phoneNumber', label: 'Phone Number', key: 'phoneNumber' },
              { id: 'currentAddress', label: 'Current Address', key: 'currentAddress', type: 'textarea', fullWidth: true },
              { id: 'permanentAddress', label: 'Permanent Address', key: 'permanentAddress', type: 'textarea', fullWidth: true }
            ]}
          />

          <ProfileSection
            title="Previous Education"
            description="Your 10th, 12th/Diploma details"
            studentData={studentData}
            fields={[
              { id: 'tenthPercentage', label: '10th Percentage/CGPA', key: 'tenthPercentage' },
              { id: 'tenthBoard', label: '10th Board', key: 'tenthBoard' },
              { id: 'tenthYear', label: '10th Year of Pass', key: 'tenthYearOfPass' },
              { id: 'twelfthPercentage', label: '12th Percentage', key: 'twelfthPercentage' },
              { id: 'twelfthBoard', label: '12th Board', key: 'twelfthBoard' },
              { id: 'diplomaPercentage', label: 'Diploma Percentage', key: 'diplomaPercentage' }
            ]}
          />

          <ProfileSection
            title="Online Presence"
            description="Your portfolio and social links"
            studentData={studentData}
            fields={[
              { id: 'portfolioUrl', label: 'Portfolio URL', key: 'portfolioUrl' },
              { id: 'linkedinUrl', label: 'LinkedIn URL', key: 'linkedinUrl' },
              { id: 'githubUrl', label: 'GitHub URL', key: 'githubUrl' }
            ]}
          />

          <ProfileSection
            title="Additional Information"
            description="Other details from your records"
            studentData={studentData}
            fields={[
              { id: 'hasPAN', label: 'Has PAN Card', key: 'hasPAN' },
              { id: 'hasPassport', label: 'Has Passport', key: 'hasPassport' },
              { id: 'hasLaptop', label: 'Has Laptop', key: 'hasLaptop' },
              { id: 'hasInternet', label: 'Has Internet Access', key: 'hasInternet' }
            ]}
          />

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
