// Import dependencies for AVA testing framework and HTTP requests
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// Shared server instance for all tests
let server;
let baseUrl;

// Setup: Create and start server before all tests
test.before(async () => {
  server = http.createServer(app);
  baseUrl = await listen(server);
});

// Teardown: Close server after all tests complete
test.after.always(() => {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
});

// Test 1: Get progress for enrolled course
test('GET /users/:userId/courses/:courseId/progress returns progress', async (t) => {
  // Request progress for user 1 in course 1 (enrolled)
  const response = await got(`${baseUrl}/users/1/courses/1/progress`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful response
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check progress object structure
  if (response.body.data) {
    t.true(typeof response.body.data.progressPercentage === 'number' || 
           response.body.data.progressPercentage === undefined);
  }
});

// Test 2: GET progress for non-existent user
test('GET /users/:userId/courses/:courseId/progress for non-existent user returns 404', async (t) => {
  // Request for user that doesn't exist
  const response = await got(`${baseUrl}/users/99999/courses/1/progress`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 3: GET progress for non-existent course
test('GET /users/:userId/courses/:courseId/progress for non-existent course returns 404', async (t) => {
  // Request for course that doesn't exist
  const response = await got(`${baseUrl}/users/1/courses/99999/progress`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});
