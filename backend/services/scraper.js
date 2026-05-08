const axios = require("axios");
const cheerio = require("cheerio");
const dns = require("dns");

const Story = require("../models/Story");

// Fix IPv6 timeout issue on Linux
dns.setDefaultResultOrder("ipv4first");

const scrapeHackerNews = async (limit = 30) => {
  try {
    console.log(`[Scraper] Starting scrape for up to ${limit} stories...`);
    const stories = [];
    let page = 1;

    while (stories.length < limit) {
      try {
        if (page > 1) {
          // Add a 1-second delay between pages to avoid 429 Too Many Requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const response = await axios.get(
          `https://news.ycombinator.com/?p=${page}`,
          {
            timeout: 10000,
            family: 4,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            },
          }
        );

        const $ = cheerio.load(response.data);
        const items = $(".athing").toArray();

        if (items.length === 0) break; // no more items

        for (const element of items) {
          if (stories.length >= limit) break;

          const hnId = $(element).attr("id");
          const titleElement = $(element).find(".titleline > a").first();
          const title = titleElement.text();
          const url = titleElement.attr("href");

          const subtext = $(element).next();
          const pointsText = subtext.find(".score").text();
          const points = pointsText ? parseInt(pointsText.replace(" points", ""), 10) : 0;
          const author = subtext.find(".hnuser").text() || "anonymous";
          const postedAt = subtext.find(".age").attr("title") || subtext.find(".age").text();

          stories.push({
            hnId,
            title,
            url: url && url.startsWith("item?id=") ? `https://news.ycombinator.com/${url}` : url,
            points,
            author,
            postedAt,
          });
        }

        page++;
      } catch (err) {
        console.error(`[Scraper] Failed on page ${page}:`, err.response ? `HTTP ${err.response.status}` : err.message);
        break; // Stop fetching more pages if we hit a rate limit (429) or other error
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