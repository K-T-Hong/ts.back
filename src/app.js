import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productController from "./controllers/productController.js";
import userController from "./controllers/userController.js";
import errorHandler from "./middlewares/errorHandler.js";
import articleController from "./controllers/articleController.js";
import commentController from "./controllers/commentController.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userController);
app.use("/products", productController);
app.use("/articles", articleController);
app.use("/", commentController);

app.use(errorHandler);

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
