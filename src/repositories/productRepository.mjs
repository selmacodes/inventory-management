// Hanterar alla databasanrop för produkter
import { pool } from "../config/db.mjs";

// Hämta alla produkter
export const getAllProducts = async () => {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    return result.rows; // Returnerar en array med produkter
};

// Hämta produkt efter ID
export const getProductById = async (id) => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0]; // Returnerar produkten (eller undefined om den inte finns)
};

// Skapa en ny produkt
export const createProduct = async ({ name, quantity, price, category }) => {
    // Kör INSERT-fråga med parametrar och returnerar den nyinlagda produkten
    const result = await pool.query(
        "INSERT INTO products (name, quantity, price, category) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, quantity, price, category]
    );
    return result.rows[0];
};

// Uppdatera produkt
export const updateProduct = async (id, { name, quantity, price, category }) => {
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
};

// Ta bort produkt
export const deleteProduct = async (id) => {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};
