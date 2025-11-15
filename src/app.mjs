// Läser in miljövariabler från .env
import dotenv from "dotenv";
dotenv.config();

import express from "express";

import productRouter from "./routes/productRoutes.mjs";

const app = express();

app.use(express.json()); // Middleware för att kunna läsa JSON i request body

app.use("/products", productRouter); // Kopplar produkt-routern till /products

// Startar servern på port 3012
app.listen(3012, () => console.log("Server running on port 3012"));
