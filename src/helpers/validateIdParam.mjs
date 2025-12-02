export function validateIdParam(req, res, next) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }
    req.params.id = id; // Sparar det parserade ID:t för resten av route-funktionen
    next();
}