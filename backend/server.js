import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://online-code-judge-phi.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true
  })
);

// handle browser preflight
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use("/auth", authRoutes);

app.get("/",(req,res)=>{
   res.send("Backend running");
});

app.use((err,req,res,next)=>{
   console.log("ERROR:",err);

   res.status(500).json({
      success:false,
      message:"Internal Server Error"
   });
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
   console.log(`Server running on ${PORT}`);
});