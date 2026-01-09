/**
 * Shared configuration for k6 performance tests.
 * 
 * NFRs (Non-Functional Requirements) based on local testing:
 * - Local test @ 1000 VUs: P95 = 160ms, 0% error rate
 * - GitHub Actions has less resources, so we use conservative thresholds
 * 
 * These thresholds ensure tests pass on CI runners while detecting regressions.
 */

/* global __ENV */

/**
 * Returns the base URL for the API, using environment variable or default.
 * @returns {string} API base URL
 */
export function getBaseUrl() {
  return __ENV.API_URL || 'http://localhost:5000';
}

/**
 * Common thresholds for all performance tests.
 * @returns {Object} Thresholds for k6
 */
export function getCommonThresholds() {
  return {
    http_req_failed: ['rate<0.01'], // HTTP errors < 1%
    http_req_duration: ['p(95)<300', 'p(99)<500'], // Response time thresholds
  };
}

/**
 * Helper to create a stage object for k6.
 * @param {string} duration - Duration of the stage
 * @param {number} target - Target number of VUs
 * @returns {Object} Stage configuration
 */
function createStage(duration, target) {
  return { duration, target };
}

/**
 * Load test configuration (gradual ramp-up for sustained load).
 * @returns {Object} Load test config for k6
 */
export function getLoadTestConfig() {
  return {
    maxVUs: 2000,
    stages: [
      createStage('30s', 100),     // Warm up to 100
      createStage('1m', 500),      // Ramp to 500 VUs
      createStage('1m30s', 1000),  // Ramp to 1000 VUs
      createStage('3m', 1000),     // Sustain peak at 1000
      createStage('1m', 0),        // Ramp down
    ],
  };
}

/**
 * Spike test configuration (sudden traffic surge).
 * @returns {Object} Spike test config for k6
 */
export function getSpikeTestConfig() {
  return {
    maxVUs: 2000,
    stages: [
      createStage('20s', 10),      // Baseline
      createStage('20s', 1000),    // Sudden spike to 1000
      createStage('2m', 1000),     // Sustain spike
      createStage('20s', 0),       // Drop to zero
    ],
  };
}

/**
 * User think time between requests (in seconds).
 * @returns {number} Think time in seconds
 */
export function getThinkTime() {
  return 1;
}