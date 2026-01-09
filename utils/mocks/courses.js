export const courses = [
  // Programming (3 courses: 2 free, 1 premium)
  { courseId: 1, title: 'Introduction to Python', description: 'Learn Python basics including variables, loops, and functions', category: 'Programming', difficulty: 'beginner', premium: false, courseImage: '', materialList: ['Python Basics.pdf', 'Code Examples.zip'], quizList: [1, 2, 3, 4], totalPoints: 400 },
  { courseId: 2, title: 'Advanced JavaScript', description: 'Master async programming, closures, and modern ES6+ features', category: 'Programming', difficulty: 'advanced', premium: true, courseImage: '', materialList: ['JS Advanced.pdf'], quizList: [5, 6, 7], totalPoints: 300 },
  { courseId: 3, title: 'Java Fundamentals', description: 'Object-oriented programming with Java', category: 'Programming', difficulty: 'intermediate', premium: false, courseImage: '', materialList: ['Java Basics.pdf'], quizList: [8, 9, 10], totalPoints: 200 },
  
  // Digital Marketing (2 courses: 2 free, 0 premium)
  { courseId: 4, title: 'Social Media Marketing', description: 'Build your brand presence on social platforms', category: 'Digital Marketing', difficulty: 'beginner', premium: false, courseImage: '', materialList: ['SMM Guide.pdf'], quizList: [11, 12, 13], totalPoints: 150 },
  { courseId: 5, title: 'SEO & Content Strategy', description: 'Drive organic traffic with search engine optimization', category: 'Digital Marketing', difficulty: 'intermediate', premium: false, courseImage: '', materialList: ['SEO Handbook.pdf'], quizList: [14, 15, 16], totalPoints: 180 },
  
  // Project Management (2 courses: 1 free, 1 premium)
  { courseId: 6, title: 'Agile Project Management', description: 'Learn Scrum, Kanban, and agile methodologies', category: 'Project Management', difficulty: 'intermediate', premium: false, courseImage: '', materialList: ['Agile Guide.pdf'], quizList: [17, 18, 19], totalPoints: 220 },
  { courseId: 7, title: 'PMP Certification Prep', description: 'Prepare for the Project Management Professional exam', category: 'Project Management', difficulty: 'advanced', premium: true, courseImage: '', materialList: ['PMP Study Guide.pdf'], quizList: [20, 21, 22], totalPoints: 350 },
  
  // Economics and Finance (3 courses: 2 free, 1 premium)
  { courseId: 8, title: 'Financial Accounting Basics', description: 'Understanding balance sheets, income statements, and cash flows', category: 'Economics and Finance', difficulty: 'beginner', premium: false, courseImage: '', materialList: ['Accounting 101.pdf'], quizList: [23, 24, 25], totalPoints: 160 },
  { courseId: 9, title: 'Investment Strategies', description: 'Learn about stocks, bonds, and portfolio management', category: 'Economics and Finance', difficulty: 'intermediate', premium: false, courseImage: '', materialList: ['Investment Guide.pdf'], quizList: [26, 27, 28], totalPoints: 200 },
  { courseId: 10, title: 'Corporate Finance', description: 'Advanced financial modeling and valuation techniques', category: 'Economics and Finance', difficulty: 'advanced', premium: true, courseImage: '', materialList: ['Finance Models.xlsx'], quizList: [29, 30, 31], totalPoints: 280 },
  
  // Data Science and Machine Learning (3 courses: 2 free, 1 premium)
  { courseId: 11, title: 'Python for Data Science', description: 'Use pandas, numpy, and matplotlib for data analysis', category: 'Data Science and Machine Learning', difficulty: 'intermediate', premium: false, courseImage: '', materialList: ['Data Science with Python.pdf'], quizList: [32, 33, 34], totalPoints: 250 },
  { courseId: 12, title: 'Machine Learning Fundamentals', description: 'Introduction to supervised and unsupervised learning', category: 'Data Science and Machine Learning', difficulty: 'advanced', premium: true, courseImage: '', materialList: ['ML Basics.pdf'], quizList: [35, 36, 37], totalPoints: 320 },
  { courseId: 13, title: 'Data Visualization', description: 'Create compelling charts and dashboards', category: 'Data Science and Machine Learning', difficulty: 'beginner', premium: false, courseImage: '', materialList: ['Viz Guide.pdf'], quizList: [38, 39, 40], totalPoints: 140 }
];

let courseIdSeq = courses.length + 1;
export function nextCourseId() { return courseIdSeq++; }
