const mongoose = require('mongoose');
const Company = require('../models/Company');
const StudentApplication = require('../models/StudentApplication');
const PlacementEvent = require('../models/PlacementEvent');
const StudentProfile = require('../models/StudentProfile');

const seedMockData = async (studentId) => {
    console.log('🌱 Seeding mock data for student:', studentId);

    try {
        // 1. Create Mock Companies
        const companies = [
            {
                name: 'Google',
                industry: 'Technology',
                rolesOffered: ['Software Engineer', 'Product Manager'],
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png',
                description: 'Google is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.',
                website: 'https://google.com',
                eligibilityCriteria: { minCGPA: 8.5, allowedBranches: ['CSE', 'IT', 'ECE'], maxBacklogs: 0 },
                stats: { averagePackage: '25 LPA', highestPackage: '45 LPA' },
                isActive: true
            },
            {
                name: 'Microsoft',
                industry: 'Technology',
                rolesOffered: ['SDE-1', 'Support Engineer'],
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
                description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.',
                website: 'https://microsoft.com',
                eligibilityCriteria: { minCGPA: 8.0, allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'], maxBacklogs: 1 },
                stats: { averagePackage: '20 LPA', highestPackage: '42 LPA' },
                isActive: true
            },
            {
                name: 'Amazon',
                industry: 'E-commerce',
                rolesOffered: ['SDE', 'Data Analyst'],
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
                description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
                website: 'https://amazon.com',
                eligibilityCriteria: { minCGPA: 7.5, allowedBranches: ['All'], maxBacklogs: 0 },
                stats: { averagePackage: '18 LPA', highestPackage: '35 LPA' },
                isActive: true
            },
            {
                name: 'TCS',
                industry: 'IT Services',
                rolesOffered: ['System Engineer', 'Digital'],
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/2560px-Tata_Consultancy_Services_Logo.svg.png',
                description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
                website: 'https://tcs.com',
                eligibilityCriteria: { minCGPA: 6.5, allowedBranches: ['All'], maxBacklogs: 2 },
                stats: { averagePackage: '4 LPA', highestPackage: '7 LPA' },
                isActive: true
            }
        ];

        const createdCompanies = [];
        for (const companyData of companies) {
            let company = await Company.findOne({ name: companyData.name });
            if (!company) {
                company = await Company.create(companyData);
                console.log('✅ Created company:', company.name);
            }
            createdCompanies.push(company);
        }

        // 2. Create Applications for the Student
        // Check if student already has applications
        const existingApps = await StudentApplication.find({ studentId });

        if (existingApps.length === 0) {
            // Apply to Google (Selected)
            await StudentApplication.create({
                studentId,
                companyId: createdCompanies[0]._id,
                status: 'selected',
                currentStage: 5,
                stageHistory: [
                    { stageNumber: 1, stageName: 'Applied', status: 'cleared', completedDate: new Date('2024-01-01') },
                    { stageNumber: 2, stageName: 'Online Assessment', status: 'cleared', score: '95/100', completedDate: new Date('2024-01-05') },
                    { stageNumber: 3, stageName: 'Technical Interview 1', status: 'cleared', feedback: 'Strong DSA skills', completedDate: new Date('2024-01-10') },
                    { stageNumber: 4, stageName: 'Technical Interview 2', status: 'cleared', completedDate: new Date('2024-01-12') },
                    { stageNumber: 5, stageName: 'HR Interview', status: 'cleared', completedDate: new Date('2024-01-15') }
                ],
                outcome: {
                    selected: true,
                    package: '25 LPA',
                    role: 'Software Engineer',
                    joiningDate: new Date('2024-06-01')
                },
                appliedDate: new Date('2024-01-01')
            });

            // Apply to Microsoft (In Progress)
            await StudentApplication.create({
                studentId,
                companyId: createdCompanies[1]._id,
                status: 'in-progress',
                currentStage: 3,
                stageHistory: [
                    { stageNumber: 1, stageName: 'Applied', status: 'cleared', completedDate: new Date('2024-02-01') },
                    { stageNumber: 2, stageName: 'Online Assessment', status: 'cleared', score: '88/100', completedDate: new Date('2024-02-05') }
                ],
                appliedDate: new Date('2024-02-01')
            });

            // Apply to TCS (Rejected)
            await StudentApplication.create({
                studentId,
                companyId: createdCompanies[3]._id,
                status: 'rejected',
                currentStage: 2,
                stageHistory: [
                    { stageNumber: 1, stageName: 'Applied', status: 'cleared', completedDate: new Date('2023-12-01') },
                    { stageNumber: 2, stageName: 'Online Assessment', status: 'failed', score: '40/100', completedDate: new Date('2023-12-05') }
                ],
                appliedDate: new Date('2023-12-01')
            });

            console.log('✅ Created mock applications');
        }

        // 3. Create Events
        const existingEvents = await PlacementEvent.find({});
        if (existingEvents.length === 0) {
            // Google Event
            await PlacementEvent.create({
                companyId: createdCompanies[0]._id,
                title: 'Google Pre-Placement Talk',
                description: 'Learn about life at Google and our hiring process.',
                eventType: 'pre-placement',
                startDate: new Date(Date.now() + 86400000), // Tomorrow
                endDate: new Date(Date.now() + 90000000),
                location: 'Main Auditorium',
                mode: 'offline',
                participants: [{ studentId, status: 'registered' }]
            });

            // Microsoft Event
            await PlacementEvent.create({
                companyId: createdCompanies[1]._id,
                title: 'Microsoft Coding Contest',
                description: 'Online coding round for SDE roles.',
                eventType: 'test',
                startDate: new Date(Date.now() + 172800000), // Day after tomorrow
                endDate: new Date(Date.now() + 180000000),
                isOnline: true,
                meetingLink: 'https://hackerrank.com/microsoft-challenge',
                mode: 'online'
            });

            console.log('✅ Created mock events');
        }

        // 4. Update Student Profile Stats
        const profile = await StudentProfile.findOne({ studentId });
        if (profile) {
            await profile.updatePlacementStats();
            console.log('✅ Updated profile stats');
        }

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
};

module.exports = seedMockData;
