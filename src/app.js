import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productController from "./controllers/productController.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productController);

app.use(errorHandler);

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
