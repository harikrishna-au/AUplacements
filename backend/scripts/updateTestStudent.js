require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

async function updateTestStudent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update the test student
    const result = await Student.updateOne(
      { collegeEmail: 'test123@andhrauniversity.edu.in' },
      {
        $set: {
          cgpa: '8.5',
          activeBacklogs: 0,
          historyOfBacklogs: 0,
          phoneNumber: '+91 9876543210',
          currentAddress: 'Hostel Block A, Room 101, AU Campus, Visakhapatnam',
          permanentAddress: '123 Main Street, Visakhapatnam, Andhra Pradesh - 530003',
          tenthPercentage: '95',
          twelfthPercentage: '92',
          diplomaPercentage: '',
          portfolioUrl: 'https://harikrishna.dev',
          linkedinUrl: 'https://linkedin.com/in/harikrishna-nallana',
          githubUrl: 'https://github.com/harikrishna-nallana'
        },
        $unset: {
          tenthCGPA: '',
          auccCGPA: '',
          standingBacklogs: ''
        }
      }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Test student updated successfully!');
      
      const student = await Student.findOne({ collegeEmail: 'test123@andhrauniversity.edu.in' });
      console.log('\n📋 Updated Student Data:');
      console.log('──────────────────────────────────────');
      console.log('👤 Name:', student.fullName);
      console.log('🆔 Register Number:', student.universityRegisterNumber);
      console.log('📧 Email:', student.collegeEmail);
      console.log('📱 Phone:', student.phoneNumber);
      console.log('🎓 CGPA:', student.cgpa);
      console.log('📊 Active Backlogs:', student.activeBacklogs);
      console.log('🏠 Current Address:', student.currentAddress);
      console.log('──────────────────────────────────────');
    } else {
      console.log('❌ Test student not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateTestStudent();
