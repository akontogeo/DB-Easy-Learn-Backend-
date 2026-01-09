// Admin credentials for basic authentication
export const DEFAULT_ADMIN = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'adminpass'
};

export const RESPONSE_OK = { success: true };
