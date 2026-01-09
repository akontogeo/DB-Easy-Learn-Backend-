import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl, getCommonThresholds, getLoadTestConfig, getThinkTime } from './config.js';

/**
 * Load Test for /courses endpoint
 * 
 * Purpose: Test sustained load with gradual ramp-up to simulate normal traffic growth
 * NFRs: 
 * - Support up to 1000 concurrent users
 * - P95 response time < 300ms (validated: 160ms @ 1000 VUs)
 * - Error rate < 1%
 */

export const options = {
  thresholds: getCommonThresholds(),
  scenarios: {
    courses_load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: getLoadTestConfig().stages,
      gracefulRampDown: '10s',
    },
  },
};

/**
 * Test the GET /courses endpoint
 * Verifies:
 * - HTTP status is 200
 * - Response has valid body content
 * - Response time is acceptable
 */
export default function () {
  const url = `${getBaseUrl()}/courses`;
  
  // Make GET request
  const response = http.get(url);
  
  // Validate response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has body': (r) => r.body && r.body.length > 0,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  // Simulate user think time
  sleep(getThinkTime());
}

/**
 * Test execution summary
 */
export function handleSummary(data) {
  const passed = data.metrics.http_req_failed?.values?.rate < 0.01;
  const p95 = data.metrics.http_req_duration?.values['p(95)'];
  
  console.log('\n========================================');
  console.log('📊 LOAD TEST - /courses');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%`);
  console.log('========================================\n');
  
  return {
    'stdout': JSON.stringify(data, null, 2),
  };
}
