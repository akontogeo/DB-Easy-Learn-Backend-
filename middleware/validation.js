// Middleware to validate required fields in request body
export function requireBodyFields(fields = []) {
  return (req, res, next) => {
    const missing = fields.filter(f => !(f in req.body));
    if (missing.length) return res.status(400).json({ success: false, error: `Missing fields: ${missing.join(', ')}` });
    next();
  };
}
