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

//========== PUBLIC ENDPOINTS ==========

// Test 1: Basic GET request - Returns all courses
test('GET /courses returns success response', async (t) => {
  // Send GET request to endpoint
  const response = await got(`${baseUrl}/courses`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check status code and response structure
  t.is(response.statusCode, 200);
  t.truthy(response.body);
  t.is(response.body.success, true);
  t.true(Array.isArray(response.body.data));
});

// Test 2: Check structure of course objects
test('GET /courses returns array with course objects', async (t) => {
  const response = await got(`${baseUrl}/courses`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Confirm array is returned
  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.body.data));
  
  // Check that courses have required fields
  if (response.body.data.length > 0) {
    const course = response.body.data[0];
    t.truthy(course.courseId);
    t.truthy(course.title);
  }
});

// Test 3: Filter by category query parameter
test('GET /courses with category filter', async (t) => {
  // Request with category filter
  const response = await got(`${baseUrl}/courses?category=Programming`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check that results belong to correct category
  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.body.data));
  if (response.body.data.length > 0) {
    t.is(response.body.data[0].category, 'Programming');
  }
});

// Test 4: Filter by difficulty level
test('GET /courses with difficulty filter', async (t) => {
  // Request for beginner courses
  const response = await got(`${baseUrl}/courses?difficulty=beginner`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.body.data));
});

// Test 5: Filter premium courses
test('GET /courses with premium filter', async (t) => {
  // Request only for premium courses
  const response = await got(`${baseUrl}/courses?premium=true`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.body.data));
});

// Test 6: Search functionality with keyword
test('GET /courses with search query', async (t) => {
  // Search with keyword
  const response = await got(`${baseUrl}/courses?search=javascript`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.body.data));
});

// Test 7: Get specific course with valid courseId
test('GET /courses/:courseId returns specific course', async (t) => {
  // Request for course with courseId=1
  const response = await got(`${baseUrl}/courses/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful response
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check that correct course was returned
  t.is(response.body.data.courseId, 1);
  t.truthy(response.body.data.title);
});

// Test 8: Check with non-existent courseId
test('GET /courses/:courseId returns 404 for non-existent course', async (t) => {
  // Request for courseId that doesn't exist
  const response = await got(`${baseUrl}/courses/99999`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 9: Check with invalid courseId format
test('GET /courses/:courseId with invalid ID format', async (t) => {
  // Request with string instead of number
  const response = await got(`${baseUrl}/courses/invalid`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 or 404 depending on API design
  t.true(response.statusCode === 400 || response.statusCode === 404);
});
