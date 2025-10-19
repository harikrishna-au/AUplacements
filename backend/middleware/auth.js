const { ClerkExpressRequireAuth, clerkClient } = require('@clerk/clerk-sdk-node');

// Lazy load models
let Student;
let StudentProfile;

const getStudentModel = () => {
  if (!Student) {
    Student = require('../models/Student');
  }
  return Student;
};

const getStudentProfileModel = () => {
  if (!StudentProfile) {
    StudentProfile = require('../models/StudentProfile');
  }
  return StudentProfile;
};

// Helper function to create comprehensive StudentProfile from Student data
async function createOrUpdateStudentProfile(student, clerkUser) {
  const StudentProfileModel = getStudentProfileModel();
  
  try {
    let profile = await StudentProfileModel.findById(student.universityRegisterNumber);
    
    if (!profile) {
      console.log('Creating StudentProfile for student:', student._id);
      
      const publicMetadata = clerkUser.publicMetadata || {};
      
      profile = await StudentProfileModel.create({
        _id: student.universityRegisterNumber,
        studentId: student.universityRegisterNumber,
        universityRegisterNumber: student.universityRegisterNumber,
        fullName: student.fullName,
        collegeEmail: student.collegeEmail,
        
        // Personal Information
        phoneNumber: student.phoneNumber || publicMetadata.phoneNumber,
        course: student.course || publicMetadata.course,
        branch: student.branch || publicMetadata.branch,
        currentSemester: publicMetadata.currentSemester,
        slNo: student.slNo,
        gender: student.gender,
        nationality: student.nationality,
        dateOfBirth: student.dateOfBirth,
        collegeName: student.collegeName,
        personalEmail: student.personalEmail,
        
        // Contact Information
        currentAddress: student.currentAddress,
        permanentAddress: student.permanentAddress,
        
        // Academic History
        tenthBoard: student.tenthBoard,
        tenthYearOfPass: student.tenthYearOfPass,
        twelfthBoard: student.twelfthBoard,
        twelfthYearOfPass: student.twelfthYearOfPass,
        diplomaBoard: student.diplomaBoard,
        diplomaState: student.diplomaState,
        diplomaYearOfPass: student.diplomaYearOfPass,
        btechYearOfPass: student.btechYearOfPass,
        
        // Additional Student Details
        hasBacklogHistory: student.hasBacklogHistory,
        completedInTime: student.completedInTime,
        admissionEntranceTest: student.admissionEntranceTest,
        entranceTestRank: student.entranceTestRank,
        category: student.category,
        isPwD: student.isPwD,
        pwdDetails: student.pwdDetails,
        hasPAN: student.hasPAN,
        hasPassport: student.hasPassport,
        hasLaptop: student.hasLaptop,
        hasInternet: student.hasInternet,
        
        academicDetails: {
          cgpa: student.cgpa || student.auccCGPA || publicMetadata.cgpa || '',
          activeBacklogs: student.activeBacklogs || student.standingBacklogs || publicMetadata.activeBacklogs || 0,
          historyOfBacklogs: student.historyOfBacklogs || publicMetadata.historyOfBacklogs || 0,
          tenthPercentage: student.tenthPercentage || student.tenthCGPA || publicMetadata.tenthPercentage || '',
          twelfthPercentage: student.twelfthPercentage || publicMetadata.twelfthPercentage || '',
          diplomaPercentage: student.diplomaPercentage || publicMetadata.diplomaPercentage || '',
          isEligibleForPlacements: true
        },
        
        technicalSkills: publicMetadata.technicalSkills || [],
        softSkills: publicMetadata.softSkills || [],
        programmingLanguages: publicMetadata.programmingLanguages || [],
        frameworks: publicMetadata.frameworks || [],
        
        careerPreferences: {
          preferredRoles: publicMetadata.preferredRoles || [],
          preferredIndustries: publicMetadata.preferredIndustries || [],
          preferredLocations: publicMetadata.preferredLocations || [],
          willingToRelocate: publicMetadata.willingToRelocate !== false,
          jobType: publicMetadata.jobType || 'both'
        },
        
        socialLinks: {
          portfolio: student.portfolioUrl || publicMetadata.portfolioUrl,
          linkedin: student.linkedinUrl || publicMetadata.linkedinUrl,
          github: student.githubUrl || publicMetadata.githubUrl,
          twitter: publicMetadata.twitterUrl,
          medium: publicMetadata.mediumUrl
        },
        
        documents: {
          resume: student.resumeUrl ? {
            url: student.resumeUrl,
            uploadedAt: new Date(),
            fileName: publicMetadata.resumeFileName
          } : undefined
        },
        
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          notifyOnNewCompany: true,
          notifyOnShortlist: true,
          notifyOnDeadline: true
        },
        
        privacySettings: {
          showPhoneNumber: false,
          showEmail: true,
          allowResourceSharing: true,
          profileVisibility: 'students-only'
        },
        
        activityLog: {
          lastLogin: new Date(),
          lastProfileUpdate: new Date(),
          totalLogins: 1
        },
        
        flags: {
          isBlacklisted: false,
          isPlaced: false,
          hasActiveOffer: false
        }
      });
      
      // Calculate initial profile completion
      profile.calculateProfileCompletion();
      await profile.save();
      
      console.log('✅ Created StudentProfile:', profile._id, 'Completion:', profile.profileCompletionPercentage + '%');
      console.log('📊 Profile creation summary:', {
        id: profile._id,
        name: profile.fullName,
        email: profile.collegeEmail,
        course: profile.course,
        branch: profile.branch,
        cgpa: profile.academicDetails?.cgpa
      });
    } else {
      // Update login stats and sync data from Student model
      profile.activityLog.lastLogin = new Date();
      profile.activityLog.totalLogins = (profile.activityLog.totalLogins || 0) + 1;
      
      profile.fullName = student.fullName;
      profile.phoneNumber = student.phoneNumber || profile.phoneNumber;
      profile.course = student.course || profile.course;
      profile.branch = student.branch || profile.branch;
      
      if (student.cgpa || student.auccCGPA) {
        profile.academicDetails.cgpa = student.cgpa || student.auccCGPA;
      }
      if (student.activeBacklogs !== undefined || student.standingBacklogs !== undefined) {
        profile.academicDetails.activeBacklogs = student.activeBacklogs || student.standingBacklogs || 0;
      }
      
      profile.calculateProfileCompletion();
      await profile.save();
      
      console.log('✅ Updated StudentProfile:', profile._id, 'Completion:', profile.profileCompletionPercentage + '%');
      console.log('📊 Profile update summary:', {
        id: profile._id,
        name: profile.fullName,
        lastLogin: profile.activityLog.lastLogin,
        totalLogins: profile.activityLog.totalLogins
      });
    }
    
    return profile;
  } catch (error) {
    console.error('Error creating/updating StudentProfile:', error);
    throw error;
  }
}

