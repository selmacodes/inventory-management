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
    // Anropar repository-funktion som hämtar alla produkter från databasen
    const products = await getAllProducts();

    // Skickar tillbaka produkterna som JSON
    res.json(products);
});

// GET /products/:id - Hämta specifik produkt
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id); // Konvertera URL-parametern till ett heltal

    // Validering: Kontrollera att ID är ett nummer
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    // Hämta produkten med det specifika ID:t
    const product = await getProductById(id);

    // Om ingen produkt hittas, skicka 404
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
});

// POST /products - Skapa ny produkt
router.post("/", async (req, res) => {
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

    // Skapa ny produkt i databasen
    const product = await createProduct({ name, quantity, price, category });

    // Skicka tillbaka den nyinlagda produkten med statuskod 201 (Created)
    res.status(201).json(product);
});

// PUT /products/:id - Uppdatera en befintlig produkt
router.put("/:id", async (req, res) => {
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

    // Anropa repository-funktionen som använder COALESCE för att behålla gamla värden
    const product = await updateProduct(id, { name, quantity, price, category });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
});

// DELETE /products/:id - Ta bort produkt
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    // Ta bort produkten med angivet ID
    const product = await deleteProduct(id);

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted", product });
});

// Exporterar router för att kunna användas i app.mjs
export default router;