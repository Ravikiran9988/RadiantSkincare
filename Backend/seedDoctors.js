const mongoose = require('mongoose');
require('dotenv').config();
const Doctor = require('./models/Doctor'); // adjust path if needed

const doctors = [
  {
    title: 'Dr.',
    name: 'Aarti Sharma',
    avatar: 'https://i.imgur.com/aarti-avatar.jpg',
    specialization: 'Dermatologist - Acne & Scars',
    experience: '12 years',
    languages: ['English', 'Hindi'],
    email: 'aarti@radiantskin.in',
    password: 'aarti123',
  },
  {
    title: 'Dr.',
    name: 'Ravi Teja Reddy',
    avatar: 'https://i.imgur.com/raviteja-avatar.jpg',
    specialization: 'Skincare & Cosmetology',
    experience: '9 years',
    languages: ['English', 'Telugu'],
    email: 'raviteja@radiantskin.in',
    password: 'raviteja123',
  },
  {
    title: 'Dr.',
    name: 'Nisha Gupta',
    avatar: 'https://i.imgur.com/nisha-avatar.jpg',
    specialization: 'Pigmentation & Anti-Aging',
    experience: '10 years',
    languages: ['Hindi', 'English'],
    email: 'nisha@radiantskin.in',
    password: 'nisha123',
  },
  {
    title: 'Dr.',
    name: 'Vinay Kumar',
    avatar: 'https://i.imgur.com/vinay-avatar.jpg',
    specialization: 'Pediatric Skincare',
    experience: '8 years',
    languages: ['Telugu', 'English'],
    email: 'vinay@radiantskin.in',
    password: 'vinay123',
  },
  {
    title: 'Dr.',
    name: 'Sneha Rani',
    avatar: 'https://i.imgur.com/sneha-avatar.jpg',
    specialization: 'Eczema & Psoriasis Specialist',
    experience: '14 years',
    languages: ['Hindi', 'English', 'Telugu'],
    email: 'sneha@radiantskin.in',
    password: 'sneha123',
  },
  {
    title: 'Dr.',
    name: 'Arjun Deshmukh',
    avatar: 'https://i.imgur.com/arjun-avatar.jpg',
    specialization: 'Cosmetic Dermatology',
    experience: '11 years',
    languages: ['Hindi', 'English'],
    email: 'arjun@radiantskin.in',
    password: 'arjun123',
  },
  {
    title: 'Dr.',
    name: 'Meena Iyer',
    avatar: 'https://i.imgur.com/meena-avatar.jpg',
    specialization: 'Skincare for Women',
    experience: '15 years',
    languages: ['English', 'Telugu'],
    email: 'meena@radiantskin.in',
    password: 'meena123',
  },
  {
    title: 'Dr.',
    name: 'Prakash Naidu',
    avatar: 'https://i.imgur.com/prakash-avatar.jpg',
    specialization: 'Acne & Sun Damage',
    experience: '13 years',
    languages: ['Telugu', 'Hindi', 'English'],
    email: 'prakash@radiantskin.in',
    password: 'prakash123',
  },
  {
    title: 'Dr.',
    name: 'Pooja Joshi',
    avatar: 'https://i.imgur.com/pooja-avatar.jpg',
    specialization: 'Laser Skincare Treatments',
    experience: '7 years',
    languages: ['English', 'Hindi'],
    email: 'pooja@radiantskin.in',
    password: 'pooja123',
  },
  {
    title: 'Dr.',
    name: 'Kiran Babu',
    avatar: 'https://i.imgur.com/kiran-avatar.jpg',
    specialization: 'Clinical Dermatology',
    experience: '10 years',
    languages: ['English', 'Telugu'],
    email: 'kiran@radiantskin.in',
    password: 'kiran123',
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Doctor.deleteMany(); // Optional: clears existing doctors

    for (let doc of doctors) {
      const newDoc = new Doctor(doc);
      await newDoc.save(); // Password hashing via pre-save hook
    }

    console.log('✅ Doctors seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding doctors:', err);
    process.exit(1);
  }
};

seedDoctors();
