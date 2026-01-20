import "../env.js";
import connect_DB from "./db/index.js";
import {app} from "./app.js";

connect_DB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running on http:localhost:${process.env.PORT}`);

  })
})
.catch((err)=>{
  console.log("MongoDB connection failed!!!!",err)
})