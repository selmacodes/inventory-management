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

// Koppla routrar
app.use("/products", productRouter);
app.use("/suppliers", supplierRouter);

setupDatabase()
    .then(() => {
        app.listen(appPort, () => {
            console.log(`Server running on port ${appPort}`);
        });
    })
    .catch((err) => {
        console.error("DB setup failed:", err);
        process.exit(1); // Stoppar servern vid fel
    });