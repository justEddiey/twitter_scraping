import { mailConfig } from "./config.js";
import nodemailer from "nodemailer"


let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    auth: {
      user: mailConfig.USER,
      pass: mailConfig.PASS
    }
  });


  export async function sendMail(recipient, videoUrl) {
    let mailData = {
        from: '"Hyperhire Scraper Bot" <testmail@gmail.com>',
        to: recipient,
        subject: 'Video Post',
        text: `A new video has been posted: ${videoUrl}`,
        html: `<b>A new video has been posted:</b> <a href="${videoUrl}">${videoUrl}</a>`
      }
    let info = await transporter.sendMail(mailData);
  
    console.log('Message sent: %s', info.messageId);
  }