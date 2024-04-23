import { saveImageFromUrl } from './utils.js';
import { sendMail } from './mailer.js';



export const processTweets = async (tweets) => {
        for (let tweet of tweets){
            await saveImageFromUrl(tweet.image_src)
            if (tweet.video_src!=''){
                await sendMail("eedetofficial@gmail.com",tweet.video_src)
            }
        }
    }
    

