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

// ========== ENROLLED COURSE DETAILS TESTS ========== //

// Test 26: Get single enrolled course for user
test('GET /users/:userId/courses/:courseId returns enrolled course details', async (t) => {
  await got.post(`${baseUrl}/users/1/courses`, { json: { courseId: 4 }, responseType: 'json', throwHttpErrors: false });
  const response = await got(`${baseUrl}/users/1/courses/4`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  t.truthy(response.body.data.courseId || response.body.data.id);
  t.truthy(response.body.data.title);
});

// Test 27: GET enrolled course for non-existent user
test('GET /users/:userId/courses/:courseId returns 404 for non-existent user', async (t) => {
  const response = await got(`${baseUrl}/users/99999/courses/1`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 28: GET enrolled course when user not enrolled
test('GET /users/:userId/courses/:courseId returns 404 when not enrolled', async (t) => {
  const response = await got(`${baseUrl}/users/1/courses/99`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 29: GET enrolled course with non-existent courseId
test('GET /users/:userId/courses/:courseId returns 404 for non-existent course', async (t) => {
  const response = await got(`${baseUrl}/users/1/courses/99999`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});
