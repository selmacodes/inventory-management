// Validerar och trimmar produktdata
export function validateProductData({ name, quantity, price, category }, isUpdate = false) {
    const errors = [];

    // Trimma strängar först
    if (typeof name === "string") name = name.trim();
    if (typeof category === "string") category = category.trim();

    // Validering av name
    if (!isUpdate || name !== undefined) {
        if (typeof name !== "string" || name.length === 0) {
            errors.push("'name' is required and must be a non-empty string");
        }
    }

    // Validering av category
    if (!isUpdate || category !== undefined) {
        if (typeof category !== "string" || name.length === 0) {
            errors.push("'category' is required and must be a non-empty string");
        }
    }

    // Validering av quantity
    if (!isUpdate || quantity !== undefined) {
        if (!Number.isInteger(quantity) || quantity < 0) {
            errors.push("'quantity' cannot be negative and must be an integer");
        }
    }

    // Validering av price
    if (!isUpdate || price !== undefined) {
        if (typeof price !== "number" || price < 0) {
            errors.push("'price' cannot be negative and must be an integer");
        }
    }

    // Returnerar både fel och trimmade värden
    return { errors, trimmedData: { name, quantity, price, category } };

}
