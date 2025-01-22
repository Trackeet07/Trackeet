import app from "./app.js";
import dotenv from "dotenv";
import logger from "./utils/log/logger.js"; 
import connectDB from "./database/db.js" 
import { sendServerFailure } from "./utils/email/email-sender.js"; 
import  { v2 as cloudinary } from "cloudinary";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// const url = cloudinary.url("trackeet")
// console.log("URL", url)
(async function() {
  const results = await cloudinary.uploader.upload("./public/images/Logomark.svg")
  console.log("RESULTS", results)
  const url =cloudinary.url(results.public_id, {
  //   transformation: [
  //     {
  //     quality: "auto", 
  //     fetch_format: "auto"
  //   },
  //   {
  //     width: 1200, 
  //     height: 1200,
  //     crop: "fill",
  //     gravity: "auto"
  //   }
  // ]
  })
})()
// const url = cloudinary.url("Section_bhthbc", {
//   transformation: [
//     {
//     quality: "auto"
//   },
//   {
//     fetch_format: "auto"
//   },
//   {
//     width: 1200
//   }
// ]
// }
// );
// console.log(url)
process.on("uncaughtException", err=> {
    console.log('UNCAUGHT EXCEPTION!,  SHUTTING DOWN........');
    console.log(err)
    console.log(err.name, err.message)
      process.exit(1)
  })
  

  const port = process.env.PORT || 1700;
  dotenv.config();

  const server = app.listen(port, async () => {
    try {
      await connectDB(process.env.MONGODB_URL)
      console.log(`Database connected successfully`)
      logger.info(`Server is running on port ${port}`);
    } catch (error) {
      logger.error(error);
      sendServerFailure()
    }
  });

  process.on("unhandledRejection", err=> {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION!!! SHUTTING DOWN...");
    server.close(()=> {
        process.exit(1) 
    })
    
  })

