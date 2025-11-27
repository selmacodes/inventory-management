// Hanterar alla databasanrop för leverantörer
import { pool } from "../config/db.mjs";

// Hämta alla leverantörer
export async function getAllSuppliers() {
    try {
        const result = await pool.query("SELECT * FROM suppliers ORDER BY id ASC");
        return result.rows;
    } catch (err) {
        console.error("DB ERROR - getAllSuppliers:", err);
        throw err;
    }
}

// Hämta leverantör + antal produkter (count)
export async function getSupplierById(id) {
    try {
        const result = await pool.query(
            `SELECT s.*, COUNT(p.id) AS product_count
            FROM suppliers s
            LEFT JOIN products p ON p.supplier_id = s.id
            WHERE s.id = $1
            GROUP BY s.id`,
            [id]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`DB ERROR - getSupplierById (ID: ${id}):`, err);
        throw err;
    }
}

// Skapa en ny leverantör
export async function createSupplier({ name, contact_person, email, phone, country }) {
    try {
        const result = await pool.query(
            `INSERT INTO suppliers (name, contact_person, email, phone, country)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [name, contact_person, email, phone, country]
        );
        return result.rows[0];
    } catch (err) {
        console.error("DB ERROR - createSupplier:", err);
        throw err;
    }
}

// Uppdatera leverantör
export async function updateSupplier(id, { name, contact_person, email, phone, country }) {
    try {
        const result = await pool.query(
            `UPDATE suppliers
            SET
                name = COALESCE($1, name),
                contact_person = COALESCE($2, contact_person),
                email = COALESCE($3, email),
                phone = COALESCE($4, phone),
                country = COALESCE($5, country)
            WHERE id = $6
            RETURNING *`,
            [name, contact_person, email, phone, country, id]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`DB ERROR - updateSupplier (ID: ${id}):`, err);
        throw err;
    }
}

// Ta bort leverantör
export async function deleteSupplier(id) {
    try {
        const result = await pool.query(
            "DELETE FROM suppliers WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`DB ERROR - deleteSupplier (ID: ${id}):`, err);
        throw err;
    }
}

// Hämta alla produkter från en specifik leverantör
export async function getProductsBySupplier(supplierId) {
    try {
        const result = await pool.query(
            `SELECT p.*
            FROM products p
            WHERE p.supplier_id = $1
            ORDER BY p.id ASC`,
            [supplierId]
        );
        return result.rows;
    } catch (err) {
        console.error(`DB ERROR - getProductsBySupplier (supplierId: ${supplierId}):`, err);
        throw err;
    }
}