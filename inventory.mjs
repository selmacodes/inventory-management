// En array som representerar lagret
let products = [
    { id: 1, name: "Pennor", quantity: 50, price: 2, category: "Kontorsmaterial" },
    { id: 2, name: "Anteckningsblock", quantity: 30, price: 15, category: "Kontorsmaterial" },
    { id: 3, name: "Häftapparat", quantity: 10, price: 120, category: "Kontorsmaterial" },
    { id: 4, name: "Pärm", quantity: 25, price: 35, category: "Kontorsmaterial" },
    { id: 5, name: "Tuschpennor", quantity: 40, price: 25, category: "Kontorsmaterial" }
];

// Lista alla produkter
export function listProducts() {
    console.log("Produkter i lagret:");
    products.forEach(p => {
        console.log(`${p.id}: ${p.name} (${p.category}) - Antal: ${p.quantity}, Pris: ${p.price} kr`);
    });
}

// Hämta produkt med ID
export function getProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        return product;
    } else {
        console.log(`Ingen produkt hittades med ID ${id}.`);
        return null;
    }
}

// Lägg till produkt
export function addProduct(name, quantity, price, category) {
    let id = 1;
    if (products.length > 0) {
        id = products[products.length-1].id + 1;
    }

    products.push({ id, name, quantity, price, category});

    console.log(`Produkt "${name}" har lagts till.`);
}

// Ta bort produkt
export function removeProduct(id) {
    // Hitta index för produkten med det angivna ID:t
    // Om ingen produkt hittas blir index = -1
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        const removed = products.splice(index, 1);
        console.log(`Produkt "${removed[0].name}" har tagits bort.`)
    } else {
        console.log(`Ingen produkt hittades med ID ${id}.`)
    }
}