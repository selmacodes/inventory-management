import express from "express";

import {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getProductsBySupplier
} from "../repositories/supplierRepository.mjs";

import { validateSupplierData } from "../helpers/validationHelpers.mjs";

const router = express.Router();

// GET /suppliers - Hämtar alla leverantörer
router.get("/", async (req, res) => {
    try {
        const suppliers = await getAllSuppliers();
        res.json(suppliers);
    } catch (err) {
        console.error("DB ERROR - getAllSuppliers:", err);
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
});

// GET /suppliers/:id - Hämtar en specifik leverantör baserat på ID
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    try {
        const supplier = await getSupplierById(id);
        if (!supplier) return res.status(404).json({ error: "Supplier not found" });
        res.json(supplier);
    } catch (err) {
        console.error(`DB ERROR - getSupplierById (ID: ${id}):`, err);
        res.status(500).json({ error: "Failed to fetch supplier" });
    }
});

// POST /suppliers - Skapar en ny leverantör
router.post("/", async (req, res) => {
    // Validera indata, false = create-mode
    const { errors, trimmedData } = validateSupplierData(req.body, false);

    // Om valideringsfel finns, returnera dem
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const supplier = await createSupplier(trimmedData);
        res.status(201).json(supplier);
    } catch (err) {
        console.error("DB ERROR - createSupplier:", err);
        res.status(500).json({ error: "Failed to create supplier" });
    }
});

// PUT /suppliers/:id - Uppdaterar en leverantör baserat på ID
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    // Kolla om body är tom
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "At least one field must be provided for update" })
    }

    // true = update-mode (kräver inte alla fält)
    const { errors, trimmedData } = validateSupplierData(req.body, true);

    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const supplier = await updateSupplier(id, trimmedData);
        if (!supplier) return res.status(404).json({ error: "Supplier not found" });
        res.json(supplier);
    } catch (err) {
        console.error(`DB ERROR - updateSupplier (ID: ${id}):`, err);
        res.status(500).json({ error: "Failed to update supplier" });
    }
});

// DELETE /suppliers/:id - Tar bort en leverantör baserat på ID
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    try {
        const supplier = await deleteSupplier(id);

        // Om ingen rad raderades -> ingen leverantör hittad
        if (!supplier) return res.status(404).json({ error: "Supplier not found" });

        res.json({ message: "Supplier deleted", supplier });
    } catch (err) {
        console.error(`DB ERROR - deleteSupplier (ID: ${id}):`, err);
        res.status(500).json({ error: "Failed to delete supplier" });
    }
});

// GET /suppliers/:id/products - Hämtar alla produkter kopplade till en specifik leverantör
router.get("/:id/products", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    try {
        const products = await getProductsBySupplier(id);
        res.json(products);
    } catch (err) {
        console.error(`DB ERROR - getProductsBySupplier (ID: ${id}):`, err);
        res.status(500).json({ error: "Failed to fetch supplier products" });
    }
});

export default router;