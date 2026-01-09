# Performance Tests

This directory contains k6 performance tests for the EasyLearn Backend API.

## Test Structure

- **`config.js`**: Shared configuration, thresholds, and NFRs for all tests
- **`courses-load-test.js`**: Load test for `/courses` endpoint
- **`courses-spike-test.js`**: Spike test for `/courses` endpoint
- **`users-load-test.js`**: Load test for `/users/:userId` endpoint
- **`users-spike-test.js`**: Spike test for `/users/:userId` endpoint



## Non-Functional Requirements (NFRs)

Based on validated local testing results:

- **Max Concurrent Users**: 1000 (both load and spike)
- **P95 Response Time**: < 300ms (measured: 160ms @ 1000 VUs)
- **P99 Response Time**: < 500ms
- **Error Rate**: < 1% (measured: 0% @ 1000 VUs)

## Running Tests Locally

### Prerequisites
```bash
# Install k6 (Windows)
winget install k6

# Start backend server
npm start
```

### Run Individual Tests
```bash
# Load test for /courses
k6 run performance/courses-load-test.js

# Spike test for /courses
k6 run performance/courses-spike-test.js
```

### Run All Tests
```bash
# Run both tests sequentially
k6 run performance/courses-load-test.js && k6 run performance/courses-spike-test.js
```

## CI/CD Integration

Tests run in GitHub Actions CI pipeline. The `API_URL` environment variable can be set to target the CI backend:

```bash
k6 run -e API_URL=http://localhost:5000 performance/courses-load-test.js
```

## Test Scenarios

### Load Test 
- **Duration**: ~7 minutes
- **Pattern**: Gradual ramp-up to sustained load
- **Stages**:
  1. Warm up: 0 → 100 VUs (30s)
  2. Ramp up: 100 → 500 VUs (1m)
  3. Peak load: 500 → 1000 VUs (1m30s)
  4. Sustain: 1000 VUs (3m)
  5. Ramp down: 1000 → 0 VUs (1m)

### Spike Test 
- **Duration**: ~3 minutes
- **Pattern**: Sudden traffic surge
- **Stages**:
  1. Baseline: 0 → 10 VUs (20s)
  2. Spike: 10 → 1000 VUs (20s)
  3. Sustain: 1000 VUs (2m)
  4. Drop: 1000 → 0 VUs (20s)

## Adding New Tests

To add tests for additional routes (e.g., `/example`):

1. Create `example-load-test.js` and `example-spike-test.js`
2. Import config from `config.js`
3. Update the endpoint URL in the test function
4. Follow the same structure and thresholds

Example:
```javascript
import { BASE_URL, COMMON_THRESHOLDS, LOAD_TEST_CONFIG } from './config.js';

export default function () {
  const url = `${BASE_URL}/users`;
  // ... rest of test
}
```

## Interpreting Results

### Successful Test
- ✅ All thresholds pass
- ✅ Error rate < 1%
- ✅ P95 response time < 300ms

### Failed Test
If tests fail, it may indicate:
- Performance regression in code
- Resource constraints on CI runner
- Network issues

**Action**: Review recent changes or adjust VU counts if CI resources are limited.
