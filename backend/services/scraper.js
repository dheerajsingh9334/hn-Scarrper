const axios = require("axios");
const dns = require("dns");

const Story = require("../models/Story");

// Fix IPv6 timeout issue on Linux
dns.setDefaultResultOrder("ipv4first");

const scrapeHackerNews = async (limit = 30) => {
  try {
    console.log(`[Scraper] Starting scrape for up to ${limit} stories using official API...`);
    
    // Fetch top story IDs
    const { data: topStoriesIds } = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { timeout: 10000, family: 4 }
    );

    if (!topStoriesIds || topStoriesIds.length === 0) {
      console.log("[Scraper] No stories found from API.");
      return [];
    }

    const idsToFetch = topStoriesIds.slice(0, limit);
    const stories = [];

    // Fetch individual story details
    // Using a simple loop with a small delay to be polite to the API, though Firebase handles concurrents well.
    for (const id of idsToFetch) {
      try {
        const { data: storyData } = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { timeout: 5000, family: 4 }
        );

        if (storyData && storyData.type === 'story') {
          stories.push({
            hnId: storyData.id.toString(),
            title: storyData.title,
            url: storyData.url || `https://news.ycombinator.com/item?id=${storyData.id}`,
            points: storyData.score || 0,
            author: storyData.by || "anonymous",
            postedAt: new Date(storyData.time * 1000).toLocaleString(),
          });
        }
      } catch (err) {
        console.error(`[Scraper] Failed to fetch story ${id}:`, err.message);
      }
    }

    if (stories.length > 0) {
      const operations = stories.map((story) => ({
        updateOne: {
          filter: { hnId: story.hnId },
          update: { $set: story },
          upsert: true,
        },
      }));
      await Story.bulkWrite(operations);
    }

    console.log(`[Scraper] Successfully scraped and saved ${stories.length} stories.`);
    return stories;

  } catch (error) {
    if (error.code === "ETIMEDOUT") {
      console.error("[Scraper] Request timed out. Check internet/DNS.");
    } else if (error.response) {
      console.error(`[Scraper] HTTP Error: ${error.response.status}`);
    } else {
      console.error("[Scraper] Error scraping Hacker News:", error.message);
    }
    return [];
  }
};

module.exports = { scrapeHackerNews };