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

const MONGODB_URI = 'mongodb+srv://hari:root@auplacements.jzbstxr.mongodb.net/auplacements';
const EXCEL_FILE_PATH = path.join(__dirname, '../data/students.xlsx');

// Allowed branches (normalized to lowercase for comparison)
const ALLOWED_BRANCHES = [
  'b.tech-computer science & engineering',
  'b.tech-information technology',
  'integrated dual degree (b.tech+m.tech) - cse',
];

function normalizeBranch(branch) {
  if (!branch) return '';
  return branch
    .toString()
    .trim()
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .replace(/–/g, '-') // replace special hyphens
    .toLowerCase();
}

async function run() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📂 Excel file path:', EXCEL_FILE_PATH);
    console.log('──────────────────────────────────────\n');

    // Import all students from Excel
    const result = await importStudentsFromExcel(EXCEL_FILE_PATH);

    // Filter only allowed branches
    const filteredStudents = result.students.filter(student => {
      const normalized = normalizeBranch(student.BRANCH);
      return ALLOWED_BRANCHES.includes(normalized);
    });

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
