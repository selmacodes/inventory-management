// =========================================
// Inventory Management System (Backend)
// Byggt med Node.js + Express
// =========================================

// Express är ett ramverk för att bygga API:er i Node.js
const express = require("express");
const app = express();

app.use(express.json()); // Middleware: Gör att servern kan läsa JSON-data i request body

// Lager som en array i minnet
let products = [
    { id: 1, name: "Pennor", quantity: 50, price: 2, category: "Kontorsmaterial" },
    { id: 2, name: "Anteckningsblock", quantity: 30, price: 15, category: "Kontorsmaterial" },
    { id: 3, name: "Häftapparat", quantity: 10, price: 120, category: "Kontorsmaterial" },
    { id: 4, name: "Pärm", quantity: 25, price: 35, category: "Kontorsmaterial" },
    { id: 5, name: "Tuschpennor", quantity: 40, price: 25, category: "Kontorsmaterial" }
];
let nextId = 6; // Nästa lediga ID


// CREATE - POST /products - Skapa en ny produkt
app.post("/products", (req, res) => {
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

    // Skapa produktobjekt
    const newProduct = { id: nextId++, name: name.trim(), quantity, price, category: category.trim() };

    // Lägg till i arrayen
    products.push(newProduct);

    // Skicka tillbaka med statuskod 201 (Created)
    res.status(201).json(newProduct);
});


// READ - GET /products - Hämta alla produkter
app.get("/products", (req, res) => {
    res.json(products);
});

// READ - GET /products/:id - Hämtar en specifik produkt
app.get("/products/:id", (req, res) => {
    const id = parseInt(req.params.id); // Hämtar ID från URL-parametern och omvandlar till heltal

    // Validering: Kontrollera att id är ett nummer
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    const product = products.find(p => p.id === id); // Söker i arrayen efter produkten med det ID:t
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
});

// UPDATE - PUT /products/:id - Uppdatera en befintlig produkt
app.put("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // Validering: Kontrollera att ID är ett nummer
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
    }

    const product = products.find(p => p.id === id); // Letar upp produkten i arrayen products
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    const { name, quantity, price, category } = req.body; // Hämtar värdena från requestens body

    // Validera och uppdatera 'name' om det skickas med
    if (name !== undefined) {
        // Kontrollera att det är en sträng och inte tom
        if (typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ error: "'name' cannot be empty"});
        }
        product.name = name.trim(); // Uppdaterar produktens namn och tar bort extra mellanslag
    }

    // Validera och uppdatera 'category' om det skickas med
    if (category !== undefined) {
        if (typeof category !== "string" || category.trim().length === 0) {
            return res.status(400).json({ error: "'category' cannot be empty"});
        }
        product.category = category.trim();
    }

    // Validera och uppdatera 'quantity' om det skickas med
    if (quantity !== undefined) {
        // Kontrollera att det är ett heltal och inte negativt
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({ error: "'quantity' cannot be negative and must be an integer"});
        }
        product.quantity = quantity;
    }

    // Validera och uppdatera 'price' om det skickas med
    if (price !== undefined) {
        // Kontrollera att det är ett nummer och inte negativt
        if (typeof price !== "number" || price < 0) {
            return res.status(400).json({ error: "'price' cannot be negative and must be a number"});
        }
        product.price = price;
    }

    // Skicka tillbaka den uppdaterade produkten som JSON
    res.json(product);
});


// DELETE - DELETE /products/:id - Ta bort en produkt
app.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const deleted = products.splice(productIndex, 1)[0]; // Tar bort produkten från arrayen och sparar borttaget element
    res.json({ message: "Product deleted", product: deleted });
})

// Startar servern
app.listen(3012, () => console.log("Server running on port 3012"));