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

// ========== ADMIN ENDPOINTS ==========

// Test 10: Create new course (POST) with valid data
test('POST /courses creates new course with admin auth', async (t) => {
  const response = await got.post(`${baseUrl}/courses`, {
    json: {
      title: 'Test Course',
      description: 'Test Description',
      category: 'Testing',
      difficulty: 'beginner',
      premium: false,
      totalPoints: 100
    },
    responseType: 'json',
    throwHttpErrors: false,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('admin:adminpass').toString('base64')
    }
  });

  // Expect 201 Created
  t.is(response.statusCode, 201);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  t.truthy(response.body.data.courseId);
});

// Test 11: POST course without authentication
test('POST /courses without auth returns 401', async (t) => {
  const response = await got.post(`${baseUrl}/courses`, {
    json: {
      title: 'Test Course',
      description: 'Test Description',
      category: 'Testing',
      difficulty: 'beginner',
      premium: false,
      totalPoints: 100
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 401 Unauthorized
  t.is(response.statusCode, 401);
});

// Test 12: POST course with missing required fields
test('POST /courses with missing fields returns 400', async (t) => {
  const response = await got.post(`${baseUrl}/courses`, {
    json: {
      title: 'Test Course'
      // Missing other required fields
    },
    responseType: 'json',
    throwHttpErrors: false,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('admin:adminpass').toString('base64')
    }
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 13: Update existing course (PUT) with admin auth
test('PUT /courses/:courseId updates course with admin auth', async (t) => {
  const response = await got.put(`${baseUrl}/courses/3`, {
    json: {
      title: 'Updated Course Title',
      description: 'Updated Description'
    },
    responseType: 'json',
    throwHttpErrors: false,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('admin:adminpass').toString('base64')
    }
  });

  // Expect 200 OK
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
});

// Test 14: PUT course without authentication
test('PUT /courses/:courseId without auth returns 401', async (t) => {
  const response = await got.put(`${baseUrl}/courses/1`, {
    json: {
      title: 'Updated Title'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 401 Unauthorized
  t.is(response.statusCode, 401);
});

// Test 15: PUT non-existent course
test('PUT /courses/:courseId for non-existent course returns 404', async (t) => {
  const response = await got.put(`${baseUrl}/courses/99999`, {
    json: {
      title: 'Updated Title'
    },
    responseType: 'json',
    throwHttpErrors: false,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('admin:adminpass').toString('base64')
    }
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 16: Delete course with admin auth
test('DELETE /courses/:courseId deletes course with admin auth', async (t) => {
  const response = await got.delete(`${baseUrl}/courses/5`, {
    responseType: 'json',
    throwHttpErrors: false,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('admin:adminpass').toString('base64')
    }
  });

  // Expect 200 or 204
  t.true(response.statusCode === 200 || response.statusCode === 204);
});

// Test 17: DELETE course without authentication
test('DELETE /courses/:courseId without auth returns 401', async (t) => {
  const response = await got.delete(`${baseUrl}/courses/2`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 401 Unauthorized
  t.is(response.statusCode, 401);
});

// Test 18: DELETE non-existent course
test('DELETE /courses/:courseId for non-existent course returns 404', async (t) => {
  const response = await got.delete(`${baseUrl}/courses/99999`, {
    responseType: 'json',
    throwHttpErrors: false,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('admin:adminpass').toString('base64')
    }
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
});
