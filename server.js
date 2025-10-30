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
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});


// Startar servern
app.listen(3012, () => console.log('Server running on port 3012'));