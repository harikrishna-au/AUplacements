const XLSX = require('xlsx');
const Student = require('../models/Student');

/**
 * Import students from Excel file
 * Place your Excel file in backend/data/students.xlsx
 */
async function importStudentsFromExcel(filePath) {
  try {
    console.log('📊 Reading Excel file...');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📋 Found ${data.length} students in Excel`);

    let imported = 0;
    let skipped = 0;

    for (const row of data) {
      try {
        // Extract roll number and generate college email
        const registerNumber = row['University  Register  Number  ']?.toString().trim();
        if (!registerNumber) {
          console.log(`⚠️  Skipping row - no register number`);
          skipped++;
          continue;
        }

        const collegeEmail = `${registerNumber}@andhrauniversity.edu.in`.toLowerCase();

        // Check if student already exists
        const existing = await Student.findById(registerNumber);
        if (existing) {
          console.log(`⏭️  Skipping ${registerNumber} - already exists`);
          skipped++;
          continue;
        }

        // Filter by allowed branches
        const branch = row['BRANCH'];
        const normalizedBranch = branch ? branch.toString().trim().replace(/\s+/g, ' ').replace(/–/g, '-').toLowerCase() : '';
        const allowedBranches = [
          'b.tech-computer science & engineering',
          'b.tech-information technology',
          'integrated dual degree (b.tech+m.tech) - cse',
        ];
        
        if (!allowedBranches.includes(normalizedBranch)) {
          console.log(`⏭️  Skipping ${registerNumber} - branch not allowed: ${branch}`);
          skipped++;
          continue;
        }

        // Handle standingBacklogs conversion
        let standingBacklogs = 0;
        const backlogValue = row['No of Standing Backlogs'];
        if (backlogValue && backlogValue.toString().toLowerCase().includes('above')) {
          standingBacklogs = 1; // Convert "1 & Above" to 1
        } else if (backlogValue && !isNaN(backlogValue)) {
          standingBacklogs = parseInt(backlogValue);
        }

        // Create student record with _id set to registerNumber
        const student = new Student({
          _id: registerNumber,
          slNo: row['Sl.No'],
          universityRegisterNumber: registerNumber,
          fullName: row['Student Full name (As per AUCC Records)'],
          gender: row['Gender'],
          nationality: row['Nationality'],
          dateOfBirth: row['Date  of Birth (As per Birth Certificate/10th certificate )'],
          collegeName: row['College name'],
          course: row['COURSE'],
          branch: row['BRANCH'],
          personalEmail: row['Personal Mail ID'],
          collegeEmail: collegeEmail,
          tenthCGPA: row['10th CGPA'],
          tenthBoard: row['10th Board name'],
          tenthYearOfPass: row['10th Year of Pass'],
          twelfthPercentage: row['12th Percentage'],
          twelfthBoard: row['12th Board name'],
          twelfthYearOfPass: row['12th Year of Pass'],
          diplomaPercentage: row['Diploma Percentage'],
          diplomaBoard: row['Diploma Board'],
          diplomaState: row['Diploma studied state'],
          diplomaYearOfPass: row['Diploma Year of Pass'],
          auccCGPA: row['AUCC- 3-2   Results (CGPA)'],
          standingBacklogs: standingBacklogs,
          btechYearOfPass: row['BTech Year of Pass'],
          hasBacklogHistory: row['Did you ever fail any subject in your BTech/BArch  Engineering course? ( HISTORY OF BACKLOGS)'],
          completedInTime: row['Have you completed 12th within 2 years from completing 10th, or Diploma in any Engineering stream within 3 years from completing 10th.'],
          admissionEntranceTest: row['Admission Entrance test'],
          entranceTestRank: row['Entrance Test RANK (EAMCET/AUEET/ECET)'],
          category: row['Category'],
          isPwD: row['Are you PwD (Person with Disabilities )'],
          pwdDetails: row['If  YES,  Mention Disease and Percentage of disability  \n\nIf No keep N/A'],
          hasPAN: row['Do You have PAN card'],
          hasPassport: row['Do You Have INDIAN PASSPORT ?'],
          hasLaptop: row['DO YOU HAVE PESONAL LAPTOP WITH WEBCAM PLUS HEADPHONES?'],
          hasInternet: row['DO YOU HAVE HIGHSPEED INTERNET DONGLE?']
        });

        await student.save();
        console.log(`✅ Imported: ${student.fullName} (${registerNumber})`);
        imported++;

      } catch (error) {
        console.error(`❌ Error importing row:`, error.message);
        skipped++;
      }
    }

    console.log(`\n✨ Import complete!`);
    console.log(`   Imported: ${imported}`);
    console.log(`   Skipped: ${skipped}`);
    
    return { imported, skipped, total: data.length };

  } catch (error) {
    console.error('❌ Error reading Excel file:', error.message);
    throw error;
  }
}

module.exports = { importStudentsFromExcel };
