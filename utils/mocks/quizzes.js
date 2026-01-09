export const quizzes = [
  // Course 1: Introduction to Python (4 quizzes)
  { quizId: 1, courseId: 1, title: 'Python Basics Quiz', questions: [
    { questionId: 1, questionText: 'What is a variable in Python?', options: ['A storage location', 'A function', 'A loop'], correctOption: 0 },
    { questionId: 2, questionText: 'Which keyword is used to define a function?', options: ['func', 'def', 'function'], correctOption: 1 }
  ]},
  { quizId: 2, courseId: 1, title: 'Variables and Data Types Quiz', questions: [
    { questionId: 3, questionText: 'What is the data type of "Hello"?', options: ['int', 'str', 'bool'], correctOption: 1 }
  ]},
  { quizId: 3, courseId: 1, title: 'Control Structures Quiz', questions: [
    { questionId: 4, questionText: 'Which statement is used for conditional logic?', options: ['if', 'for', 'while'], correctOption: 0 }
  ]},
  { quizId: 4, courseId: 1, title: 'Loops Quiz', questions: [
    { questionId: 5, questionText: 'Which loop runs a specific number of times?', options: ['while', 'for', 'do-while'], correctOption: 1 }
  ]},
  
  // Course 2: Advanced JavaScript (3 quizzes)
  { quizId: 5, courseId: 2, title: 'Async Programming Quiz', questions: [
    { questionId: 6, questionText: 'What does async/await do?', options: ['Blocks execution', 'Handles promises', 'Creates threads'], correctOption: 1 }
  ]},
  { quizId: 6, courseId: 2, title: 'ES6+ Features Quiz', questions: [
    { questionId: 7, questionText: 'What is a arrow function?', options: ['A loop', 'A concise function syntax', 'A variable'], correctOption: 1 }
  ]},
  { quizId: 7, courseId: 2, title: 'Closures Quiz', questions: [
    { questionId: 8, questionText: 'What is a closure?', options: ['A loop', 'Function with access to outer scope', 'A class'], correctOption: 1 }
  ]},
  
  // Course 3: Java Fundamentals (3 quizzes)
  { quizId: 8, courseId: 3, title: 'Java OOP Quiz', questions: [
    { questionId: 9, questionText: 'What is encapsulation?', options: ['Hiding data', 'Looping', 'Sorting'], correctOption: 0 }
  ]},
  { quizId: 9, courseId: 3, title: 'Inheritance Quiz', questions: [
    { questionId: 10, questionText: 'What keyword is used for inheritance?', options: ['extends', 'implements', 'inherits'], correctOption: 0 }
  ]},
  { quizId: 10, courseId: 3, title: 'Polymorphism Quiz', questions: [
    { questionId: 11, questionText: 'What is method overriding?', options: ['Same method, different class', 'Different method', 'Same class'], correctOption: 0 }
  ]},
  
  // Course 4: Social Media Marketing (3 quizzes)
  { quizId: 11, courseId: 4, title: 'SMM Basics Quiz', questions: [
    { questionId: 12, questionText: 'Which platform is best for B2B marketing?', options: ['Instagram', 'LinkedIn', 'TikTok'], correctOption: 1 }
  ]},
  { quizId: 12, courseId: 4, title: 'Content Strategy Quiz', questions: [
    { questionId: 13, questionText: 'What is engagement rate?', options: ['Likes + Comments / Followers', 'Followers only', 'Shares only'], correctOption: 0 }
  ]},
  { quizId: 13, courseId: 4, title: 'Social Analytics Quiz', questions: [
    { questionId: 14, questionText: 'What does ROI stand for?', options: ['Return on Investment', 'Rate of Interest', 'Revenue over Income'], correctOption: 0 }
  ]},
  
  // Course 5: SEO & Content Strategy (3 quizzes)
  { quizId: 14, courseId: 5, title: 'SEO Fundamentals Quiz', questions: [
    { questionId: 15, questionText: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Social Engagement Online', 'Site Enhancement Operation'], correctOption: 0 }
  ]},
  { quizId: 15, courseId: 5, title: 'Keyword Research Quiz', questions: [
    { questionId: 16, questionText: 'What is a long-tail keyword?', options: ['Short phrase', 'Specific multi-word phrase', 'Single word'], correctOption: 1 }
  ]},
  { quizId: 16, courseId: 5, title: 'Content Marketing Quiz', questions: [
    { questionId: 17, questionText: 'What is evergreen content?', options: ['Seasonal content', 'Always relevant content', 'News content'], correctOption: 1 }
  ]},
  
  // Course 6: Agile Project Management (3 quizzes)
  { quizId: 17, courseId: 6, title: 'Agile Methodology Quiz', questions: [
    { questionId: 18, questionText: 'What is a Sprint in Scrum?', options: ['A meeting', 'A time-boxed iteration', 'A document'], correctOption: 1 }
  ]},
  { quizId: 18, courseId: 6, title: 'Scrum Roles Quiz', questions: [
    { questionId: 19, questionText: 'Who is the Product Owner?', options: ['Developer', 'Stakeholder representative', 'Tester'], correctOption: 1 }
  ]},
  { quizId: 19, courseId: 6, title: 'Kanban Quiz', questions: [
    { questionId: 20, questionText: 'What is WIP limit?', options: ['Work In Progress limit', 'Week In Planning', 'Work Item Priority'], correctOption: 0 }
  ]},
  
  // Course 7: PMP Certification Prep (3 quizzes)
  { quizId: 20, courseId: 7, title: 'PMP Practice Quiz', questions: [
    { questionId: 21, questionText: 'How many process groups are in PMBOK?', options: ['3', '5', '10'], correctOption: 1 }
  ]},
  { quizId: 21, courseId: 7, title: 'Risk Management Quiz', questions: [
    { questionId: 22, questionText: 'What is risk mitigation?', options: ['Avoiding risk', 'Reducing impact', 'Accepting risk'], correctOption: 1 }
  ]},
  { quizId: 22, courseId: 7, title: 'Stakeholder Management Quiz', questions: [
    { questionId: 23, questionText: 'What is stakeholder analysis?', options: ['Identifying stakeholders', 'Managing budget', 'Creating timeline'], correctOption: 0 }
  ]},
  
  // Course 8: Financial Accounting Basics (3 quizzes)
  { quizId: 23, courseId: 8, title: 'Accounting Principles Quiz', questions: [
    { questionId: 24, questionText: 'What is a balance sheet?', options: ['Income statement', 'Financial position snapshot', 'Cash flow'], correctOption: 1 }
  ]},
  { quizId: 24, courseId: 8, title: 'Financial Statements Quiz', questions: [
    { questionId: 25, questionText: 'What does GAAP stand for?', options: ['Generally Accepted Accounting Principles', 'Global Accounting Practices', 'Government Approved Accounting'], correctOption: 0 }
  ]},
  { quizId: 25, courseId: 8, title: 'Double Entry Quiz', questions: [
    { questionId: 26, questionText: 'What is double-entry bookkeeping?', options: ['Two transactions', 'Debit and credit for each transaction', 'Two accounts'], correctOption: 1 }
  ]},
  
  // Course 9: Investment Strategies (3 quizzes)
  { quizId: 26, courseId: 9, title: 'Investment Basics Quiz', questions: [
    { questionId: 27, questionText: 'What is diversification?', options: ['Buying one stock', 'Spreading investments', 'Selling stocks'], correctOption: 1 }
  ]},
  { quizId: 27, courseId: 9, title: 'Stock Market Quiz', questions: [
    { questionId: 28, questionText: 'What is a dividend?', options: ['Stock price', 'Company profit distribution', 'Tax'], correctOption: 1 }
  ]},
  { quizId: 28, courseId: 9, title: 'Bonds Quiz', questions: [
    { questionId: 29, questionText: 'What is a bond?', options: ['Equity', 'Debt security', 'Currency'], correctOption: 1 }
  ]},
  
  // Course 10: Corporate Finance (3 quizzes)
  { quizId: 29, courseId: 10, title: 'Financial Modeling Quiz', questions: [
    { questionId: 30, questionText: 'What is NPV?', options: ['Net Present Value', 'New Product Version', 'National Price Variance'], correctOption: 0 }
  ]},
  { quizId: 30, courseId: 10, title: 'Valuation Quiz', questions: [
    { questionId: 31, questionText: 'What is DCF?', options: ['Discounted Cash Flow', 'Direct Cost Formula', 'Deferred Compensation'], correctOption: 0 }
  ]},
  { quizId: 31, courseId: 10, title: 'Capital Structure Quiz', questions: [
    { questionId: 32, questionText: 'What is WACC?', options: ['Weighted Average Cost of Capital', 'Weekly Accounting Cost', 'Working Asset Current Cost'], correctOption: 0 }
  ]},
  
  // Course 11: Python for Data Science (3 quizzes)
  { quizId: 32, courseId: 11, title: 'Pandas & NumPy Quiz', questions: [
    { questionId: 33, questionText: 'What is a DataFrame?', options: ['A function', 'A 2D data structure', 'A loop'], correctOption: 1 }
  ]},
  { quizId: 33, courseId: 11, title: 'Data Manipulation Quiz', questions: [
    { questionId: 34, questionText: 'What does groupby do?', options: ['Sorts data', 'Groups data by column', 'Deletes data'], correctOption: 1 }
  ]},
  { quizId: 34, courseId: 11, title: 'Matplotlib Quiz', questions: [
    { questionId: 35, questionText: 'What is matplotlib?', options: ['Database', 'Plotting library', 'Web framework'], correctOption: 1 }
  ]},
  
  // Course 12: Machine Learning Fundamentals (3 quizzes)
  { quizId: 35, courseId: 12, title: 'ML Concepts Quiz', questions: [
    { questionId: 36, questionText: 'What is supervised learning?', options: ['Learning with labeled data', 'Learning without data', 'Random learning'], correctOption: 0 }
  ]},
  { quizId: 36, courseId: 12, title: 'Algorithms Quiz', questions: [
    { questionId: 37, questionText: 'What is overfitting?', options: ['Model too simple', 'Model too complex', 'Model perfect'], correctOption: 1 }
  ]},
  { quizId: 37, courseId: 12, title: 'Model Evaluation Quiz', questions: [
    { questionId: 38, questionText: 'What is accuracy?', options: ['Training time', 'Correct predictions / Total predictions', 'Loss function'], correctOption: 1 }
  ]},
  
  // Course 13: Data Visualization (3 quizzes)
  { quizId: 38, courseId: 13, title: 'Visualization Principles Quiz', questions: [
    { questionId: 39, questionText: 'Which chart shows trends over time?', options: ['Pie chart', 'Line chart', 'Bar chart'], correctOption: 1 }
  ]},
  { quizId: 39, courseId: 13, title: 'Chart Types Quiz', questions: [
    { questionId: 40, questionText: 'When to use a scatter plot?', options: ['Show distribution', 'Show relationship between variables', 'Show categories'], correctOption: 1 }
  ]},
  { quizId: 40, courseId: 13, title: 'Dashboard Design Quiz', questions: [
    { questionId: 41, questionText: 'What is KPI?', options: ['Key Performance Indicator', 'Knowledge Process Integration', 'Key Product Information'], correctOption: 0 }
  ]}
];

let quizIdSeq = quizzes.length + 1;
export function nextQuizId() { return quizIdSeq++; }
