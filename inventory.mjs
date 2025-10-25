// Produktklass
export class Product {
    constructor(id, name, quantity, price, category) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
    }

    updatePrice(newPrice) {
        if (typeof newPrice !== "number" || newPrice < 0) throw new Error("Ogiltigt pris!");
        this.price = newPrice;
    }

    updateQuantity(newQuantity) {
        if (!Number.isInteger(newQuantity) || newQuantity < 0) throw new Error("Ogiltigt antal!");
        this.quantity = newQuantity;
    }
}

// Array som representerar lagret
export const products = [
    new Product(1, "Pennor", 50, 2, "Kontorsmaterial"),
    new Product(2, "Anteckningsblock", 30, 15, "Kontorsmaterial"),
    new Product(3, "Häftapparat", 10, 120, "Kontorsmaterial"),
    new Product(4, "Pärm", 25, 35, "Kontorsmaterial"),
    new Product(5, "Tuschpennor", 40, 25, "Kontorsmaterial")
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

    // Skapa nytt ID
    let id = 1;
    if (products.length > 0) {
        const lastProduct = products[products.length - 1]; // Ta sista produkten
        id = lastProduct.id + 1; // Öka med 1
    } else {
        id = 1; // Om lagret är tomt får produkten ID 1
    }

    const newProduct = new Product(id, name, quantity, price, category);
    products.push(newProduct);
    
    return { message: `Produkten "${name}" har lagts till.`, product: newProduct };
}

// Uppdatera produkt
export function updateProduct(id, newQuantity, newPrice) {
    const product = getProduct(id);
    if (newQuantity !== undefined) product.updateQuantity(newQuantity);
    if (newPrice !== undefined) product.updatePrice(newPrice);
    
    return { message: `Produkten "${product.name}" har uppdaterats.`, product };
}

// Ta bort produkt
export function removeProduct(id) {
    // Hitta index för produkten med det angivna ID:t
    // Om ingen produkt hittas blir index = -1
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Ingen produkt hittades med ID ${id}.`);

    const removedArray = products.splice(index, 1);
    const removed = removedArray[0]; // Plockar ut första (och enda) elementet

    return { message: `Produkten "${removed.name}" har tagits bort.`, product: removed };
}
