const axios = require("axios");
const cheerio = require("cheerio");
const dns = require("dns");

const Story = require("../models/Story");

// Fix IPv6 timeout issue on Linux
dns.setDefaultResultOrder("ipv4first");

const scrapeHackerNews = async () => {
  try {
    console.log("[Scraper] Starting scrape...");

    const response = await axios.get(
      "https://news.ycombinator.com/",
      {
        timeout: 10000, // 10 sec timeout
        family: 4, // Force IPv4 to prevent ETIMEDOUT on Node >= 18
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
      }
    );

    const $ = cheerio.load(response.data);

    const stories = [];

    $(".athing")
      .slice(0, 10)
      .each((index, element) => {
        const hnId = $(element).attr("id");

        const titleElement = $(element)
          .find(".titleline > a")
          .first();

        const title = titleElement.text();

        const url = titleElement.attr("href");

        const subtext = $(element).next();

        const pointsText = subtext.find(".score").text();

        const points = pointsText
          ? parseInt(pointsText.replace(" points", ""), 10)
          : 0;

        const author =
          subtext.find(".hnuser").text() || "anonymous";

        const postedAt =
          subtext.find(".age").attr("title") ||
          subtext.find(".age").text();

        stories.push({
          hnId,
          title,

          url:
            url && url.startsWith("item?id=")
              ? `https://news.ycombinator.com/${url}`
              : url,

          points,
          author,
          postedAt,
        });
      });

    // Better DB strategy
    const operations = stories.map((story) => ({
      updateOne: {
        filter: { hnId: story.hnId },
        update: { $set: story },
        upsert: true,
      },
    }));

    await Story.bulkWrite(operations);

    console.log(
      `[Scraper] Successfully scraped and saved ${stories.length} stories.`
    );

    return stories;

  } catch (error) {

    // Better error handling
    if (error.code === "ETIMEDOUT") {
      console.error(
        "[Scraper] Request timed out. Check internet/DNS."
      );
    } else if (error.response) {
      console.error(
        `[Scraper] HTTP Error: ${error.response.status}`
      );
    } else {
      console.error(
        "[Scraper] Error scraping Hacker News:",
        error.message
      );
    }

    return [];
  }
};

module.exports = { scrapeHackerNews };