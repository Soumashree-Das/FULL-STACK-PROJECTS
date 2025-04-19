import express from "express";
import connectDB from "./src/db/db.index.js";
import cors from "cors";

import UserRouter from "./src/routes/user.route.js";
import JournalRouters from "./src/routes/journalEntry.routes.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true // If using cookies/sessions
  }));

app.use(express.json());
app.use("/user",UserRouter);
app.use("/journal",JournalRouters);


connectDB().then(()=>{
    app.listen(process.env.PORT||9000 , () => {
        console.log(`Server running on port : ${process.env.PORT || 9000}`)
    })
})




