const mongoose = require('mongoose');
require('dotenv').config();
const PlacementEvent = require('../models/PlacementEvent');
const Company = require('../models/Company');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedEvents = async () => {
  try {
    await connectDB();

    // Get all companies
    const companies = await Company.find();
    if (companies.length === 0) {
      console.log('❌ No companies found. Please run seedCompanies.js first.');
      process.exit(1);
    }

    // Clear existing events
    await PlacementEvent.deleteMany();
    console.log('🗑️  Cleared existing events');

    // Get company IDs
    const tcs = companies.find(c => c.name === 'TCS');
    const infosys = companies.find(c => c.name === 'Infosys');
    const wipro = companies.find(c => c.name === 'Wipro');
    const google = companies.find(c => c.name === 'Google');
    const microsoft = companies.find(c => c.name === 'Microsoft');
    const amazon = companies.find(c => c.name === 'Amazon');
    const cognizant = companies.find(c => c.name === 'Cognizant');
    const accenture = companies.find(c => c.name === 'Accenture');
    const ibm = companies.find(c => c.name === 'IBM');
    const capgemini = companies.find(c => c.name === 'Capgemini');

    const events = [
      {
        companyId: tcs._id,
        title: 'TCS Pre-Placement Talk',
        description: 'TCS will present about company culture, work environment, and available opportunities for fresh graduates.',
        eventType: 'pre-placement-talk',
        startDate: new Date('2025-10-16T10:00:00'),
        endDate: new Date('2025-10-16T12:00:00'),
        location: 'Main Auditorium',
        venue: 'Main Auditorium',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        eligibleBatches: ['2025'],
        stageNumber: 1,
        status: 'scheduled'
      },
      {
        companyId: infosys._id,
        title: 'Infosys Online Aptitude Test',
        description: 'Online aptitude and technical test for all shortlisted candidates. Topics: Quantitative, Logical Reasoning, Verbal, Technical.',
        eventType: 'aptitude-test',
        startDate: new Date('2025-10-18T09:00:00'),
        endDate: new Date('2025-10-18T11:00:00'),
        location: 'Online',
        venue: 'Online Platform',
        isOnline: true,
        meetingLink: 'https://infosys.assessment.com/test',
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        eligibleBatches: ['2025'],
        stageNumber: 2,
        status: 'scheduled'
      },
      {
        companyId: wipro._id,
        title: 'Wipro Technical Interview Round 1',
        description: 'First round of technical interviews. Topics: Data Structures, Algorithms, Java/Python, Database concepts.',
        eventType: 'technical-interview',
        startDate: new Date('2025-10-20T14:00:00'),
        endDate: new Date('2025-10-20T17:00:00'),
        location: 'Block B, Room 201',
        venue: 'Block B, Room 201',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT'],
        eligibleBatches: ['2025'],
        stageNumber: 3,
        status: 'scheduled'
      },
      {
        companyId: google._id,
        title: 'Google Campus Recruitment Drive',
        description: 'Full day campus recruitment drive including coding test, technical interviews, and HR round.',
        eventType: 'placement-drive',
        startDate: new Date('2025-10-22T09:00:00'),
        endDate: new Date('2025-10-22T18:00:00'),
        location: 'IT Block',
        venue: 'IT Block - All Floors',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT'],
        eligibleBatches: ['2025'],
        status: 'scheduled'
      },
      {
        companyId: microsoft._id,
        title: 'Microsoft HR Interview',
        description: 'Final round HR interviews for shortlisted candidates. Discuss role expectations, salary, and cultural fit.',
        eventType: 'hr-interview',
        startDate: new Date('2025-10-24T10:00:00'),
        endDate: new Date('2025-10-24T13:00:00'),
        location: 'Conference Room',
        venue: 'Main Conference Room',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT'],
        eligibleBatches: ['2025'],
        stageNumber: 5,
        status: 'scheduled'
      },
      {
        companyId: amazon._id,
        title: 'Amazon Online Coding Assessment',
        description: 'Online coding round with 2-3 DSA problems. Duration: 90 minutes. Platform: Amazon Assessment Portal.',
        eventType: 'aptitude-test',
        startDate: new Date('2025-10-25T11:00:00'),
        endDate: new Date('2025-10-25T14:00:00'),
        location: 'Online',
        venue: 'Online Platform',
        isOnline: true,
        meetingLink: 'https://amazon.jobs/assessment',
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        eligibleBatches: ['2025'],
        stageNumber: 2,
        status: 'scheduled'
      },
      {
        companyId: cognizant._id,
        title: 'Cognizant Pre-Placement Talk',
        description: 'Introduction to Cognizant, available positions, training programs, and career growth opportunities.',
        eventType: 'pre-placement-talk',
        startDate: new Date('2025-10-28T11:00:00'),
        endDate: new Date('2025-10-28T13:00:00'),
        location: 'Seminar Hall',
        venue: 'Seminar Hall, Block C',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        eligibleBatches: ['2025'],
        stageNumber: 1,
        status: 'scheduled'
      },
      {
        companyId: accenture._id,
        title: 'Accenture Group Discussion',
        description: 'Group discussion round for shortlisted candidates. Topics: Current affairs, technology trends, business scenarios.',
        eventType: 'group-discussion',
        startDate: new Date('2025-10-30T10:00:00'),
        endDate: new Date('2025-10-30T15:00:00'),
        location: 'Block A, Floor 3',
        venue: 'Block A, Floor 3 - Rooms 301-305',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        eligibleBatches: ['2025'],
        stageNumber: 3,
        status: 'scheduled'
      },
      {
        companyId: ibm._id,
        title: 'IBM Technical Assessment',
        description: 'Online technical assessment covering programming, system design, and cloud computing concepts.',
        eventType: 'aptitude-test',
        startDate: new Date('2025-11-02T09:00:00'),
        endDate: new Date('2025-11-02T11:30:00'),
        location: 'Online',
        venue: 'Online Platform',
        isOnline: true,
        meetingLink: 'https://ibm.com/assessment',
        eligibleBranches: ['CSE', 'IT'],
        eligibleBatches: ['2025'],
        stageNumber: 2,
        status: 'scheduled'
      },
      {
        companyId: capgemini._id,
        title: 'Capgemini Campus Drive',
        description: 'Full day recruitment process including aptitude test, technical interview, and HR interview.',
        eventType: 'placement-drive',
        startDate: new Date('2025-11-05T09:00:00'),
        endDate: new Date('2025-11-05T17:00:00'),
        location: 'Main Campus',
        venue: 'Main Campus - Multiple Venues',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        eligibleBatches: ['2025'],
        status: 'scheduled'
      },
      // Additional events for better calendar coverage
      {
        companyId: tcs._id,
        title: 'TCS Online Test',
        description: 'Online aptitude and coding test',
        eventType: 'aptitude-test',
        startDate: new Date('2025-10-17T14:00:00'),
        endDate: new Date('2025-10-17T16:00:00'),
        location: 'Online',
        venue: 'Online Platform',
        isOnline: true,
        meetingLink: 'https://tcs.assessment.com',
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        eligibleBatches: ['2025'],
        stageNumber: 2,
        status: 'scheduled'
      },
      {
        companyId: google._id,
        title: 'Google Technical Interview',
        description: 'One-on-one technical interview with Google engineers',
        eventType: 'technical-interview',
        startDate: new Date('2025-10-23T10:00:00'),
        endDate: new Date('2025-10-23T13:00:00'),
        location: 'Online',
        venue: 'Google Meet',
        isOnline: true,
        meetingLink: 'https://meet.google.com/xxx-yyyy-zzz',
        eligibleBranches: ['CSE', 'IT'],
        eligibleBatches: ['2025'],
        stageNumber: 3,
        status: 'scheduled'
      },
      {
        companyId: microsoft._id,
        title: 'Microsoft Coding Challenge',
        description: 'Timed coding challenge on LeetCode platform',
        eventType: 'aptitude-test',
        startDate: new Date('2025-10-19T15:00:00'),
        endDate: new Date('2025-10-19T17:00:00'),
        location: 'Online',
        venue: 'LeetCode',
        isOnline: true,
        meetingLink: 'https://leetcode.com/contest/microsoft',
        eligibleBranches: ['CSE', 'IT'],
        eligibleBatches: ['2025'],
        stageNumber: 2,
        status: 'scheduled'
      },
      {
        companyId: amazon._id,
        title: 'Amazon Result Announcement',
        description: 'Final selection results will be announced',
        eventType: 'result',
        startDate: new Date('2025-10-26T16:00:00'),
        endDate: new Date('2025-10-26T17:00:00'),
        location: 'Main Auditorium',
        venue: 'Main Auditorium',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        eligibleBatches: ['2025'],
        stageNumber: 6,
        status: 'scheduled'
      },
      {
        companyId: wipro._id,
        title: 'Wipro HR Round',
        description: 'Final HR interview round',
        eventType: 'hr-interview',
        startDate: new Date('2025-10-21T11:00:00'),
        endDate: new Date('2025-10-21T14:00:00'),
        location: 'Block B, Room 202',
        venue: 'Block B, Room 202',
        isOnline: false,
        eligibleBranches: ['CSE', 'IT'],
        eligibleBatches: ['2025'],
        stageNumber: 4,
        status: 'scheduled'
      }
    ];

    await PlacementEvent.insertMany(events);
    console.log(`✅ Successfully seeded ${events.length} events`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
