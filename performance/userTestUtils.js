/**
 * Common utilities for user endpoint performance tests.
 * Contains shared setup, execution, and summary functions for load and spike tests.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl, getThinkTime } from './config.js';

/**
 * Common setup function for user tests that need to fetch user IDs.
 * @returns {Object} Object containing array of user IDs
 */
export function setupUserTest() {
  const res = http.get(`${getBaseUrl()}/users`);
  check(res, { 'setup: /users is 200': (r) => r.status === 200 });

  if (res.status !== 200) {
    throw new Error(`setup() failed to fetch /users. Status=${res.status}`);
  }

  const data = res.json();

  const arr =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.users) ? data.users :
    null;

  if (!arr || arr.length === 0) {
    throw new Error('setup() found no users in /users response.');
  }

  const ids = arr
    .map((u) => u.userId ?? u.id ?? u._id)
    .filter(Boolean)
    .map(String);

  if (ids.length === 0) {
    throw new Error('setup() could not extract any IDs from /users response.');
  }

  return { ids };
}

/**
 * Common test execution for user endpoint tests.
 * @param {Object} data - Data from setup containing user IDs
 */
export function executeUserTest(data) {
  const ids = data?.ids || [];
  if (ids.length === 0) return;

  const id = ids[Math.floor(Math.random() * ids.length)];
  const url = `${getBaseUrl()}/users/${encodeURIComponent(id)}`;

  const response = http.get(url);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has body': (r) => r.body && r.body.length > 0,
  });

  sleep(getThinkTime());
}

/**
 * Creates standardized summary for user tests.
 * @param {Object} data - k6 summary data
 * @param {string} testType - Type of test ('LOAD' or 'SPIKE')
 * @returns {Object} Summary object for k6
 */
export function createUserTestSummary(data, testType) {
  const failedRate = data.metrics.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'];
  const passed = failedRate < 0.01;
  const emoji = testType === 'SPIKE' ? '⚡' : '📊';

  console.log('\n========================================');
  console.log(`${emoji} ${testType} TEST - /users/:userId (setup IDs)`);
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}