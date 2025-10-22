import { listProducts, addProduct, removeProduct } from "./inventory.mjs";

// Lista alla produkter
listProducts();

// Lägg till ny produkt
addProduct("Sax", 20, 30, "Kontorsmaterial");
listProducts();

// Ta bort produkt
removeProduct(1); // Tar bort produkt med ID 1
listProducts();