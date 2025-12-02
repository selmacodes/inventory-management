// Hanterar alla databasanrop för produkter
import { pool } from "../config/db.mjs";

// Hämta alla produkter med leverantörsinformation
export async function getAllProducts() {
    try {
        const result = await pool.query(`
            SELECT p.*, 
                jsonb_build_object(
                    'id', s.id, 
                    'name', s.name, 
                    'contact_person', s.contact_person,
                    'email', s.email, 
                    'phone', s.phone, 
                    'country', s.country
                ) AS supplier
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.id ASC
        `);
        return result.rows;
    } catch (err) {
        throw err; // Skickas vidare till routen som svarar med felkod
    }
}

// Hämta produkt efter ID med leverantörsinformation
export async function getProductById(id) {
    try {
        const result = await pool.query(`
            SELECT p.*, 
                jsonb_build_object(
                    'id', s.id, 
                    'name', s.name, 
                    'contact_person', s.contact_person,
                    'email', s.email, 
                    'phone', s.phone, 
                    'country', s.country
                ) AS supplier
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = $1
        `, [id]);
        return result.rows[0]; // Returnerar produkten (eller undefined om den inte finns)
    } catch (err) {
        throw err;
    }
}

// Skapa en ny produkt
export async function createProduct ({ name, quantity, price, category, supplier_id }) {
    try {
        // Kör INSERT-fråga med parametrar och returnerar den nyinlagda produkten
        const result = await pool.query(
            `INSERT INTO products (name, quantity, price, category, supplier_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [name, quantity, price, category, supplier_id]
        );
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

// Uppdatera produkt
export async function updateProduct (id, { name, quantity, price, category, supplier_id }) {
    try {
        // Kör UPDATE-fråga och använder COALESCE för att behålla gamla värden om inget nytt värde skickas med
        const result = await pool.query(`
            UPDATE products
            SET
                name = COALESCE($1, name),
                quantity = COALESCE($2, quantity),
                price = COALESCE($3, price),
                category = COALESCE($4, category),
                supplier_id = COALESCE($5, supplier_id)
            WHERE id = $6
            RETURNING *
        `, [name, quantity, price, category, supplier_id, id]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

// Ta bort produkt
export async function deleteProduct(id) {
    try {
        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

