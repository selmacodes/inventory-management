// Hanterar alla databasanrop för produkter
import { pool } from "../config/db.mjs";

// Hämta alla produkter
export const getAllProducts = async () => {
    try {
        // Kör en SELECT-fråga som returnerar alla produkter sorterade efter ID
        const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
        return result.rows;
    } catch (err) {
        console.error("DB ERROR - getAllProducts:", err);
        throw err; // Skickas vidare till routen som svarar med felkod
    }
};

// Hämta produkt efter ID
export const getProductById = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        return result.rows[0]; // Returnerar produkten (eller undefined om den inte finns)
    } catch (err) {
        console.error("DB ERROR - getProductById:", err);
        throw err;
    }
};

// Skapa en ny produkt
export const createProduct = async ({ name, quantity, price, category }) => {
    try {
        // Kör INSERT-fråga med parametrar och returnerar den nyinlagda produkten
        const result = await pool.query(
            "INSERT INTO products (name, quantity, price, category) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, quantity, price, category]
        );
        return result.rows[0];
    } catch (err) {
        console.error("DB ERROR - createProduct:", err);
        throw err;
    }
};

// Uppdatera produkt
export const updateProduct = async (id, { name, quantity, price, category }) => {
    try {
        // Kör UPDATE-fråga och använder COALESCE för att behålla gamla värden om inget nytt värde skickas med
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
        return result.rows[0];
    } catch (err) {
        console.error("DB ERROR - updateProduct:", err);
        throw err;
    }
};

// Ta bort produkt
export const deleteProduct = async (id) => {
    try {
        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (err) {
        console.error("DB ERROR - deleteProduct:", err);
        throw err;
    }
};