async function authenticateClerk(req, res, next) {
  try {
    console.log('🔐 authenticateClerk started for:', req.method, req.path);
    console.log('🔐 Request headers:', req.headers.authorization ? 'Authorization header present' : 'No authorization header');
    const userId = req.auth.userId;
    console.log('Clerk userId:', userId);
    
    if (!userId) {
      console.log('No userId found in req.auth');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Fetch user details from Clerk API since JWT doesn't include email
    console.log('Fetching user details from Clerk API...');
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log('Clerk user:', clerkUser.emailAddresses);
    
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    const firstName = clerkUser.firstName || '';
    const lastName = clerkUser.lastName || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || clerkUser.username || (email ? email.split('@')[0] : 'User');
    console.log('Extracted email:', email, 'fullName:', fullName);
    
    // Validate email domain - only allow @andhrauniversity.edu.in
    if (!email || !email.endsWith('@andhrauniversity.edu.in')) {
      console.log('❌ Unauthorized email domain:', email);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please register with your Andhra University email (rollnumber@andhrauniversity.edu.in)'
      });
    }
    
    const StudentModel = getStudentModel();
    const rollNumber = email.split('@')[0];
    let student;
    
    try {
      // Only lookup by roll number (universityRegisterNumber)
      student = await StudentModel.findOne({ universityRegisterNumber: rollNumber });
      console.log('Found existing student by roll number:', rollNumber, student ? 'YES' : 'NO');
    } catch (dbError) {
      console.error('Database error finding student:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error during authentication'
      });
    }
    
    if (student) {
      
      try {
        // Update existing student with login info
        student.collegeEmail = email.toLowerCase();
        student.fullName = fullName;
        student.lastLoginAt = new Date();
        await student.save();
        console.log('✅ Updated existing Student:', student._id);
        
        // Create or update StudentProfile
        await createOrUpdateStudentProfile(student, clerkUser);
      } catch (saveError) {
        console.error('Error saving student:', saveError);
        return res.status(500).json({
          success: false,
          message: 'Failed to update student profile'
        });
      }
    } else {
      try {
        // Create new student with basic info (no existing data found)
        student = await StudentModel.create({
          _id: rollNumber,
          collegeEmail: email.toLowerCase(),
          fullName: fullName,
          universityRegisterNumber: rollNumber,
          lastLoginAt: new Date()
        });
        console.log('✅ Created new Student (no existing data):', student._id);
        
        // Create StudentProfile for new student
        await createOrUpdateStudentProfile(student, clerkUser);
      } catch (createError) {
        console.error('Error creating student:', createError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create student profile'
        });
      }
    }
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Update StudentProfile login stats on every login
    try {
      const StudentProfileModel = getStudentProfileModel();
      await StudentProfileModel.findByIdAndUpdate(
        student.universityRegisterNumber,
        {
          $set: { 'activityLog.lastLogin': new Date() },
          $inc: { 'activityLog.totalLogins': 1 }
        },
        { upsert: true }
      );
    } catch (profileError) {
      console.error('Error updating profile login stats:', profileError);
    }

    req.user = {
      id: student.universityRegisterNumber,
      studentId: student.universityRegisterNumber,
      email: student.collegeEmail,
      name: student.fullName,
      registerNumber: student.universityRegisterNumber
    };

    console.log('✅ Authentication successful for user:', {
      userId: student._id,
      email: student.collegeEmail
    });
    console.log('Calling next() to proceed to route handler');

    next();
  } catch (error) {
    console.error('Clerk auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: ' + error.message
    });
  }
}

module.exports = {
  clerkMiddleware: ClerkExpressRequireAuth(),
  authenticateClerk,
  authenticate: (req, res, next) => {
    console.log('Authentication middleware called for:', req.method, req.path);
    ClerkExpressRequireAuth()(req, res, (err) => {
      if (err) {
        console.error('Clerk auth error:', err);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed'
        });
      }
      authenticateClerk(req, res, next);
    });
  }
};
