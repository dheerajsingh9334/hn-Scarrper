const Story = require('../models/Story');
const User = require('../models/User');
const { scrapeHackerNews } = require('../services/scraper');

const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Story.countDocuments();

    res.json({
      stories,
      page,
      totalPages: Math.ceil(total / limit),
      totalStories: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const user = await User.findById(req.user.id);
    
    const isBookmarked = user.bookmarks.includes(storyId);
    
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== storyId);
    } else {
      user.bookmarks.push(storyId);
    }
    
    await user.save();
    
    res.json({ 
      message: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      bookmarks: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.json({ message: 'Scrape successful', storiesCount: stories.length });
  } catch (error) {
    res.status(500).json({ message: 'Scrape failed' });
  }
};

module.exports = { getStories, getStory, toggleBookmark, triggerScrape };
