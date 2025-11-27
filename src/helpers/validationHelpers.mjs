// Validerar produktdata för både skapande (POST) och uppdatering (PUT)
// isUpdate = false innebär att alla fält krävs (POST)
// isUpdate = true innebär att fält kan saknas och uppdateras delvis (PUT)
export function validateProductData({ name, quantity, price, category, supplier_id }, isUpdate = false) {
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

    // Validering av supplier_id
    if (!isUpdate || supplier_id !== undefined) {
        if (!Number.isInteger(supplier_id) || supplier_id <= 0) {
            errors.push("'supplier_id' is required and must be a positive integer");
        }
    }

    // Returnera errors + de trimmade/validerande värdena
    const trimmedData = { name, quantity, price, category, supplier_id };
    return { errors, trimmedData };
}

// Validerar och trimmar indata för leverantörer
export function validateSupplierData({ name, contact_person, email, phone, country }, isUpdate = false) {
    const errors = [];

    // Namn
    // Vid CREATE: name måste finnas
    // Vid UPDATE: validera bara om fältet skickas med
    if (!isUpdate || name !== undefined) {
        if (typeof name !== "string" || name.trim().length === 0) {
            errors.push("'name' is required and must be a non-empty string");
        } else {
            name = name.trim();
        } 
    }

    // Kontaktperson
    if (!isUpdate || contact_person !== undefined) {
        if (typeof contact_person !== "string" || contact_person.trim().length === 0) {
            errors.push("'contact_person' must be a non-empty string");
        } else {
            contact_person = contact_person.trim();
        } 
    }

    // Email
    if (!isUpdate || email !== undefined) {
        if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("'email' must be a valid email address");
        } else {
            email = email.trim();
        }
    }

    // Telefonnummer
    if (!isUpdate || phone !== undefined) {
        if (typeof phone !== "string" || phone.trim().length < 5) {
            errors.push("'phone' must be a string with at least 5 characters");
        } else {
            phone = phone.trim();
        } 
    }

    // Land
    if (!isUpdate || country !== undefined) {
        if (typeof country !== "string" || country.trim().length === 0) {
            errors.push("'country' must be a non-empty string");
        } else {
            country = country.trim();
        } 
    }

    return { errors, trimmedData: { name, contact_person, email, phone, country } };
}