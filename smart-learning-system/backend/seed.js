import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Course from './models/Course.js';
import Assignment from './models/Assignment.js';
import Job from './models/Job.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to Database
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-learning';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    // Clean existing data
    console.log('Cleaning existing database collections...');
    await User.deleteMany();
    await Course.deleteMany();
    await Assignment.deleteMany();
    await Job.deleteMany();

    console.log('Seeding database collections...');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'System Admin',
        email: 'admin@smartlearn.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Dr. Sarah Jenkins',
        email: 'sarah@smartlearn.com',
        password: hashedPassword,
        role: 'trainer',
        isActive: true,
      },
      {
        name: 'Prof. Alan Turing',
        email: 'alan@smartlearn.com',
        password: hashedPassword,
        role: 'trainer',
        isActive: true,
      },
      {
        name: 'Alex Mercer',
        email: 'student@smartlearn.com',
        password: hashedPassword,
        role: 'student',
        isActive: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@smartlearn.com',
        password: hashedPassword,
        role: 'student',
        isActive: true,
      }
    ]);

    const adminUser = users.find(u => u.role === 'admin');
    const sarahTrainer = users.find(u => u.email === 'sarah@smartlearn.com');
    const alanTrainer = users.find(u => u.email === 'alan@smartlearn.com');
    const alexStudent = users.find(u => u.email === 'student@smartlearn.com');
    const janeStudent = users.find(u => u.email === 'jane@smartlearn.com');

    console.log('Users seeded successfully! (Admin, Trainers, Students)');

    // 2. Create Courses
    const courses = await Course.insertMany([
      {
        title: 'Full-Stack Web Development with MERN',
        description: 'Learn how to build modern, high-performance web applications using MongoDB, Express, React, and Node.js.',
        instructor: sarahTrainer._id,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        category: 'Web Development',
        price: 99,
        studentsEnrolled: [alexStudent._id, janeStudent._id],
        modules: [
          {
            title: 'Introduction to Node.js & Express',
            description: 'Basics of backend routing, HTTP methods, and middleware configurations.',
            videoUrl: 'https://www.youtube.com/embed/ENrzD9HAZK4',
            pdfUrl: 'https://example.com/express-notes.pdf'
          },
          {
            title: 'MongoDB Schema Design with Mongoose',
            description: 'Defining Mongoose schemas, relationships, validations, and query execution.',
            videoUrl: 'https://www.youtube.com/embed/WDrU305J1yw',
            pdfUrl: 'https://example.com/mongodb-guide.pdf'
          },
          {
            title: 'React State Management & API Integration',
            description: 'Using React Context, custom Hooks, and Axios to integrate with client dashboards.',
            videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
            pdfUrl: 'https://example.com/react-patterns.pdf'
          }
        ]
      },
      {
        title: 'Data Structures & Algorithms in Java',
        description: 'Master essential algorithmic techniques and data structures used by top tech companies.',
        instructor: alanTrainer._id,
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
        category: 'Computer Science',
        price: 149,
        studentsEnrolled: [alexStudent._id],
        modules: [
          {
            title: 'Big O Notation & Complexity Analysis',
            description: 'Understanding time and space complexity models.',
            videoUrl: 'https://www.youtube.com/embed/V6mKRYg1qSg',
            pdfUrl: 'https://example.com/complexity.pdf'
          },
          {
            title: 'Binary Search Trees & Graph Traversals',
            description: 'DFS, BFS, and tree balancing algorithms.',
            videoUrl: 'https://www.youtube.com/embed/pcKY4hjDrxk',
            pdfUrl: 'https://example.com/graphs.pdf'
          }
        ]
      }
    ]);

    const mernCourse = courses.find(c => c.title.includes('MERN'));
    const dsaCourse = courses.find(c => c.title.includes('Data Structures'));

    console.log('Courses seeded successfully!');

    // 3. Create Assignments
    const asgDate = new Date();
    asgDate.setDate(asgDate.getDate() + 7);

    const assignments = await Assignment.insertMany([
      {
        title: 'Build a Bookstore REST API',
        description: 'Implement a CRUD REST API with Express.js for managing a bookstore. Ensure all routes are protected and validate input payload.',
        course: mernCourse._id,
        instructor: sarahTrainer._id,
        dueDate: asgDate,
        totalMarks: 100,
        submissions: [
          {
            student: alexStudent._id,
            fileUrl: 'https://github.com/alexmercer/bookstore-api',
            status: 'submitted'
          },
          {
            student: janeStudent._id,
            fileUrl: 'https://github.com/janesmith/bookstore-express',
            marks: 92,
            feedback: 'Excellent API structure and query optimizations. Keep it up!',
            status: 'graded'
          }
        ]
      },
      {
        title: 'Reverse a Linked List & Detect Cycles',
        description: 'Write recursive and iterative solutions to reverse a singly linked list. Implement Floyds Tortoise and Hare algorithm to detect cycles.',
        course: dsaCourse._id,
        instructor: alanTrainer._id,
        dueDate: asgDate,
        totalMarks: 50,
        submissions: [
          {
            student: alexStudent._id,
            fileUrl: 'https://github.com/alexmercer/dsa-linked-list',
            marks: 48,
            feedback: 'Clean code and correct complexity analysis.',
            status: 'graded'
          }
        ]
      }
    ]);

    console.log('Assignments and submissions seeded successfully!');

    // 4. Create Jobs
    const jobDate = new Date();
    jobDate.setDate(jobDate.getDate() + 15);

    await Job.insertMany([
      {
        title: 'Junior Software Engineer',
        company: 'Google',
        description: 'We are looking for a Junior Software Engineer to join our cloud infrastructure team. Basic knowledge of JS, Node, or Java is required.',
        location: 'Remote / Bangalore, India',
        salary: '$80,000 - $100,000',
        jobType: 'Full-time',
        eligibilityCriteria: 'B.Tech/M.Tech in Computer Science or equivalent. Good understanding of DSA and databases.',
        postedBy: adminUser._id,
        deadline: jobDate,
        applications: [
          {
            student: alexStudent._id,
            resumeUrl: 'https://alexmercer.github.io/resume.pdf',
            coverLetter: 'I am highly passionate about full stack development and infrastructure operations.',
            status: 'under_review'
          }
        ]
      },
      {
        title: 'Frontend Developer Intern',
        company: 'Meta',
        description: 'Join the React core libraries team as a Frontend Intern. Collaborate on styling architectures and core components.',
        location: 'Menlo Park, CA',
        salary: '$6,000 / Month',
        jobType: 'Internship',
        eligibilityCriteria: 'Currently enrolled in CS degree. Proficient with React.js and CSS layouts.',
        postedBy: adminUser._id,
        deadline: jobDate,
        applications: [
          {
            student: janeStudent._id,
            resumeUrl: 'https://janesmith.dev/resume.pdf',
            coverLetter: 'I love building responsive user interfaces and contributing to open source libraries.',
            status: 'applied'
          }
        ]
      }
    ]);

    console.log('Jobs and job applications seeded successfully!');
    console.log('Database seeded fully! Ready for role testing.');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
