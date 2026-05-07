const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  points: {
    type: Number,
    default: 0
  },
  author: {
    type: String
  },
  postedAt: {
    type: String
  },
  hnId: {
    type: String,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
