const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auplacements')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Student = require('../models/Student');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const StudentApplication = require('../models/StudentApplication');

async function testApplicationFlow() {
  try {
    // Get your student
    const student = await Student.findOne({ collegeEmail: '322107311061@andhrauniversity.edu.in' });
    if (!student) {
      console.log('❌ Student not found');
      return;
    }
    
    console.log('✅ Found Student:', student.fullName);
    console.log('   Student ID:', student._id.toString());
    console.log('   Branch:', student.branch);
    
    // Check StudentProfile
    let studentProfile = await StudentProfile.findOne({ studentId: student._id });
    
    if (!studentProfile) {
      console.log('\n⚠️  StudentProfile does NOT exist! Creating one...');
      
      studentProfile = new StudentProfile({
        studentId: student._id,
        universityRegisterNumber: student.universityRegisterNumber,
        fullName: student.fullName,
        collegeEmail: student.collegeEmail,
        phoneNumber: student.phoneNumber,
        course: student.course,
        branch: student.branch,
        placementStats: {
          totalApplications: 0,
          shortlisted: 0,
          rejected: 0,
          selected: 0,
          companiesApplied: []
        }
      });
      
      await studentProfile.save();
      console.log('✅ StudentProfile created!');
    } else {
      console.log('\n✅ StudentProfile exists');
    }
    
    console.log('   Profile ID:', studentProfile._id.toString());
    console.log('   Total Applications:', studentProfile.placementStats.totalApplications);
    console.log('   Companies Applied:', studentProfile.placementStats.companiesApplied.length);
    
    if (studentProfile.placementStats.companiesApplied.length > 0) {
      console.log('   Company IDs:', studentProfile.placementStats.companiesApplied.map(id => id.toString()));
    }
    
    // Get Accenture
    const accenture = await Company.findOne({ name: 'Accenture' });
    if (!accenture) {
      console.log('\n❌ Accenture not found');
      return;
    }
    
    console.log('\n✅ Found Accenture');
    console.log('   Company ID:', accenture._id.toString());
    console.log('   Events:', accenture.events.length);
    
    // Check if student already applied
    const existingApplication = await StudentApplication.findOne({
      studentId: student._id,
      companyId: accenture._id
    });
    
    if (existingApplication) {
      console.log('\n⚠️  Student ALREADY applied to Accenture');
      console.log('   Application ID:', existingApplication._id.toString());
      console.log('   Status:', existingApplication.status);
      
      // Check if company is in profile
      const isInProfile = studentProfile.placementStats.companiesApplied.some(
        id => id.toString() === accenture._id.toString()
      );
      
      console.log('   Is in Profile companiesApplied?', isInProfile ? '✅ YES' : '❌ NO');
      
      if (!isInProfile) {
        console.log('\n🔧 FIXING: Adding company to profile...');
        studentProfile.placementStats.companiesApplied.push(accenture._id);
        studentProfile.placementStats.totalApplications = studentProfile.placementStats.companiesApplied.length;
        await studentProfile.save();
        console.log('✅ Fixed! Company added to profile');
      }
    } else {
      console.log('\n✅ No existing application - you can apply through the UI');
    }
    
    // Final check
    console.log('\n📊 FINAL STATE:');
    const finalProfile = await StudentProfile.findOne({ studentId: student._id });
    console.log('   Companies Applied:', finalProfile.placementStats.companiesApplied.length);
    if (finalProfile.placementStats.companiesApplied.length > 0) {
      console.log('   Company IDs:', finalProfile.placementStats.companiesApplied.map(id => id.toString()));
      
      // Verify companies exist
      for (const companyId of finalProfile.placementStats.companiesApplied) {
        const company = await Company.findById(companyId);
        if (company) {
          console.log(`     ✅ ${company.name} - ${company.events.length} events`);
        } else {
          console.log(`     ❌ Company ${companyId} not found`);
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testApplicationFlow();
