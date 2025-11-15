// Skapar en PostgreSQL connection pool med ES-moduler
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
    host: "localhost",              // Databasens host
    port: 5432,                     // Databasens port
    database: process.env.DATABASE_NAME, // Namn på databasen från .env
    user: process.env.DATABASE_USER,     // Databasanvändare från .env
    password: process.env.DATABASE_PASSWORD // Lösenord från .env
});
