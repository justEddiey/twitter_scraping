// import {Make, add} from "./worker.js"
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerDefinition } from './lib/config.js';

import { TweetService } from "./services/tweetService.js";
import { twitter } from './twitter.js';
import { startCron } from './cronJob.js';





const tweetService = new TweetService();
const app = express();


const options = {
  swaggerDefinition,
  apis: ['./index.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.get("/",(req, res, next) => {

 
  res.send('Twitter scraping project');
  
        
   });

app.get("/scrape", async (req, res, next) => {


    try {
      
      await twitter.initialize()
      // await twitter.login();
      
      const tweets = await twitter.getTweets('coinbase', 50)
      // await tweetService.saveTweets(tweets)

      await twitter.end()
      res.json('scraping success');
    } catch (err) {
     
      res.status(500).send('Internal Server Error');
    }
      
    
     });

// Define a route
/**
 * @swagger
 * /data:
 *   get:
 *     summary: Get data
 *     description: Get data from the server
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination (default is 1).
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page (default is 5).
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
app.get("/data", async (req, res, next) => {


  try {
    const { page, size } = req.query;
   
    const  pageSize = size ? +size : 5;
    const  pageNumber = page ? page : 1;

    const response = await tweetService.getTweets(pageNumber, pageSize);
    res.json(response);
  } catch (err) {
   
    res.status(500).send('Internal Server Error');
  }
    
  
   });
  

// const getUserById = async (req,res) => {


//       await twitter.initialize()
//       // await twitter.login();
      
//       const tweets = await twitter.getTweets('coinbase', 50)
//       // await tweetService.saveTweets(tweets)

//       await twitter.end()
         
//       }

// getUserById()

startCron()

app.listen(3000, () => {
 console.log("Server running on port 3000");
});







