/**
 * Script to import students from Excel file
 *
 * Usage:
 * 1. Place your Excel file at: backend/data/students.xlsx
 * 2. Run: node scripts/importStudents.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const { importStudentsFromExcel } = require('../utils/importStudents');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auplacements';
const EXCEL_FILE_PATH = path.join(__dirname, '../data/students.xlsx');

// Allowed branches for import
const ALLOWED_BRANCHES = [
  'B.TECH-COMPUTER SCIENCE & ENGINEERING',
  'B.TECH-INFORMATION TECHNOLOGY',
  'INTEGRATED DUAL DEGREE (B.Tech+M.Tech) - CSE',
];

async function run() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📂 Excel file path:', EXCEL_FILE_PATH);
    console.log('──────────────────────────────────────\n');

    // Import all students from Excel
    const result = await importStudentsFromExcel(EXCEL_FILE_PATH);

    // Filter based on allowed branches
    const filteredStudents = result.students.filter(student =>
      ALLOWED_BRANCHES.includes(student.BRANCH?.trim())
    );

    console.log(`📊 Total rows in file: ${result.total}`);
    console.log(`✅ Eligible for import (filtered): ${filteredStudents.length}`);
    console.log(`🚫 Skipped (other branches): ${result.total - filteredStudents.length}\n`);

    // Save only filtered students
    if (filteredStudents.length > 0) {
      const Student = mongoose.model('Student');
      await Student.insertMany(filteredStudents);
      console.log(`🎉 Successfully imported ${filteredStudents.length} students!`);
    } else {
      console.log('⚠️ No students matched the allowed branches.');
    }

    console.log('──────────────────────────────────────\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. MongoDB is running');
    console.error('2. Excel file exists at:', EXCEL_FILE_PATH);
    console.error('3. Excel file has the correct format\n');
    process.exit(1);
  }
}

run();
