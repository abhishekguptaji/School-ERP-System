import mongoose from "mongoose";
import  {DB_NAME}  from "../constant.js";

const conncet_DB = async () =>{
  try{
     const connectionIstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME }`)
     console.log(`\nMongoDB connected!! DB HOST ${connectionIstance.connection.host}`);
  }catch(error){
    console.log("MONGODB connection error:",error)
    process.exit(1);
  }
} 

export default conncet_DB;