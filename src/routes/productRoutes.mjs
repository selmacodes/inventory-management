// Definierar alla API-endpoints för produkter
import express from "express";

// Importerar alla funktioner från produkt-repository som hanterar databasanrop
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../repositories/productRepository.mjs";

// Importera valideringshelper
import { validateProductData } from "../helpers/validationHelpers.mjs";

// Skapar en router-instans från Express för att definiera routes
const router = express.Router();

// GET /products - Hämta alla produkter
router.get("/", async (req, res) => {
    try {
        // Anropar repository-funktion som hämtar alla produkter från databasen
        const products = await getAllProducts();

        // Skickar tillbaka produkterna som JSON
        res.json(products);
    } catch (err) {
        console.error("DB ERROR - getAllProducts:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// GET /products/:id - Hämta specifik produkt
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id); // Konvertera URL-parametern till ett heltal

    // Validering: Kontrollera att ID är ett nummer
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    try {
        // Hämta produkten med det specifika ID:t
        const product = await getProductById(id);

        // Om ingen produkt hittas, skicka 404
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product);
    } catch (err) {
        console.error(`DB ERROR - getProductById (ID: ${id}):`, err);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

// POST /products - Skapa ny produkt
router.post("/", async (req, res) => {
    const { errors, trimmedData } = validateProductData(req.body, false); // false = skapa

    // Returnera valideringsfel till klienten om det finns några
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        // Skapa ny produkt i databasen
        const product = await createProduct(trimmedData);

        // Skicka tillbaka den nyinlagda produkten med statuskod 201 (Created)
        res.status(201).json(product);
    } catch (err) {
        console.error("DB ERROR - createProducts:", err);
        res.status(500).json({ error: "Failed to create product" });
    }
});

// PUT /products/:id - Uppdatera befintlig produkt
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    // Kolla om body är tom
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "At least one field must be provided for update" })
    }

    const { errors, trimmedData } = validateProductData(req.body, true); // true = uppdatera

    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const product = await updateProduct(id, trimmedData);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        console.error(`DB ERROR - updateProduct (ID: ${id}):`, err);
        res.status(500).json({ error: "Failed to update product" });
    }
});

// DELETE /products/:id - Ta bort produkt
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    try {
        const product = await deleteProduct(id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted", product });
    } catch (err) {
        console.error(`DB ERROR - deleteProduct (ID: ${id}):`, err);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// Exporterar router för att kunna användas i app.mjs
export default router;