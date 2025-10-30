const express = require('express');
const app = express();

app.use(express.json());

// Lager som en array
let products = [
    { id: 1, name: "Pennor", quantity: 50, price: 2, category: "Kontorsmaterial" },
    { id: 2, name: "Anteckningsblock", quantity: 30, price: 15, category: "Kontorsmaterial" },
    { id: 3, name: "Häftapparat", quantity: 10, price: 120, category: "Kontorsmaterial" },
    { id: 4, name: "Pärm", quantity: 25, price: 35, category: "Kontorsmaterial" },
    { id: 5, name: "Tuschpennor", quantity: 40, price: 25, category: "Kontorsmaterial" }
];

let nextId = 6; // Nästa lediga ID

// CREATE - Lägger till en ny produkt
app.post('/products', (req, res) => {
    const { name, quantity, price, category } = req.body;

    if (!name || !category || quantity == null || price == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newProduct = { id: nextId++, name, quantity, price, category };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// READ all - Hämtar alla produkter
app.get('/products', (req, res) => {
    res.json(products);
});

// READ one - Hämtar en produkt med specifikt ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id); // Hämtar ID från URL-parametern och omvandlar till heltal
    const product = products.find(p => p.id === id); // Söker i arrayen efter produkten med det ID:t
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// UPDATE - Uppdatera antal och/eller pris
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id); // Hittar indexet i arrayen där produkten med ID:t finns
    // findIndex() returnerar -1 om inget element matchar callback-funktionen (villkoret)
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { name, quantity, price, category } = req.body; // Hämtar värdena från requestens body

    // Validering
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ error: 'Invalid price' });
    }

    // Skapar en ny produkt genom att kopiera den gamla och uppdatera med värden från req.body
    const updatedProduct = { ...products[productIndex], ...req.body };

    products[productIndex] = updatedProduct; // Sparar den uppdaterade produkten tillbaka i arrayen
    res.json(updatedProduct); // Skickar tillbaka den uppdaterade produkten som svar
});

// Startar servern
app.listen(3012, () => console.log('Server running on port 3012'));