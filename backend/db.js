import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const DATA_DIR = path.resolve('data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure JSON files exist
const initJsonFile = (fileName, defaultData) => {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

const defaultMentors = [
  {
    _id: "m1",
    name: "Alex Rivera",
    email: "alex.rivera@alumni.edu",
    domain: "Software Engineering",
    experience: 8,
    bio: "Tech Lead at Google. Alumni of Class of 2018. Passionate about helping students break into tech, system design, and career growth.",
    availability: ["Mon, Wed: 6:00 PM - 8:00 PM", "Sat: 10:00 AM - 2:00 PM"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 4.9,
    skills: ["System Design", "Go", "Java", "Kubernetes", "React"]
  },
  {
    _id: "m2",
    name: "Priya Sharma",
    email: "priya.sharma@alumni.edu",
    domain: "Data Science",
    experience: 5,
    bio: "Senior Data Scientist at Netflix. Class of 2021. Specializes in Machine Learning, recommendation engines, and interview prep.",
    availability: ["Tue, Thu: 5:00 PM - 7:00 PM"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 4.8,
    skills: ["Python", "TensorFlow", "SQL", "Machine Learning", "AB Testing"]
  },
  {
    _id: "m3",
    name: "Marcus Vance",
    email: "marcus.v@alumni.edu",
    domain: "Product Management",
    experience: 10,
    bio: "Principal Product Manager at Amazon. Alumni of Class of 2016. Can help with PM interview prep, product strategy, and resume reviews.",
    availability: ["Fri: 3:00 PM - 6:00 PM", "Sun: 1:00 PM - 4:00 PM"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    rating: 5.0,
    skills: ["Product Strategy", "Product Roadmap", "UX Research", "Metrics"]
  },
  {
    _id: "m4",
    name: "Elena Rostova",
    email: "elena.r@alumni.edu",
    domain: "UX Design",
    experience: 6,
    bio: "Senior UX Designer at Airbnb. Alumni of Class of 2020. Helping students with portfolio reviews, UI/UX methodologies, and design thinking.",
    availability: ["Sat, Sun: 2:00 PM - 5:00 PM"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 4.7,
    skills: ["Figma", "User Research", "Wireframing", "Interaction Design"]
  }
];

const defaultBookings = [
  {
    _id: "b1",
    mentorId: "m1",
    mentorName: "Alex Rivera",
    studentName: "John Doe",
    studentEmail: "john.doe@student.edu",
    date: "2026-07-10",
    timeSlot: "6:00 PM - 7:00 PM",
    topic: "System Design Mock Interview",
    description: "I have an upcoming interview and would love to practice system design, specifically scaling a web application.",
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    _id: "b2",
    mentorId: "m2",
    mentorName: "Priya Sharma",
    studentName: "Sarah Chen",
    studentEmail: "sarah.c@student.edu",
    date: "2026-07-08",
    timeSlot: "5:00 PM - 6:00 PM",
    topic: "Career Advice & Transition",
    description: "Switching from Software Engineering to Data Science. Want to understand what projects to focus on.",
    status: "Approved",
    createdAt: new Date().toISOString()
  }
];

const defaultPosts = [
  {
    _id: "p1",
    title: "How to prepare for FAANG PM interviews?",
    content: "Hi everyone! I am currently a senior student planning to apply for Associate Product Manager (APM) roles. I wanted to ask the alumni here about the structure of product design and metrics questions, and what resources you recommend. Thank you!",
    category: "Career Advice",
    authorName: "Kevin Liu",
    authorRole: "Student",
    likes: 12,
    likedBy: [],
    comments: [
      {
        _id: "c1",
        content: "I recommend checking out 'Decode and Conquer' and 'Cracking the PM Interview'. They are the gold standards. Also, practice mock interviews on platforms like Stella or with alumni here!",
        authorName: "Marcus Vance",
        authorRole: "Alumni",
        createdAt: new Date().toISOString()
      },
      {
        _id: "c2",
        content: "Totally agree with Marcus. Focus heavily on structure. Never jump straight into the solution; always define the user personas first.",
        authorName: "Elena Rostova",
        authorRole: "Alumni",
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: "p2",
    title: "Is it worth learning Kubernetes in college?",
    content: "I am a sophomore and seeing Kubernetes listed in almost every software engineering job description. Should I spend time learning it now, or focus more on core DS & Algo?",
    category: "Technical Questions",
    authorName: "Aarav Patel",
    authorRole: "Student",
    likes: 8,
    likedBy: [],
    comments: [
      {
        _id: "c3",
        content: "Focus 80% on DS & Algo first to get past interviews. However, understanding the basics of Docker and Kubernetes will give you a massive edge in team projects and internships. Learn it on the side!",
        authorName: "Alex Rivera",
        authorRole: "Alumni",
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  }
];

const adminPassDefault = bcrypt.hashSync('admin123', 10);
const studentPassDefault = bcrypt.hashSync('student123', 10);
const defaultUsers = [
  { _id: "u1", name: "Admin User", email: "admin@synapse.com", password: adminPassDefault, role: "admin", createdAt: new Date().toISOString() },
  { _id: "u2", name: "Student User", email: "student@synapse.com", password: studentPassDefault, role: "student", createdAt: new Date().toISOString() }
];

initJsonFile('mentors.json', defaultMentors);
initJsonFile('bookings.json', defaultBookings);
initJsonFile('forum.json', defaultPosts);
initJsonFile('users.json', defaultUsers);
initJsonFile('subscribers.json', []);

// Define Mongoose Schemas (if MongoDB is running)
const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  domain: { type: String, required: true },
  experience: { type: Number, required: true },
  bio: { type: String, required: true },
  availability: [String],
  avatar: String,
  rating: { type: Number, default: 4.8 },
  skills: [String]
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  mentorId: { type: String, required: true },
  mentorName: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true }
}, { timestamps: true });

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [String],
  comments: [commentSchema]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

let MentorModel;
let BookingModel;
let ForumPostModel;
let UserModel;
let SubscriberModel;

let isMongoConnected = false;

// Attempt MongoDB connection
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.warn("⚠️ No MONGODB_URI found in environmental variables. Falling back to local JSON database storage.");
    return false;
  }
  try {
    // Attempt connection with a short timeout
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log("🚀 MongoDB connected successfully!");
    
    // Compile models
    MentorModel = mongoose.model('Mentor', mentorSchema);
    BookingModel = mongoose.model('Booking', bookingSchema);
    ForumPostModel = mongoose.model('ForumPost', forumPostSchema);
    UserModel = mongoose.model('User', userSchema);
    SubscriberModel = mongoose.model('Subscriber', subscriberSchema);
    
    isMongoConnected = true;
    
    // Seed initial data if MongoDB collections are empty
    await seedMongoIfEmpty();
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.warn("⚠️ Falling back to local JSON database storage.");
    isMongoConnected = false;
    return false;
  }
};

const seedMongoIfEmpty = async () => {
  try {
    const mentorCount = await MentorModel.countDocuments();
    if (mentorCount === 0) {
      await MentorModel.insertMany(defaultMentors.map(m => {
        const { _id, ...rest } = m;
        return rest; // Let Mongo generate its own ObjectIds
      }));
      console.log("🌱 Seeded Mentors to MongoDB");
    }
    
    const bookingCount = await BookingModel.countDocuments();
    if (bookingCount === 0) {
      // Map to valid DB entries
      const mentors = await MentorModel.find();
      const updatedBookings = defaultBookings.map((b, idx) => {
        const { _id, ...rest } = b;
        rest.mentorId = mentors[idx % mentors.length]._id.toString();
        rest.mentorName = mentors[idx % mentors.length].name;
        return rest;
      });
      await BookingModel.insertMany(updatedBookings);
      console.log("🌱 Seeded Bookings to MongoDB");
    }
    
    const postCount = await ForumPostModel.countDocuments();
    if (postCount === 0) {
      await ForumPostModel.insertMany(defaultPosts.map(p => {
        const { _id, ...rest } = p;
        if (rest.comments) {
          rest.comments = rest.comments.map(c => {
            const { _id, ...cRest } = c;
            return cRest;
          });
        }
        return rest;
      }));
      console.log("🌱 Seeded Forum Posts to MongoDB");
    }

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      const adminPass = bcrypt.hashSync('admin123', 10);
      const studentPass = bcrypt.hashSync('student123', 10);
      await UserModel.insertMany([
        { name: 'Admin User', email: 'admin@synapse.com', password: adminPass, role: 'admin' },
        { name: 'Student User', email: 'student@synapse.com', password: studentPass, role: 'student' }
      ]);
      console.log("🌱 Seeded Users to MongoDB");
    }
  } catch (err) {
    console.error("❌ Error seeding MongoDB:", err);
  }
};

// JSON Database helper functions
const readJson = (fileName) => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return [];
  }
};

const writeJson = (fileName, data) => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
  }
};

