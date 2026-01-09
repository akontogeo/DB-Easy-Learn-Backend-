/**
 * Mock user data for testing and development.
 * @typedef {Object} UserMock
 * @property {number} userId - Unique user identifier
 * @property {string} username - Username
 * @property {string} email - Email address
 * @property {boolean} isPremium - Whether the user is premium
 * @property {string} password - User password (plain text for mock only)
 * @property {Array<number>} enrolledCourses - List of enrolled course IDs
 */
export const users = [
  { userId: 1, username: 'Maria', email: 'maria@metakitrina.com', isPremium: false, password: 'pass1', enrolledCourses: [1, 4, 6, 8] },
  { userId: 2, username: 'Andreas', email: 'andreas@omesie.com', isPremium: true, password: 'pass2', enrolledCourses: [1, 2, 7, 10, 12] },
  { userId: 3, username: 'Georgios', email: 'ogiorgos@einaiponiros.com', isPremium: false, password: 'pass3', enrolledCourses: [3, 5, 9, 11] },
  { userId: 4, username: 'Alex', email: 'alex@omegas.com', isPremium: false, password: 'pass4', enrolledCourses: [1, 6, 13] },
  { userId: 5, username: 'Kyrios Symeonidis', email: 'symeonidis@didaskalos.com', isPremium: true, password: 'pass5', enrolledCourses: [2, 7, 10, 11, 12] }
];

let userIdSeq = users.length + 1;

/**
 * Generate the next unique userId for mock users.
 * @returns {number} The next userId
 */
export function nextUserId() { return userIdSeq++; }
