const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  customFields: [{
    label: { type: String, required: true },
    fieldType: { type: String, enum: ['text', 'textarea', 'rating', 'multiple_choice'], default: 'text' },
    required: { type: Boolean, default: false },
    options: [{ type: String }]
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  themeColor: {
    type: String,
    default: '#005ea2' // Default government blue
  },
  logoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for feedback count
projectSchema.virtual('feedback', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

module.exports = mongoose.model('Project', projectSchema);
