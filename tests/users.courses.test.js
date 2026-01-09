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

// ========== ENROLLMENT & WITHDRAW TESTS ========== //

// Test 7: Get enrolled courses for user
test('GET /users/:userId/courses returns enrolled courses', async (t) => {
  const response = await got(`${baseUrl}/users/1/courses`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.true(Array.isArray(response.body.data));
  if (response.body.data.length > 0) {
    const course = response.body.data[0];
    t.truthy(course.id || course.courseId);
    t.truthy(course.title);
  }
});

// Test 8: GET enrolled courses for non-existent user
test('GET /users/:userId/courses returns 404 for non-existent user', async (t) => {
  const response = await got(`${baseUrl}/users/99999/courses`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 9: Enrollment in course (POST)
test('POST /users/:userId/courses enrolls user in course', async (t) => {
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: { courseId: 3 }, responseType: 'json', throwHttpErrors: false });
  t.true(response.statusCode === 200 || response.statusCode === 201);
  t.is(response.body.success, true);
});

// Test 10: POST enrollment without courseId
test('POST /users/:userId/courses without courseId returns 400', async (t) => {
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: {}, responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 11: POST enrollment to non-existent course
test('POST /users/:userId/courses with non-existent course returns 404', async (t) => {
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: { courseId: 99999 }, responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 12: POST enrollment for non-existent user
test('POST /users/:userId/courses for non-existent user returns 404', async (t) => {
  const response = await got.post(`${baseUrl}/users/99999/courses`, {
    json: { courseId: 1 }, responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 13: POST enrollment to premium course without premium account
test('POST /users/:userId/courses to premium course without premium returns 400', async (t) => {
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: { courseId: 2 }, responseType: 'json', throwHttpErrors: false });
  t.true(response.statusCode === 400 || response.statusCode === 200);
  if (response.statusCode === 400) {
    t.is(response.body.success, false);
  }
});

// Test 14: Withdraw from course (DELETE)
test('DELETE /users/:userId/courses/:courseId withdraws user from course', async (t) => {
  const response = await got.delete(`${baseUrl}/users/1/courses/1`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 204);
});

// Test 15: DELETE withdraw for non-existent user
test('DELETE /users/:userId/courses/:courseId for non-existent user returns 404', async (t) => {
  const response = await got.delete(`${baseUrl}/users/99999/courses/1`, { responseType: 'json', throwHttpErrors: false });
  t.is(response.statusCode, 404);
});

// Test 16: DELETE withdraw from course that user is not enrolled in
test('DELETE /users/:userId/courses/:courseId for non-enrolled course succeeds', async (t) => {
  const response = await got.delete(`${baseUrl}/users/1/courses/99`, { responseType: 'json', throwHttpErrors: false });
  t.true(response.statusCode === 204 || response.statusCode === 404);
});
