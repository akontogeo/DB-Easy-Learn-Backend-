export const progress = [
  // user1 enrolled [1, 4, 6, 8]
  { progressId: 1, userId: 1, courseId: 1, progressPercentage: 67 },
  { progressId: 2, userId: 1, courseId: 4, progressPercentage: 45 },
  { progressId: 3, userId: 1, courseId: 6, progressPercentage: 30 },
  { progressId: 4, userId: 1, courseId: 8, progressPercentage: 20 },
  
  // user2 enrolled [1, 2, 7, 10, 12]
  { progressId: 5, userId: 2, courseId: 1, progressPercentage: 80 },
  { progressId: 6, userId: 2, courseId: 2, progressPercentage: 50 },
  { progressId: 7, userId: 2, courseId: 7, progressPercentage: 60 },
  { progressId: 8, userId: 2, courseId: 10, progressPercentage: 40 },
  { progressId: 9, userId: 2, courseId: 12, progressPercentage: 25 },
  
  // user3 enrolled [3, 5, 9, 11]
  { progressId: 10, userId: 3, courseId: 3, progressPercentage: 35 },
  { progressId: 11, userId: 3, courseId: 5, progressPercentage: 55 },
  { progressId: 12, userId: 3, courseId: 9, progressPercentage: 70 },
  { progressId: 13, userId: 3, courseId: 11, progressPercentage: 15 },
  
  // user4 enrolled [1, 6, 13]
  { progressId: 14, userId: 4, courseId: 1, progressPercentage: 90 },
  { progressId: 15, userId: 4, courseId: 6, progressPercentage: 75 },
  { progressId: 16, userId: 4, courseId: 13, progressPercentage: 50 },
  
  // user5 enrolled [2, 7, 10, 11, 12]
  { progressId: 17, userId: 5, courseId: 2, progressPercentage: 85 },
  { progressId: 18, userId: 5, courseId: 7, progressPercentage: 95 },
  { progressId: 19, userId: 5, courseId: 10, progressPercentage: 60 },
  { progressId: 20, userId: 5, courseId: 11, progressPercentage: 40 },
  { progressId: 21, userId: 5, courseId: 12, progressPercentage: 30 }
];

let progressIdSeq = progress.length + 1;
export function nextProgressId() { return progressIdSeq++; }
