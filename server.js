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
    const productIndex = products.findIndex(p => p.id === id); // Hittar indexet i arrayen där produkten med ID:t finns
    // findIndex() returnerar -1 om inget element matchar callback-funktionen (villkoret)
    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const { name, quantity, price, category } = req.body; // Hämtar värdena från requestens body

    // Validering
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
        return res.status(400).json({ error: "Invalid quantity" });
    }
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
        return res.status(400).json({ error: "Invalid price" });
    }

    // Skapar en ny produkt genom att kopiera den gamla och uppdatera med värden från req.body
    const updatedProduct = { ...products[productIndex], ...req.body };

    products[productIndex] = updatedProduct; // Sparar den uppdaterade produkten tillbaka i arrayen
    res.json(updatedProduct); // Skickar tillbaka den uppdaterade produkten som svar
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