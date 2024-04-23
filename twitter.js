import puppeteer from "puppeteer";
import fs from "fs";
import { twitterConfig } from "./lib/config.js";

const BASE_URL = "https://twitter.com/";
const LOGIN_URL = "https://twitter.com/login";
const tweetContainerSelector = "article";
const USERNAME_URL = (username) => `https://twitter.com/${username}`;

let browser = null;
let page = null;

const extractElements = async (page) => {
  const tweetData = await page.$$eval(tweetContainerSelector, (elements) =>
    elements.map((element) => ({
      titles: element.querySelector('[data-testid="tweetText"]')?.innerText,
      image_src:
        element
          .querySelector('[data-testid="tweetPhoto"] img')
          ?.getAttribute("src") || "",
      postedDate: element.querySelector(".css-175oi2r.r-18u37iz.r-1q142lx")
        ?.innerText,
      video_src:
        element
          .querySelector('[data-testid="tweetPhoto"] source')
          ?.getAttribute("src") || "",
      repliesCount: element.querySelector(
        ".css-175oi2r.r-xoduu5.r-1udh08x:nth-child(2)"
      )?.innerText,
      likesCount: element.querySelector(
        ".css-175oi2r.r-xoduu5.r-1udh08x:nth-child(2)"
      )?.innerText,
      repostCount: element.querySelector(
        ".css-175oi2r.r-18u37iz.r-1h0z5md.r-13awgt0:nth-child(2)"
      )?.innerText,
    }))
  );

  return tweetData;
};

export const twitter = {
  initialize: async () => {
    // browser = await puppeteer.launch({
    //   headless: false,
    //   executablePath:
    //     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    //   defaultViewport: {
    //     width: 1440,
    //     height: 1080,
    //   },
    // });
    browser = await puppeteer.launch({
    	args: [
    		"--disable-setuid-sandbox",
    		"--no-sandbox",
    		"--single-process",
    		"--no-zygote",
    	  ],
    	  executablePath:
    		process.env.NODE_ENV === "production"
    		  ? process.env.PUPPETEER_EXECUTABLE_PATH
    		  : puppeteer.executablePath(),
    })
    try {
      page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
      );
      await page.goto(BASE_URL);
    } catch (e) {
      console.error(e);
    }
  },

  login: async () => {

	try{
		console.log("logging into twitter");
		const username = twitterConfig.USER;
		const password = twitterConfig.PASS;
	
		let userNameInputSelector = "input.r-7cikom.r-1ny4l3l.r-t60dpp.r-fdjqy7";
		let passwordInputSelector = ".r-7cikom.r-1ny4l3l.r-t60dpp.r-fdjqy7";
		await page.goto(LOGIN_URL);
		await page.waitForSelector(userNameInputSelector);
		await page.type(userNameInputSelector, username, { delay: 55 });
		await page.click(
		  ".r-ymttw5.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l:nth-child(6)"
		);
		await page.waitForSelector(passwordInputSelector);
		await page.type(passwordInputSelector, password, { delay: 55 });
	
		await Promise.all([
		  page.waitForNavigation(),
		  await page.click(".css-175oi2r.r-pw2am6"),
		]);
	}
	catch(e){
		console.error(e)
	}
    
  },
  getTweets: async (username, count = 10) => {
    try {
      let url = await page.url();

      if (url != USERNAME_URL(username)) {
        await page.goto(USERNAME_URL(username));
      }
      console.log("starting scraper");

      await page.waitForSelector(tweetContainerSelector);
      let tweetsArray = await page.$$(tweetContainerSelector);

      let lastTweetsArrayLength = 0;
      let tweets = [];

      while (tweets.length < count) {
        const tweetData = await extractElements(page);
        console.log(tweetData);
        tweets = [...tweets, ...tweetData];
        let previousHeight = await page.evaluate("document.body.scrollHeight");
        await page.evaluate("window.scrollTo(0,document.body.scrollHeight)");

        // await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        // await page.waitForSelector(tweetContainerSelector)
        await new Promise((r) => setTimeout(r, 3000));
        tweetsArray = await page.$$(tweetContainerSelector);

        if (lastTweetsArrayLength == tweetsArray.length) break;

        lastTweetsArrayLength = tweetsArray.length;
        console.log("arr", tweetsArray.length);
      }

      console.log(`Scraped ${tweets.length} tweets`);
      tweets = tweets.slice(0, count);
    //   fs.writeFileSync(
    //     "./tweets.json",
    //     JSON.stringify(tweets, null, 4),
    //     "utf-8"
    //   );
      return tweets;
    } catch (e) {
      console.error(e);
    }
  },
  end: async () => {
    await browser.close();
  },
};
