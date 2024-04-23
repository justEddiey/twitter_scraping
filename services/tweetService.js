import pg from "pg";
import { dbConfig } from "../lib/config.js";
import format from "pg-format";
import { getPagingData } from "../lib/utils.js";

export const PgClient = new pg.Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
  ssl: true,
});

PgClient.query(
  `
    CREATE TABLE IF NOT EXISTS public.tweets
(
    tweet character varying(4000) COLLATE pg_catalog."default",
    tweet_date character varying(40) COLLATE pg_catalog."default",
    id SERIAL NOT NULL PRIMARY KEY,
    likes_count character varying(20),
    replies_count character varying(20),
    repost_count character varying(20),
    video_src character varying(500),
    image_src character varying(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   
    
)`,
  (err, res) => {
    console.log(err, res);
  }
);

export class TweetService {
  constructor() {
    this.db = PgClient;
  }

  async saveTweets(tweets) {
    const client = this.db;
    await this.db.connect();

    try {
      const values = tweets.map((tweet) => [
        tweet.titles,
        tweet.postedDate,
        tweet.repliesCount,
        tweet.likesCount,
        tweet.repostCount,
        tweet.video_src,
        tweet.image_src,
      ]);
      const queryText = format(
        "INSERT INTO public.tweets(tweet, tweet_date, replies_count, likes_count, repost_count, video_src, image_src) VALUES %L",
        values
      );
      await client.query(queryText);

      console.log("Tweets saved successfully.");
    } catch (err) {
      console.error("Error saving tweets:", err);
    }
  }

  async getTweets(page, size) {

    const offset = (page - 1) * size;
    const pageRequest = [size, offset];
    
    try {
      await this.db.connect();
      const result = await this.db.query(
        "SELECT * FROM public.tweets ORDER BY id DESC LIMIT $1 OFFSET $2 ",
        pageRequest
      );
      const totalCount = await this.db.query(
        "SELECT COUNT(*) FROM public.tweets "
      );
      const totalRecords = parseInt(totalCount.rows[0].count);
      console.log(result.rows);
      return getPagingData(result, page, size, totalRecords);

    } catch (err) {
      console.error("Error fetching tweets:", err);
    }
  }
}
