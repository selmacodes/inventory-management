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
        return res.status(400).json({ error: "ID parameter must be a number" });
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
    let { name, quantity, price, category } = req.body;

    // Trimma strängar innan validering, så " " inte godkänns
    if (typeof name === "string") name = name.trim();
    if (typeof category === "string") category = category.trim();

    // Validering: Kontrollera att name och category finns, är strängar och inte tomma
    if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "'name' is required and must be a non-empty string" });
    }
    if (typeof category !== "string" || category.trim().length === 0) {
        return res.status(400).json({ error: "'category' is required and must be a non-empty string" });
    }

    // Validering: quantity och price
    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({ error: "'quantity' cannot be negative and must be an integer" });
    }
    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ error: "'price' cannot be negative and must be a number" });
    }

    try {
        // Skapa ny produkt i databasen
        const product = await createProduct({ name, quantity, price, category });

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

    // Validering: Kontrollera att ID är ett nummer
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    let { name, quantity, price, category } = req.body; // Hämtar värdena från requestens body

    // Trimma strängar
    if (name !== undefined) name = name.trim();
    if (category !== undefined) category = category.trim();

    // Validera indata innan uppdatering
    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
        return res.status(400).json({ error: "'name' cannot be empty" });
    }
    if (category !== undefined && (typeof category !== "string" || category.trim().length === 0)) {
        return res.status(400).json({ error: "'category' cannot be empty" });
    }
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
        return res.status(400).json({ error: "'quantity' cannot be negative and must be an integer" });
    }
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
        return res.status(400).json({ error: "'price' cannot be negative and must be a number" });
    }

    try {
        // Uppdatera produkt via repository
        const product = await updateProduct(id, { name, quantity, price, category });

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
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    try {
        // Ta bort produkten med angivet ID
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