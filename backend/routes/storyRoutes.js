const express = require('express');
const router = express.Router();
const { getStories, getStory, toggleBookmark, triggerScrape } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stories', getStories);
router.get('/stories/:id', getStory);
router.post('/stories/:id/bookmark', protect, toggleBookmark);
router.post('/scrape', triggerScrape);

module.exports = router;
