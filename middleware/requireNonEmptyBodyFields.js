export function requireNonEmptyBodyFields(fields = []) {
  return (req, res, next) => {
    const emptyFields = fields.filter(
      f => !req.body[f] || req.body[f].toString().trim() === ''
    );

    if (emptyFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'There are empty fields',
        data: {
          emptyFields
        }
      });
    }

    next();
  };
}
