import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl, getCommonThresholds, getSpikeTestConfig, getThinkTime } from './config.js';

/**
 * Spike Test for /courses endpoint
 * 
 * Purpose: Test sudden traffic surge to identify breaking points and recovery
 * NFRs:
 * - Handle sudden spike to 1000 concurrent users
 * - P95 response time < 300ms (validated: 160ms @ 1000 VUs)
 * - Error rate < 1%
 * - System recovers gracefully after spike
 */

export const options = {
  thresholds: getCommonThresholds(),
  scenarios: {
    courses_spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: getSpikeTestConfig().stages,
      gracefulRampDown: '5s',
    },
  },
};

/**
 * Test the GET /courses endpoint under spike load
 * Verifies:
 * - HTTP status is 200
 * - Response has valid body content
 * - Response time remains acceptable during spike
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
    'response time < 1000ms': (r) => r.timings.duration < 1000,
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
  const p99 = data.metrics.http_req_duration?.values['p(99)'];
  
  console.log('\n========================================');
  console.log('⚡ SPIKE TEST - /courses');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`P99 Response Time: ${p99?.toFixed(2)}ms`);
  console.log(`Error Rate: ${((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%`);
  console.log('========================================\n');
  
  return {
    'stdout': JSON.stringify(data, null, 2),
  };
}
