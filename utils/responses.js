// Standardized JSON response helpers

export function successResponse(data = null, message = '') {
  return { success: true, data, message };
}

export function errorResponse(error = null, message = '') {
  return { success: false, error, message };
}
