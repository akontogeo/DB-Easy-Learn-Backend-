import test from 'ava';
import got from 'got';
import http from 'http';
import listen from 'test-listen';
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

// ========== GET QUIZ TESTS ==========

// Test 1: Get quiz details successfully
test('GET /courses/:courseId/quizzes/:quizId returns quiz details', async (t) => {
  // Get quiz 1 from course 1 (Python Basics Quiz)
  const response = await got(`${baseUrl}/courses/1/quizzes/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 200 OK
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check quiz structure
  const quiz = response.body.data;
  t.truthy(quiz.quizId);
  t.truthy(quiz.title);
  t.truthy(quiz.questions);
  t.true(Array.isArray(quiz.questions));
  
  // Verify correct answers are hidden
  if (quiz.questions.length > 0) {
    const question = quiz.questions[0];
    t.truthy(question.questionId);
    t.truthy(question.questionText);
    t.truthy(question.options);
    t.falsy(question.correctOption); // Should be hidden
  }
});

// Test 2: Get quiz with non-existent quizId
test('GET /courses/:courseId/quizzes/:quizId with invalid quizId returns 404', async (t) => {
  // Request non-existent quiz
  const response = await got(`${baseUrl}/courses/1/quizzes/99999`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 3: Get quiz with non-existent courseId
test('GET /courses/:courseId/quizzes/:quizId with invalid courseId returns 404', async (t) => {
  // Request quiz from non-existent course
  const response = await got(`${baseUrl}/courses/99999/quizzes/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 4: Get quiz from wrong course (quiz exists but not in that course)
test('GET /courses/:courseId/quizzes/:quizId with mismatched courseId returns 404', async (t) => {
  // Request quiz 1 (belongs to course 1) from course 2
  const response = await got(`${baseUrl}/courses/2/quizzes/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found (quiz doesn't belong to this course)
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// ========== SUBMIT QUIZ TESTS ==========

// Test 5: Submit quiz with correct answers
test('POST /courses/:courseId/quizzes/:quizId/submit with correct answers returns full score', async (t) => {
  // Submit quiz with all correct answers for quiz 1
  // Quiz 1 has 2 questions: correctOption 0 and 1
  const response = await got.post(`${baseUrl}/courses/1/quizzes/1/submit`, {
    json: {
      userId: 1,
      answers: [0, 1] // Both correct
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 200 OK
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check result structure
  const result = response.body.data;
  t.truthy(result.score !== undefined);
  t.truthy(result.total !== undefined);
  t.is(result.score, result.total); // All correct
});

// Test 6: Submit quiz with wrong answers
test('POST /courses/:courseId/quizzes/:quizId/submit with wrong answers returns lower score', async (t) => {
  // Submit quiz with wrong answers
  const response = await got.post(`${baseUrl}/courses/1/quizzes/1/submit`, {
    json: {
      userId: 1,
      answers: [2, 2] // Both wrong
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 200 OK
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check result structure
  const result = response.body.data;
  t.truthy(result.score !== undefined);
  t.true(result.score < result.total); // Not all correct
});

// Test 7: Submit quiz with missing userId
test('POST /courses/:courseId/quizzes/:quizId/submit without userId returns 400', async (t) => {
  // Submit without userId
  const response = await got.post(`${baseUrl}/courses/1/quizzes/1/submit`, {
    json: {
      answers: [0, 1]
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 8: Submit quiz with missing answers
test('POST /courses/:courseId/quizzes/:quizId/submit without answers returns 400', async (t) => {
  // Submit without answers
  const response = await got.post(`${baseUrl}/courses/1/quizzes/1/submit`, {
    json: {
      userId: 1
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 9: Submit quiz with non-existent quizId
test('POST /courses/:courseId/quizzes/:quizId/submit with invalid quizId returns 404', async (t) => {
  // Submit to non-existent quiz
  const response = await got.post(`${baseUrl}/courses/1/quizzes/99999/submit`, {
    json: {
      userId: 1,
      answers: [0, 1]
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 10: Submit quiz with non-existent courseId
test('POST /courses/:courseId/quizzes/:quizId/submit with invalid courseId returns 404', async (t) => {
  // Submit to quiz in non-existent course
  const response = await got.post(`${baseUrl}/courses/99999/quizzes/1/submit`, {
    json: {
      userId: 1,
      answers: [0, 1]
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 11: Submit quiz with incorrect number of answers
test('POST /courses/:courseId/quizzes/:quizId/submit with wrong answer count', async (t) => {
  // Quiz 1 has 2 questions, submit only 1 answer
  const response = await got.post(`${baseUrl}/courses/1/quizzes/1/submit`, {
    json: {
      userId: 1,
      answers: [0] // Only 1 answer instead of 2
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 200 OK but lower score (or may handle differently)
  // The implementation should handle this gracefully
  t.true(response.statusCode === 200 || response.statusCode === 400);
});

// Test 12: Submit quiz with partial correct answers
test('POST /courses/:courseId/quizzes/:quizId/submit with partial correct answers', async (t) => {
  // Quiz 1: correct answers are [0, 1], submit [0, 2] (first correct, second wrong)
  const response = await got.post(`${baseUrl}/courses/1/quizzes/1/submit`, {
    json: {
      userId: 1,
      answers: [0, 2]
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 200 OK
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  
  const result = response.body.data;
  t.truthy(result.score !== undefined);
  t.true(result.score > 0 && result.score < result.total); // Partial score
});
