import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "http://localhost:";

dotenv.config({
    path: './env',
});

connectDB()
.then( ()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on : ${HOST}/api/v1/users`);
        console.log(`Server is Locally running on : http://localhost:${PORT}/api/v1/users`);
    })
})
.catch( (err) => {
    console.log("MONGODB Connection failed !!! ", err);
})




//-----------------------------------------------------------------------------------------
// require('dotenv').config({path: './env'});
// import dotenv from "dotenv";
// import { mongoose } from "mongoose";
// import { DB_NAME } from "./constants.js";
// import connectDB from "./db/index.js";


// dotenv.config({
//   path: "./env",
// });

// connectDB();

// ---------------------------------------------------------------------------------------
//                first way to Connect with Database using normal function
// ---------------------------------------------------------------------------------------
// function connectDB(){
//     sonmething....
// }
// connectDB();

// ---------------------------------------------------------------------------------
//                             2nd way to Connect with Database using Iffi
// ----------------------------------------------------------------------------------

// const app = express()
// ;( async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("ERROR:- ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is Listening on port: ${process.env.PORT}`);
//         })

//     }catch(error){
//         console.error("ERROR:- ", error);
//         throw error
//     }
// })()
