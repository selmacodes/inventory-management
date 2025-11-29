// Läser in miljövariabler från .env
import dotenv from "dotenv";
dotenv.config();

import express from "express";

// Importerar routrar
import productRouter from "./routes/productRoutes.mjs";
import supplierRouter from "./routes/supplierRoutes.mjs"

import { setupDatabase } from "./config/setupDatabase.mjs";

const appPort = Number(process.env.PORT);

const app = express();
app.use(express.json()); // Middleware för att kunna läsa JSON i request body

setupDatabase().catch(err => {
    console.error("DB setup failed:", err);
});

// Koppla routrar
app.use("/products", productRouter);
app.use("/suppliers", supplierRouter);

app.listen(appPort, () => {
    console.log(`Server running on port ${appPort}`);
});
