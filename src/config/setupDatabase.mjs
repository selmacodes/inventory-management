import { pool } from "./db.mjs";

export async function setupDatabase() {
    console.log("Setting up database...");

    await pool.query(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            contact_person TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            country TEXT NOT NULL
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            quantity INT NOT NULL CHECK (quantity >= 0),
            price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
            category TEXT NOT NULL,
            supplier_id INT NOT NULL REFERENCES suppliers(id)
                ON DELETE RESTRICT 
                ON UPDATE CASCADE
        );
    `);

    console.log("Database ready.");
}

// ON DELETE RESTRICT - Kan inte ta bort leverantör med produkter
// ON UPDATE CASCADE - Om ett supplier_id ändras, så uppdateras automatiskt alla produkter som refererar till det