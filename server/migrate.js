const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Project = require('./models/Project');
const Feedback = require('./models/Feedback');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedbackdb').then(async () => {
  console.log('Connected to MongoDB');
  try {
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne({});
    }
    if (!admin) {
      console.log('No users found. Creating a dummy admin...');
      admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin' });
    }
    
    let defaultProject = await Project.findOne({ name: 'Default Feedback Board' });
    if (!defaultProject) {
      defaultProject = await Project.create({
        name: 'Default Feedback Board',
        description: 'Original feedback items before multi-project support',
        owner: admin._id
      });
      console.log('Created Default Project:', defaultProject._id);
    }
    
    const result = await Feedback.updateMany(
      { project: { $exists: false } },
      { $set: { project: defaultProject._id } }
    );
    console.log('Migrated feedback items:', result.modifiedCount);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
