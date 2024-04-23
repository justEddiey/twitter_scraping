
import puppeteer from 'puppeteer';
import fs from 'fs'
import { twitterConfig } from './config.js';
import { saveImageFromUrl } from './utils.js';
import {setTimeout} from "node:timers/promises";



const BASE_URL = 'https://twitter.com/';
const LOGIN_URL = 'https://twitter.com/login';
const tweetContainerSelector = 'article';
const USERNAME_URL = (username) =>  `https://twitter.com/${username}`

let browser = null;
let page = null;

const extractElements = async (page) =>{

    const tweetData = await page.$$eval(tweetContainerSelector,elements =>
		elements.map(
				 element => ({
					'titles': element.querySelector('[data-testid="tweetText"]')?.innerText,
					'image_src':element.querySelector('[data-testid="tweetPhoto"] img')?.getAttribute('src')|| "",
					'postedDate':element.querySelector('.css-175oi2r.r-18u37iz.r-1q142lx')?.innerText,
					'video_src':element.querySelector('[data-testid="tweetPhoto"] source')?.getAttribute('src')|| "",
					'repliesCount':element.querySelector('.css-175oi2r.r-xoduu5.r-1udh08x:nth-child(2)')?.innerText,
					'likesCount':element.querySelector('.css-175oi2r.r-xoduu5.r-1udh08x:nth-child(2)')?.innerText,
					'repostCount':element.querySelector('.css-175oi2r.r-18u37iz.r-1h0z5md.r-13awgt0:nth-child(2)')?.innerText,
				 })
		)
			
			)

		return tweetData
}

export const twitter = {
	initialize : async () => {
		browser = await puppeteer.launch({
			headless : false,
			executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			defaultViewport: {
				width: 1440,
				height: 1080
			}
		});
		page = await browser.newPage();
		await page.goto(BASE_URL);
		
	},

	login: async () => {
		const username = twitterConfig.USER
		const password = twitterConfig.PASS
	
		let userNameInputSelector = 'input.r-7cikom.r-1ny4l3l.r-t60dpp.r-fdjqy7'
		let passwordInputSelector = '.r-7cikom.r-1ny4l3l.r-t60dpp.r-fdjqy7'
		await page.goto(LOGIN_URL);
		await page.waitForSelector(userNameInputSelector)
		await page.type(userNameInputSelector,username,{delay: 55});
		await page.click('.r-ymttw5.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l:nth-child(6)')
		await page.waitForSelector(passwordInputSelector)
		await page.type(passwordInputSelector,password,{delay: 55});

		await page.click('.css-175oi2r.r-pw2am6')
		await page.waitForNetworkIdle()

	},
	getTweets: async (username,count = 10) => {
		let url = await page.url();
		
		if(url != USERNAME_URL(username)){
			await page.goto(USERNAME_URL(username));
		}
	
		let tweetTextSelector = '.r-rjixqe.r-16dba41.r-bnwqim';
		let tweetTimeSelector = '.css-175oi2r.r-18u37iz.r-1q142lx';

		await page.waitForSelector(tweetContainerSelector)
		let tweetsArray = await page.$$(tweetContainerSelector);
		// await new Promise(r => setTimeout(r,500))
		// await page.waitForNetworkIdle()
		
		let lastTweetsArrayLength = 0;
		let tweets = []

		while(tweetsArray.length < count){xx
			const tweetData = await extractElements(page)
			console.log(tweetData)
			tweets = [...tweets,...tweetData]
			let previousHeight = await page.evaluate('document.body.scrollHeight');
			await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');
			// await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
			await page.waitForSelector(tweetContainerSelector)
			tweetsArray = await page.$$(tweetContainerSelector);
			// await new Promise(r=> setTimeout(r,500))
	
			

			if(lastTweetsArrayLength == tweetsArray.length) break;

			lastTweetsArrayLength = tweetsArray.length;
			console.log('arr',tweetsArray.length)
		
		}


		tweets = tweets.slice(0,count);
		fs.writeFileSync('./tweets.json',JSON.stringify(tweets,null, 4),'utf-8');
		return tweets;
	},
	end: async () => {
		await browser.close()
	}
};


