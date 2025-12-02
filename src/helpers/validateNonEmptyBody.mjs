export function validateNonEmptyBody(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "At least one field must be provided for update" })
    }
    next();
}