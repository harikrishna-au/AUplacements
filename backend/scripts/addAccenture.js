const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hari:root@auplacements.jzbstxr.mongodb.net/auplacements')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Company = require('../models/Company');

async function addAccenture() {
  try {
    // Check if Accenture already exists
    const existing = await Company.findOne({ name: 'Accenture' });
    if (existing) {
      console.log('⚠️  Accenture already exists. Deleting old one...');
      await Company.deleteOne({ name: 'Accenture' });
    }

    // Create Accenture company with all events
    const accenture = new Company({
      name: "Accenture",
      logo: "https://logo.clearbit.com/accenture.com",
      description: "Accenture is a global professional services company that provides strategy, consulting, digital, technology and operations services.",
      industry: "Information Technology and Consulting",
      website: "https://www.accenture.com",
      
      rolesOffered: [
        "Associate Software Engineer",
        "Software Developer"
      ],
      
      eligibilityCriteria: {
        minCGPA: 6.5,
        allowedBranches: [
          "CSE", 
          "IT", 
          "ECE", 
          "EEE",
          "INTEGRATED DUAL DEGREE (B.Tech+M.Tech) - CSE",
          "INTEGRATED DUAL DEGREE (B.E+M.E) - ELECTRONICS AND COMMUNICATIONS ENGINEERING",
          "INTEGRATED DUAL DEGREE (B.E+M.E) - ELECTRICAL AND ELECTRONICS ENGINEERING",
          "Computer Science and Engineering",
          "B.TECH-INFORMATION TECHNOLOGY",
          "B.TECH-COMPUTER SCIENCE AND ENGINEERING",
          "B.E-ELECTRONICS AND COMMUNICATIONS ENGINEERING",
          "B.E-ELECTRICAL AND ELECTRONICS ENGINEERING"
        ],
        maxBacklogs: 1,
        graduationYear: [2026]
      },
      
      recruitmentStages: [
        {
          stageName: "Aptitude Test",
          order: 1,
          description: "Online aptitude and reasoning test."
        },
        {
          stageName: "Technical Interview",
          order: 2,
          description: "In-depth technical interview covering core subjects and projects."
        },
        {
          stageName: "HR Interview",
          order: 3,
          description: "Final HR discussion focusing on communication and cultural fit."
        }
      ],
      
      stats: {
        totalApplications: 0,
        totalSelected: 0,
        averagePackage: "₹4.5 LPA",
        highestPackage: "₹6 LPA"
      },
      
      isActive: true,
      isCampusDrive: true,
      
      registrationDeadline: new Date("2025-11-15T00:00:00.000Z"),
      placementDriveDate: new Date("2025-12-01T00:00:00.000Z"),
      
      events: [
        {
          title: "Pre-Placement Talk",
          type: "pre-placement",
          description: "Introduction to Accenture's recruitment process and company culture.",
          startDate: new Date("2025-10-25T10:00:00.000Z"),
          endDate: new Date("2025-10-25T12:00:00.000Z"),
          location: "Seminar Hall A, Main Block",
          mode: "offline",
          maxCapacity: 200,
          participants: []
        },
        {
          title: "Online Aptitude & Cognitive Test",
          type: "test",
          description: "Aptitude and reasoning assessment hosted online.",
          startDate: new Date("2025-10-27T09:00:00.000Z"),
          endDate: new Date("2025-10-27T11:00:00.000Z"),
          location: "Online Portal",
          mode: "online",
          maxCapacity: 500,
          participants: []
        },
        {
          title: "Coding Assessment",
          type: "test",
          description: "Technical coding round to assess programming skills.",
          startDate: new Date("2025-10-30T14:00:00.000Z"),
          endDate: new Date("2025-10-30T16:00:00.000Z"),
          location: "Online Platform",
          mode: "online",
          maxCapacity: 300,
          participants: []
        },
        {
          title: "Technical Interview - Round 1",
          type: "interview",
          description: "First round of technical interviews focusing on DSA and core CS concepts.",
          startDate: new Date("2025-11-05T09:00:00.000Z"),
          endDate: new Date("2025-11-05T17:00:00.000Z"),
          location: "Placement Office, Block B",
          mode: "offline",
          maxCapacity: 100,
          participants: []
        },
        {
          title: "Technical Interview - Round 2",
          type: "interview",
          description: "Advanced technical round covering system design and projects.",
          startDate: new Date("2025-11-08T09:00:00.000Z"),
          endDate: new Date("2025-11-08T17:00:00.000Z"),
          location: "Placement Office, Block B",
          mode: "offline",
          maxCapacity: 50,
          participants: []
        },
        {
          title: "HR Interview",
          type: "interview",
          description: "Final HR discussion focusing on communication and cultural fit.",
          startDate: new Date("2025-11-12T10:00:00.000Z"),
          endDate: new Date("2025-11-12T16:00:00.000Z"),
          location: "Conference Room, Block C",
          mode: "offline",
          maxCapacity: 30,
          participants: []
        },
        {
          title: "Results Announcement",
          type: "result",
          description: "Final selection results will be announced.",
          startDate: new Date("2025-11-15T15:00:00.000Z"),
          endDate: new Date("2025-11-15T16:00:00.000Z"),
          location: "Main Auditorium",
          mode: "offline",
          maxCapacity: 200,
          participants: []
        }
      ],
      
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await accenture.save();
    
    console.log('✅ Accenture company created successfully!');
    console.log('📊 Company ID:', accenture._id);
    console.log('📅 Total Events:', accenture.events.length);
    console.log('\n📋 Events:');
    accenture.events.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.title} (${event.type}) - ${new Date(event.startDate).toLocaleDateString()}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating company:', error);
    process.exit(1);
  }
}

addAccenture();
