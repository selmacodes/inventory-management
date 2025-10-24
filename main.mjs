import { listProducts, getProduct, addProduct, updateProduct, removeProduct } from "./inventory.mjs";

// Lista alla produkter
console.log("Produkter i lagret:")
console.log(listProducts());


// Hämta en specifik produkt med ID
console.log("\nHämta produkt med ID 2")
try {
    const product = getProduct(2);
    console.log(product);
} catch (err) {
    console.log("Fel!", err.message);
}


// Lägg till produkt
console.log("\nLägg till produkten Sax, antal: 20, pris: 30:");
try {
    const result = addProduct("Sax", 20, 30, "Kontorsmaterial");
    console.log(result.message);
    console.log("\nAlla produkter i lagret efter tillägg:");
    console.log(listProducts());
} catch (err) {
    console.log("Fel!", err.message);
}


// Uppdatera produkt
console.log("\nUppdatera produkt med ID 2 till antal: 25, pris: 18");
try {
    const result = updateProduct(2, 25, 18); // Ändra antal och pris
    console.log(result.message);
    console.log("\nAlla produkter i lagret efter uppdatering:")
    console.log(listProducts());
} catch (err) {
    console.log("Fel!", err.message);
}

console.log("\nUppdatera produkt med ID 3 till pris: 130");
try {
    const result = updateProduct(3, undefined, 130);
    console.log(result.message);
    console.log("\nAlla produkter i lagret efter uppdatering:")
    console.log(listProducts());
} catch (err) {
    console.log("Fel!", err.message);
}


// Ta bort produkt
console.log("Ta bort produkt med ID 1");
try {
    const result = removeProduct(1);
    console.log(result.message);
    console.log("\nAlla produkter i lagret efter borttagning:");
    console.log(listProducts());
} catch (err) {
    console.log("Fel!", err.message);
}
