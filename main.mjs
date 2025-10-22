import { listProducts, getProduct, addProduct, removeProduct } from "./inventory.mjs";

// Lista alla produkter
listProducts();

// Hämta en specifik produkt med ID
console.log("Hämta produkt med ID 2")
const product = getProduct(2);
if (product) {
    console.log(product);
}

// Lägg till ny produkt
addProduct("Sax", 20, 30, "Kontorsmaterial");
listProducts();

// Ta bort produkt
removeProduct(1); // Tar bort produkt med ID 1
listProducts();