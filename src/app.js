// =========================================
// Inventory Management System (Backend)
// Node.js + Express + PostgreSQL
// =========================================


// Läser in miljövariabler från .env
require("dotenv").config();

const express = require("express"); // Importerar Express-ramverket
const { Pool } = require("pg");     // Importerar PostgreSQL-klienten

const app = express();              // Skapar en Express-app

app.use(express.json()); // Middleware för att kunna läsa JSON i request body

// PostgreSQL Connection Pool
const pool = new Pool({
    host: "localhost",              // Databasens host
    port: 5432,                     // Databasens port
    database: process.env.DATABASE_NAME, // Namn på databasen från .env
    user: process.env.DATABASE_USER,     // Databasanvändare från .env
    password: process.env.DATABASE_PASSWORD // Lösenord från .env
});


// CREATE - POST /products - Skapa en ny produkt
app.post("/products", async (req, res) => {
    const { name, quantity, price, category } = req.body;

    // Validering: Kontrollera att name och category finns och inte är tomma
    if (!name || name.trim().length === 0 || !category || category.trim().length === 0) {
        return res.status(400).json({ error: "'name' and 'category' are required and cannot be empty" });
    }

    // Validering: Kontrollera datatyper
    if (typeof name !== "string" || typeof category !== "string") {
        return res.status(400).json({ error: "'name' and 'category' must be strings" });
    }

    // Validering: Kontrollera att quantity är ett icke-negativt heltal
    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({ error: "'quantity' cannot be negative and must be an integer" });
    }

    // Validering: Kontrollera att price är ett icke-negativt nummer
    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ error: "'price' cannot be negative and must be a number" });
    }

    // SQL-fråga: Infogar produkten i databasen och returnerar den nya raden
    const result = await pool.query(
        "INSERT INTO products (name, quantity, price, category) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, quantity, price, category]
    );

    // Skicka tillbaka den skapade produkten med statuskod 201 (Created)
    res.status(201).json(result.rows[0]);
});


// READ - GET /products - Hämta alla produkter
app.get("/products", async (req, res) => {
    // SQL-fråga: Hämta alla produkter, sorterade efter id
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
});


// READ - GET /products/:id - Hämtar en specifik produkt
app.get("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id); // Konvertera URL-parametern till ett heltal

    // Validering: Kontrollera att id är ett nummer
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    // SQL-fråga: Hämta produkt med specifikt ID
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });

    res.json(result.rows[0]);
});


// UPDATE - PUT /products/:id - Uppdatera en befintlig produkt
app.put("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    // Validering: Kontrollera att ID är ett nummer
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    let { name, quantity, price, category } = req.body; // Hämtar värdena från requestens body

    // Validera och uppdatera 'name' om det skickas med
    if (name !== undefined) {
        // Kontrollera att det är en sträng och inte tom
        if (typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ error: "'name' cannot be empty" });
        }
        name = name.trim(); // Uppdaterar produktens namn och tar bort extra mellanslag
    }

    // Validera och uppdatera 'category' om det skickas med
    if (category !== undefined) {
        if (typeof category !== "string" || category.trim().length === 0) {
            return res.status(400).json({ error: "'category' cannot be empty" });
        }
        category = category.trim();
    }

    // Validera och uppdatera 'quantity' om det skickas med
    if (quantity !== undefined) {
        // Kontrollera att det är ett heltal och inte negativt
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({ error: "'quantity' cannot be negative and must be an integer" });
        }
    }

    // Validera och uppdatera 'price' om det skickas med
    if (price !== undefined) {
        // Kontrollera att det är ett nummer och inte negativt
        if (typeof price !== "number" || price < 0) {
            return res.status(400).json({ error: "'price' cannot be negative and must be a number" });
        }
    }

    // SQL-fråga: Uppdatera produkten, använd COALESCE för att behålla gamla värden om inget skickas
    const result = await pool.query(
        `
        UPDATE products
        SET
            name = COALESCE($1, name),
            quantity = COALESCE($2, quantity),
            price = COALESCE($3, price),
            category = COALESCE($4, category)
        WHERE id = $5
        RETURNING *;
        `,
        [name, quantity, price, category, id]
    );

    // Om ingen produkt uppdaterades -> 404
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });

    // Skicka tillbaka den uppdaterade produkten
    res.json(result.rows[0]);
});


// DELETE - DELETE /products/:id - Ta bort en produkt
app.delete("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    // SQL-fråga: Ta bort produkt med specifikt ID och returnera raden
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });

    // Skickar tillbaka borttagen produkt
    res.json({ message: "Product deleted", product: result.rows[0] });
});

// Startar servern på port 3012
app.listen(3012, () => console.log("Server running on port 3012"));
