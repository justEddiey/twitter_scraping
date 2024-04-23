import schedule from 'node-schedule'
import { TweetService } from './services/tweetService.js';
import { processTweets } from './lib/helpers.js';

const tweetService = new TweetService();

export const startCron = async ()=>{

   schedule.scheduleJob('*/10 * * * * *', async() => {

        // await twitter.initialize();
        // await twitter.login();
    
        // const tweets = await twitter.getTweets('coinbase', 50);
    
        // await tweetService.saveTweets(tweets)
        // await processTweets()
    
        console.log('Cron job ran sucessfully', new Date().toLocaleTimeString());
    });

}

