import express from "express";
import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes.js";
import authRoutes from "./routes/authRoute.js";
import postRoutes from "./routes/postRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
const app = express();
dotenv.config();


app.use(cors({
    origin: [ "https://publiser.netlify.app/"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true}))  
app.get("/", (req, res) => {
  res.send("Backend running on Vercel 🚀");
});
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use((req, res) => {
  res.status(404).send("OOPS!!! 404 page not found");
});
app.use(errorMiddleware)
export default app