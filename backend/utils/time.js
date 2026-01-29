/**
 * Deterministic time utility for testing
 * When TEST_MODE=1, reads x-test-now-ms header for current time
 * Otherwise uses system time
 */

export function getCurrentTime(req) {
  // Check if we're in test mode
  if (process.env.TEST_MODE === '1') {
    // Try to read test timestamp from header
    const testTime = req.get('x-test-now-ms');
    if (testTime) {
      const timestamp = parseInt(testTime, 10);
      if (!isNaN(timestamp) && timestamp > 0) {
        return timestamp;
      }
    }
  }
  
  // Default to system time
  return Date.now();
}
