import schedule from 'node-schedule'
import { TweetModel } from './models/post.js';
import { processTweets } from './helpers.js';

const tweetService = new TweetModel();

const scheduledTask =  schedule.scheduleJob('0 */5 * * *', async() => {

    await twitter.initialize();
    await twitter.login();

    const tweets = await twitter.getTweets('coinbase', 50);

    await tweetService.saveTweets(tweets)
    await processTweets()

    console.log('Task executed five hours', new Date().toLocaleTimeString());
});