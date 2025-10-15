/**
 * Quick script to create a test student
 * Run: node scripts/createTestStudent.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auplacements';

async function createTestStudent() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if test student already exists
    const existing = await Student.findOne({ universityRegisterNumber: 'TEST123' });
    
    if (existing) {
      console.log('✅ Test student already exists!');
      console.log('\n📧 Test Login Email: test123@andhrauniversity.edu.in');
      console.log('👤 Student Name:', existing.fullName);
      console.log('\nYou can use this email to test the login flow.\n');
      process.exit(0);
    }

    // Create test student
    const testStudent = new Student({
      slNo: 1,
      universityRegisterNumber: 'TEST123',
      fullName: 'Harikrishna Nallana',
      gender: 'Male',
      nationality: 'Indian',
      dateOfBirth: '01/01/2000',
      collegeName: 'Andhra University College of Engineering',
      course: 'B.Tech',
      branch: 'Computer Science and Engineering',
      personalEmail: 'nallanahk@gmail.com',
      collegeEmail: 'test123@andhrauniversity.edu.in',
      
      // Contact Info
      phoneNumber: '+91 9876543210',
      currentAddress: 'Hostel Block A, Room 101, AU Campus, Visakhapatnam',
      permanentAddress: '123 Main Street, Visakhapatnam, Andhra Pradesh - 530003',
      
      // Academic Performance
      cgpa: '8.5',
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      
      // Previous Education
      tenthPercentage: '95',
      tenthBoard: 'CBSE',
      tenthYearOfPass: '2018',
      twelfthPercentage: '92',
      twelfthBoard: 'CBSE',
      twelfthYearOfPass: '2020',
      diplomaPercentage: '',
      
      btechYearOfPass: '2024',
      hasBacklogHistory: 'No',
      completedInTime: 'Yes',
      category: 'General',
      isPwD: 'No',
      pwdDetails: 'N/A',
      hasPAN: 'Yes',
      hasPassport: 'Yes',
      hasLaptop: 'Yes',
      hasInternet: 'Yes',
      
      // Online Presence
      portfolioUrl: 'https://harikrishna.dev',
      linkedinUrl: 'https://linkedin.com/in/harikrishna-nallana',
      githubUrl: 'https://github.com/harikrishna-nallana'
    });

    await testStudent.save();

    console.log('✅ Test student created successfully!\n');
    console.log('──────────────────────────────────────');
    console.log('📋 Test Student Details:');
    console.log('──────────────────────────────────────');
    console.log('📧 Email:', testStudent.collegeEmail);
    console.log('👤 Name:', testStudent.fullName);
    console.log('🆔 Register Number:', testStudent.universityRegisterNumber);
    console.log('🎓 Branch:', testStudent.branch);
    console.log('📚 Course:', testStudent.course);
    console.log('──────────────────────────────────────\n');
    console.log('🚀 You can now test the login flow with this email!\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestStudent();
