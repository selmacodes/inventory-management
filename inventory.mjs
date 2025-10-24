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
    return products;
}

// Hämta produkt med ID
export function getProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) throw new Error(`Ingen produkt hittades med ID ${id}`);
    return product;
}

// Lägg till produkt
export function addProduct(name, quantity, price, category) {
    // Guard clauses för validering
    if (!name || typeof name !== "string") throw new Error("Ogiltigt namn!");
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error("Ogiltigt antal!");
    if (typeof price !== "number" || price < 0) throw new Error("Ogiltigt pris!");
    if (!category || typeof category !== "string") throw new Error("Ogiltig kategori!");

    let id = 1;
    if (products.length > 0) {
        const lastProduct = products[products.length - 1]; // Ta sista produkten
        id = lastProduct.id + 1; // Öka med 1
    } else {
        id = 1; // Om lagret är tomt får produkten ID 1
    }

    const newProduct = { id, name, quantity, price, category };
    products.push(newProduct);

    return { message: `Produkten "${name}" har lagts till.`, product: newProduct };
}

// Uppdatera produkt
export function updateProduct(id, newQuantity, newPrice) {
    const product = products.find(p => p.id === id);
    if (!product) throw new Error(`Ingen produkt hittades med ID ${id}.`);

    if (newQuantity !== undefined) {
        if (!Number.isInteger(newQuantity) || newQuantity < 0) throw new Error("Ogiltigt antal!");
        product.quantity = newQuantity;
    }

    if (newPrice !== undefined) {
        if (typeof newPrice !== "number" || newPrice < 0) throw new Error("Ogiltigt pris!");
        product.price = newPrice;
    }

    return { message: `Produkt "${product.name}" har uppdaterats.`, product };
}

// Ta bort produkt
export function removeProduct(id) {
    // Hitta index för produkten med det angivna ID:t
    // Om ingen produkt hittas blir index = -1
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Ingen produkt hittades med ID ${id}.`);

    const removedArray = products.splice(index, 1);
    const removed = removedArray[0]; // Plockar ut första (och enda) elementet
    
    return { message: `Produkt "${removed.name}" har tagits bort.`, product: removed };
}
