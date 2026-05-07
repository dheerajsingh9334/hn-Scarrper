const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com/');
    const $ = cheerio.load(data);
    const stories = [];

    $('.athing').slice(0, 10).each((index, element) => {
      const hnId = $(element).attr('id');
      const titleElement = $(element).find('.titleline > a').first();
      const title = titleElement.text();
      const url = titleElement.attr('href');

      const subtext = $(element).next();
      const pointsText = subtext.find('.score').text();
      const points = pointsText ? parseInt(pointsText.replace(' points', ''), 10) : 0;
      const author = subtext.find('.hnuser').text() || 'anonymous';
      const postedAt = subtext.find('.age').attr('title') || subtext.find('.age').text();

      stories.push({
        hnId,
        title,
        url: url && url.startsWith('item?id=') ? `https://news.ycombinator.com/${url}` : url,
        points,
        author,
        postedAt
      });
    });

    for (const story of stories) {
      await Story.findOneAndUpdate(
        { hnId: story.hnId },
        story,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    
    console.log(`[Scraper] Successfully scraped and saved ${stories.length} stories.`);
    return stories;
  } catch (error) {
    console.error('[Scraper] Error scraping Hacker News:', error.message);
    throw error;
  }
};

module.exports = { scrapeHackerNews };
