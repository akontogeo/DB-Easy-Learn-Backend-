import { progress as mockProgress, nextProgressId } from '../utils/mockData.js';

/**
 * ProgressService provides operations for user course progress.
 * Uses in-memory mock data only.
 */
export const ProgressService = {
  /**
   * Get a user's progress for a specific course.
   * @param {string|number} userId - The user's ID
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Object|null>} The progress object or null if not found
   */
  async getProgress(userId, courseId) {
    return mockProgress.find(p => String(p.userId) === String(userId) && String(p.courseId) === String(courseId));
  },

  /**
   * Create or update a user's progress for a course.
   * @param {string|number} userId - The user's ID
   * @param {string|number} courseId - The course's ID
   * @param {number} percentage - The progress percentage to set
   * @returns {Promise<Object>} The upserted progress object
   */
  async upsertProgress(userId, courseId, percentage) {
    const idx = mockProgress.findIndex(p => String(p.userId) === String(userId) && String(p.courseId) === String(courseId));
    if (idx !== -1) {
      mockProgress[idx].progressPercentage = percentage;
      return mockProgress[idx];
    }
    // Create new progress if not found
    const newProgress = { progressId: nextProgressId(), userId: Number(userId), courseId: Number(courseId), progressPercentage: percentage };
    mockProgress.push(newProgress);
    return newProgress;
  }
};
