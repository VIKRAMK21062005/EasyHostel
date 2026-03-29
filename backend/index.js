import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { authRouter } from "./src/route/authRouter.js";
import productRouter from "./src/route/productRoute.js";
import orderRouter from "./src/route/orderRoute.js";
import paymentRouter from "./src/route/paymentRoute.js";
import cors from "cors"
dotenv.config();

const app=express();

app.use(express.json())

// const corsOptions = {
//   origin: ' http://localhost:5173', // Only this origin is allowed
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//   credentials: true // Set to true if you need to handle cookies/authentication
// };

app.use(cors());

app.use("/api/auth",authRouter);
app.use("/api/products",productRouter)
app.use("/api/orders",orderRouter)
app.use("/api/payments", paymentRouter);

app.use(errorHandler)
app.listen(process.env.PORT || 5000,async()=>{
  await connectDB();
  console.log("App is running on Port ",process.env.PORT || 5000)
})