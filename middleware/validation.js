// middleware/validation.js

/**
 * Checks that required fields EXIST in req.body
 * (does NOT check if they are empty strings)
 */
export function requireBodyFields(fields = []) {
  return (req, res, next) => {
    const missingFields = fields.filter(
      (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Missing required fields',
        data: {
          missingFields
        }
      });
    }

    next();
  };
}

/**
 * Checks that required fields are NOT empty
 * (null, undefined, or empty string)
 */
export function requireNonEmptyBodyFields(fields = []) {
  return (req, res, next) => {
    const emptyFields = fields.filter(
      (field) =>
        req.body[field] === undefined ||
        req.body[field] === null ||
        String(req.body[field]).trim() === ''
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
