import { listProducts, getProduct, addProduct, updateProduct, removeProduct } from "./inventory.mjs";

// Lista alla produkter
listProducts();

// Hämta en specifik produkt med ID
console.log("Hämta produkt med ID 2")
const product = getProduct(2);
if (product) console.log(product);

// Testa ett ID som inte finns
console.log("Hämta produkt med ID 20");
getProduct(20);

// Lägg till ny produkt
addProduct("Sax", 20, 30, "Kontorsmaterial");

console.log("Efter tillägg:")
listProducts();

// Uppdatera produkt
console.log("Uppdatera produkt med ID 2");
updateProduct(2, 25, 18); // Ändra antal och pris

console.log("Uppdatera produkt med ID 3 (bara pris)");
updateProduct(3, undefined, 130);

console.log("Efter uppdatering:")
listProducts();

// Ta bort produkt
console.log("Ta bort produkt med ID 1");
removeProduct(1);

console.log("Efter borttagning:");
listProducts();