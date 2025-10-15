const mongoose = require('mongoose');
require('dotenv').config();
const Company = require('../models/Company');

const companies = [
  {
    name: "TCS",
    logo: "https://logo.clearbit.com/tcs.com",
    description: "Tata Consultancy Services is an IT services, consulting and business solutions organization",
    industry: "IT Services",
    website: "https://www.tcs.com",
    rolesOffered: ["Digital", "Ninja", "Smart Hiring"],
    eligibilityCriteria: {
      minCGPA: 6.0,
      allowedBranches: ["CSE", "IT", "ECE", "EEE", "Mech"],
      maxBacklogs: 2,
      graduationYear: [2024, 2025]
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1, description: "Application submitted" },
      { stageName: "Aptitude Test", order: 2, description: "TCS NQT Assessment" },
      { stageName: "Technical Interview", order: 3, description: "Technical round" },
      { stageName: "HR Interview", order: 4, description: "HR discussion" },
      { stageName: "Offer", order: 5, description: "Offer letter issued" }
    ],
    stats: {
      totalApplications: 0,
      totalSelected: 0,
      averagePackage: "3.5 LPA",
      highestPackage: "7 LPA"
    },
    isActive: true
  },
  {
    name: "Infosys",
    logo: "https://logo.clearbit.com/infosys.com",
    description: "Infosys is a global leader in next-generation digital services and consulting",
    industry: "IT Services",
    website: "https://www.infosys.com",
    rolesOffered: ["Systems Engineer", "Power Programmer", "Digital Specialist"],
    eligibilityCriteria: {
      minCGPA: 6.5,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      maxBacklogs: 0,
      graduationYear: [2024, 2025]
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Online Assessment", order: 2 },
      { stageName: "Technical Interview", order: 3 },
      { stageName: "HR Interview", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "3.6 LPA",
      highestPackage: "9 LPA"
    },
    isActive: true
  },
  {
    name: "Wipro",
    logo: "https://logo.clearbit.com/wipro.com",
    description: "Wipro Limited is a leading technology services and consulting company",
    industry: "IT Services",
    website: "https://www.wipro.com",
    rolesOffered: ["Project Engineer", "WILP"],
    eligibilityCriteria: {
      minCGPA: 6.0,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      maxBacklogs: 2
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "WILP Test", order: 2 },
      { stageName: "Technical Round", order: 3 },
      { stageName: "HR Round", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "3.5 LPA",
      highestPackage: "6 LPA"
    },
    isActive: true
  },
  {
    name: "Google",
    logo: "https://logo.clearbit.com/google.com",
    description: "Google LLC is an American multinational technology company",
    industry: "Technology",
    website: "https://careers.google.com",
    rolesOffered: ["SDE", "SRE", "Data Engineer"],
    eligibilityCriteria: {
      minCGPA: 7.5,
      allowedBranches: ["CSE", "IT"],
      maxBacklogs: 0
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Online Assessment", order: 2 },
      { stageName: "Phone Screen", order: 3 },
      { stageName: "Onsite Interviews", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "18 LPA",
      highestPackage: "30 LPA"
    },
    isActive: true
  },
  {
    name: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    description: "Microsoft Corporation is an American multinational technology corporation",
    industry: "Technology",
    website: "https://careers.microsoft.com",
    rolesOffered: ["SDE", "Cloud Engineer", "Data Scientist"],
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedBranches: ["CSE", "IT", "ECE"],
      maxBacklogs: 0
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Coding Test", order: 2 },
      { stageName: "Technical Interviews", order: 3 },
      { stageName: "AA Interview", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "16 LPA",
      highestPackage: "42 LPA"
    },
    isActive: true
  },
  {
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    description: "Amazon.com, Inc. is an American multinational technology company",
    industry: "E-commerce & Cloud",
    website: "https://www.amazon.jobs",
    rolesOffered: ["SDE-1", "Support Engineer"],
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedBranches: ["CSE", "IT", "ECE"],
      maxBacklogs: 0
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Online Assessment", order: 2 },
      { stageName: "Technical Round 1", order: 3 },
      { stageName: "Technical Round 2", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "15 LPA",
      highestPackage: "28 LPA"
    },
    isActive: true
  },
  {
    name: "Cognizant",
    logo: "https://logo.clearbit.com/cognizant.com",
    description: "Cognizant is an American multinational IT services and consulting company",
    industry: "IT Services",
    website: "https://careers.cognizant.com",
    rolesOffered: ["Programmer Analyst", "Gen C"],
    eligibilityCriteria: {
      minCGPA: 6.5,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      maxBacklogs: 1
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Aptitude Test", order: 2 },
      { stageName: "Technical Interview", order: 3 },
      { stageName: "HR Interview", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "4 LPA",
      highestPackage: "7 LPA"
    },
    isActive: true
  },
  {
    name: "Accenture",
    logo: "https://logo.clearbit.com/accenture.com",
    description: "Accenture is a global professional services company",
    industry: "Consulting & IT",
    website: "https://www.accenture.com/careers",
    rolesOffered: ["ASE", "Analyst"],
    eligibilityCriteria: {
      minCGPA: 6.5,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      maxBacklogs: 0
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Online Test", order: 2 },
      { stageName: "Technical Interview", order: 3 },
      { stageName: "HR Interview", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "4.5 LPA",
      highestPackage: "8 LPA"
    },
    isActive: true
  },
  {
    name: "IBM",
    logo: "https://logo.clearbit.com/ibm.com",
    description: "IBM is an American multinational technology corporation",
    industry: "Technology",
    website: "https://www.ibm.com/employment",
    rolesOffered: ["Application Developer", "Associate System Engineer"],
    eligibilityCriteria: {
      minCGPA: 6.5,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      maxBacklogs: 0
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Cognitive Ability Test", order: 2 },
      { stageName: "Technical Interview", order: 3 },
      { stageName: "HR Interview", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "3.8 LPA",
      highestPackage: "6 LPA"
    },
    isActive: true
  },
  {
    name: "Capgemini",
    logo: "https://logo.clearbit.com/capgemini.com",
    description: "Capgemini is a global leader in consulting, technology services and digital transformation",
    industry: "IT Services",
    website: "https://www.capgemini.com/careers",
    rolesOffered: ["Analyst", "Senior Analyst"],
    eligibilityCriteria: {
      minCGPA: 6.0,
      allowedBranches: ["CSE", "IT", "ECE", "EEE"],
      maxBacklogs: 2
    },
    recruitmentStages: [
      { stageName: "Applied", order: 1 },
      { stageName: "Aptitude Test", order: 2 },
      { stageName: "Technical Interview", order: 3 },
      { stageName: "HR Interview", order: 4 },
      { stageName: "Offer", order: 5 }
    ],
    stats: {
      averagePackage: "3.8 LPA",
      highestPackage: "6 LPA"
    },
    isActive: true
  }
];

async function seedCompanies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing companies (optional - comment out if you want to keep existing data)
    await Company.deleteMany({});
    console.log('🗑️  Cleared existing companies');

    // Insert companies
    const result = await Company.insertMany(companies);
    console.log(`✅ Successfully seeded ${result.length} companies`);

    // Display inserted companies
    result.forEach(company => {
      console.log(`   - ${company.name} (ID: ${company._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding companies:', error);
    process.exit(1);
  }
}

seedCompanies();