// Unified Database Client API
const db = {
  mentors: {
    find: async (filter = {}) => {
      if (isMongoConnected) {
        // Simple filter logic mapping
        const q = {};
        if (filter.domain && filter.domain !== 'All') {
          q.domain = filter.domain;
        }
        if (filter.search) {
          q.$or = [
            { name: { $regex: filter.search, $options: 'i' } },
            { bio: { $regex: filter.search, $options: 'i' } },
            { skills: { $in: [new RegExp(filter.search, 'i')] } }
          ];
        }
        return await MentorModel.find(q).lean();
      } else {
        let data = readJson('mentors.json');
        if (filter.domain && filter.domain !== 'All') {
          data = data.filter(m => m.domain === filter.domain);
        }
        if (filter.search) {
          const s = filter.search.toLowerCase();
          data = data.filter(m => 
            m.name.toLowerCase().includes(s) || 
            m.bio.toLowerCase().includes(s) ||
            m.skills.some(sk => sk.toLowerCase().includes(s))
          );
        }
        return data;
      }
    },
    findById: async (id) => {
      if (isMongoConnected) {
        return await MentorModel.findById(id).lean();
      } else {
        const data = readJson('mentors.json');
        return data.find(m => m._id === id) || null;
      }
    },
    create: async (mentorData) => {
      if (isMongoConnected) {
        const mentor = new MentorModel(mentorData);
        return await mentor.save();
      } else {
        const data = readJson('mentors.json');
        const newMentor = {
          _id: 'm_' + Math.random().toString(36).substr(2, 9),
          rating: 4.8,
          skills: mentorData.skills || [],
          ...mentorData
        };
        data.push(newMentor);
        writeJson('mentors.json', data);
        return newMentor;
      }
    },
    findByIdAndUpdate: async (id, updateData) => {
      if (isMongoConnected) {
        return await MentorModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
      } else {
        const data = readJson('mentors.json');
        const index = data.findIndex(m => m._id === id);
        if (index !== -1) {
          data[index] = { ...data[index], ...updateData };
          writeJson('mentors.json', data);
          return data[index];
        }
        return null;
      }
    },
    findByIdAndDelete: async (id) => {
      if (isMongoConnected) {
        return await MentorModel.findByIdAndDelete(id).lean();
      } else {
        const data = readJson('mentors.json');
        const index = data.findIndex(m => m._id === id);
        if (index !== -1) {
          const deleted = data.splice(index, 1)[0];
          writeJson('mentors.json', data);
          return deleted;
        }
        return null;
      }
    }
  },
  
  bookings: {
    find: async () => {
      if (isMongoConnected) {
        return await BookingModel.find().sort({ createdAt: -1 }).lean();
      } else {
        const data = readJson('bookings.json');
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    },
    create: async (bookingData) => {
      if (isMongoConnected) {
        const booking = new BookingModel(bookingData);
        return await booking.save();
      } else {
        const data = readJson('bookings.json');
        const newBooking = {
          _id: 'b_' + Math.random().toString(36).substr(2, 9),
          status: 'Pending',
          createdAt: new Date().toISOString(),
          ...bookingData
        };
        data.push(newBooking);
        writeJson('bookings.json', data);
        return newBooking;
      }
    },
    findByIdAndUpdateStatus: async (id, status) => {
      if (isMongoConnected) {
        return await BookingModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
      } else {
        const data = readJson('bookings.json');
        const index = data.findIndex(b => b._id === id);
        if (index !== -1) {
          data[index].status = status;
          writeJson('bookings.json', data);
          return data[index];
        }
        return null;
      }
    }
  },
  
  posts: {
    find: async () => {
      if (isMongoConnected) {
        return await ForumPostModel.find().sort({ createdAt: -1 }).lean();
      } else {
        const data = readJson('forum.json');
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    },
    findById: async (id) => {
      if (isMongoConnected) {
        return await ForumPostModel.findById(id).lean();
      } else {
        const data = readJson('forum.json');
        return data.find(p => p._id === id) || null;
      }
    },
    create: async (postData) => {
      if (isMongoConnected) {
        const post = new ForumPostModel(postData);
        return await post.save();
      } else {
        const data = readJson('forum.json');
        const newPost = {
          _id: 'p_' + Math.random().toString(36).substr(2, 9),
          likes: 0,
          likedBy: [],
          comments: [],
          createdAt: new Date().toISOString(),
          ...postData
        };
        data.push(newPost);
        writeJson('forum.json', data);
        return newPost;
      }
    },
    like: async (id, userIp = 'user') => {
      if (isMongoConnected) {
        // Toggle like
        const post = await ForumPostModel.findById(id);
        if (!post) return null;
        
        const likedIndex = post.likedBy.indexOf(userIp);
        if (likedIndex > -1) {
          post.likedBy.splice(likedIndex, 1);
          post.likes = Math.max(0, post.likes - 1);
        } else {
          post.likedBy.push(userIp);
          post.likes += 1;
        }
        return await post.save();
      } else {
        const data = readJson('forum.json');
        const index = data.findIndex(p => p._id === id);
        if (index !== -1) {
          const post = data[index];
          if (!post.likedBy) post.likedBy = [];
          const likedIndex = post.likedBy.indexOf(userIp);
          if (likedIndex > -1) {
            post.likedBy.splice(likedIndex, 1);
            post.likes = Math.max(0, post.likes - 1);
          } else {
            post.likedBy.push(userIp);
            post.likes += 1;
          }
          writeJson('forum.json', data);
          return post;
        }
        return null;
      }
    },
    addComment: async (id, commentData) => {
      if (isMongoConnected) {
        const post = await ForumPostModel.findById(id);
        if (!post) return null;
        post.comments.push(commentData);
        return await post.save();
      } else {
        const data = readJson('forum.json');
        const index = data.findIndex(p => p._id === id);
        if (index !== -1) {
          const post = data[index];
          const newComment = {
            _id: 'c_' + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            ...commentData
          };
          post.comments.push(newComment);
          writeJson('forum.json', data);
          return post;
        }
        return null;
      }
    }
  },
  users: {
    findByEmail: async (email) => {
      if (isMongoConnected) {
        return await UserModel.findOne({ email }).lean();
      } else {
        const data = readJson('users.json');
        return data.find(u => u.email === email) || null;
      }
    },
    create: async (userData) => {
      if (isMongoConnected) {
        const user = new UserModel(userData);
        return await user.save();
      } else {
        const data = readJson('users.json');
        const newUser = {
          _id: 'u_' + Math.random().toString(36).substr(2, 9),
          ...userData,
          createdAt: new Date().toISOString()
        };
        data.push(newUser);
        writeJson('users.json', data);
        return newUser;
      }
    }
  },
  subscribers: {
    create: async (email) => {
      if (isMongoConnected) {
        const sub = new SubscriberModel({ email });
        return await sub.save();
      } else {
        const data = readJson('subscribers.json');
        if (data.includes(email)) return { email };
        data.push(email);
        writeJson('subscribers.json', data);
        return { email };
      }
    },
    findByEmail: async (email) => {
      if (isMongoConnected) {
        return await SubscriberModel.findOne({ email }).lean();
      } else {
        const data = readJson('subscribers.json');
        return data.includes(email) ? { email } : null;
      }
    }
  }
};

export { connectDB, db, isMongoConnected };
