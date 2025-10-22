import { listProducts, addProduct } from "./inventory.mjs";

// Lista alla produkter
listProducts();

// Lägg till ny produkt
addProduct("Sax", 20, 30, "Kontorsmaterial");
listProducts();