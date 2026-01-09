// Import dependencies for AVA testing framework and HTTP requests
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// Shared server instance for all tests
let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  baseUrl = await listen(server);
});

test.after.always(() => {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
});

// ========== USER PROFILE & ACCOUNT TESTS ========== //

// Test 1: Get user profile with valid userId
test('GET /users/:userId returns user profile', async (t) => {
  const response = await got(`${baseUrl}/users/1`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  t.truthy(response.body.data.username);
  t.true(typeof response.body.data.points === 'number');
  t.true(typeof response.body.data.isPremium === 'boolean');
});

// Test 2: GET user with non-existent userId
test('GET /users/:userId returns 404 for non-existent user', async (t) => {
  const response = await got(`${baseUrl}/users/99999`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 3: Update user profile with valid data
test('PUT /users/:userId updates user profile', async (t) => {
  const response = await got.put(`${baseUrl}/users/1`, {
    json: { username: 'updatedUser', isPremium: true },
    responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  t.truthy(response.body.data.username);
  t.true(typeof response.body.data.isPremium === 'boolean');
});

// Test 4: PUT user with non-existent userId
test('PUT /users/:userId returns 404 for non-existent user', async (t) => {
  const response = await got.put(`${baseUrl}/users/99999`, {
    json: { username: 'newName' }, responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 5: PUT user with partial update (only username)
test('PUT /users/:userId with partial data updates successfully', async (t) => {
  const response = await got.put(`${baseUrl}/users/2`, {
    json: { username: 'partialUpdate' }, responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
});

// Test 6: PUT user with empty body
test('PUT /users/:userId with empty body', async (t) => {
  const response = await got.put(`${baseUrl}/users/1`, {
    json: {}, responseType: 'json', throwHttpErrors: false });
  t.true(response.statusCode === 200 || response.statusCode === 400);
});

// Test 17: Get all users list
test('GET /users returns list of all users', async (t) => {
  const response = await got(`${baseUrl}/users`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.true(Array.isArray(response.body.data));
  if (response.body.data.length > 0) {
    const user = response.body.data[0];
    t.truthy(user.username || user.email);
  }
});

// Test 18: Create new user with valid data
test('POST /users creates new user', async (t) => {
  const response = await got.post(`${baseUrl}/users`, {
    json: { username: 'testuser' + Date.now(), email: 'test' + Date.now() + '@example.com', password: 'password123' },
    responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 201);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
});

// Test 19: POST user without username (validation error)
test('POST /users without username returns 400', async (t) => {
  const response = await got.post(`${baseUrl}/users`, {
    json: { email: 'test@example.com', password: 'password123' },
    responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 20: POST user without email (validation error)
test('POST /users without email returns 400', async (t) => {
  const response = await got.post(`${baseUrl}/users`, {
    json: { username: 'testuser', password: 'password123' },
    responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 21: POST user without password (validation error)
test('POST /users without password returns 400', async (t) => {
  const response = await got.post(`${baseUrl}/users`, {
    json: { username: 'testuser', email: 'test@example.com' },
    responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 22: POST user with empty body
test('POST /users with empty body returns 400', async (t) => {
  const response = await got.post(`${baseUrl}/users`, {
    json: {}, responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 23: Delete user with valid userId
test('DELETE /users/:userId deletes user', async (t) => {
  const createResponse = await got.post(`${baseUrl}/users`, {
    json: { username: 'deletetest' + Date.now(), email: 'deletetest' + Date.now() + '@example.com', password: 'password123' },
    responseType: 'json', throwHttpErrors: false });
  const userId = createResponse.body.data?.userId || createResponse.body.data?.id || 10;
  const response = await got.delete(`${baseUrl}/users/${userId}`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
});

// Test 24: DELETE user with non-existent userId
test('DELETE /users/:userId returns 404 for non-existent user', async (t) => {
  const response = await got.delete(`${baseUrl}/users/99999`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 25: DELETE user with invalid userId format
test('DELETE /users/:userId with invalid ID format', async (t) => {
  const response = await got.delete(`${baseUrl}/users/invalid`, { responseType: 'json', throwHttpErrors: false });
  t.true(response.statusCode === 400 || response.statusCode === 404);
});
