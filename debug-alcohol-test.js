// Debug script for alcohol test
const alcoholTestData = {
  answers: {
    'q1': 'هرگز',
    'q2': 'گاهی',
    'q3': 'اغلب',
    'q4': 'خیر',
    'q5': 'بله'
  }
};

console.log('🍺 Alcohol Test Debug');
console.log('Test data:', JSON.stringify(alcoholTestData, null, 2));

// Simulate alcohol test questions
const alcoholQuestions = [
  { id: 'q1', type: 'single', weight: 1, options: [{ value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }] },
  { id: 'q2', type: 'single', weight: 1, options: [{ value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }] },
  { id: 'q3', type: 'single', weight: 2, options: [{ value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }] },
  { id: 'q4', type: 'single', weight: 1, options: [{ value: 'خیر', score: 0 }, { value: 'بله', score: 1 }] },
  { id: 'q5', type: 'single', weight: 1, options: [{ value: 'خیر', score: 0 }, { value: 'بله', score: 1 }] }
];

let score = 0;
for (const q of alcoholQuestions) {
  const ans = alcoholTestData.answers[q.id];
  if (ans == null) continue;
  
  if (q.type === 'single') {
    const opt = (q.options || []).find((o) => o.value === ans);
    if (opt) {
      const questionScore = (opt.score || 0) * (q.weight || 1);
      score += questionScore;
      console.log(`Question ${q.id}: ${ans} -> score: ${opt.score} * weight: ${q.weight} = ${questionScore}`);
    }
  }
}

console.log('Total score:', score);

// Calculate alcohol grade
let grade = 'نامشخص';
if (score <= 7) grade = 'کم‌خطر';
else if (score <= 15) grade = 'خطر متوسط';
else grade = 'پرخطر';

console.log('Grade:', grade);

// Description
let description = '';
if (grade === 'کم‌خطر') description = 'الگوی مصرف کم‌خطر. پرهیز یا محدودسازی بیشتر توصیه می‌شود.';
else if (grade === 'خطر متوسط') description = 'مصرف در محدوده خطر متوسط. کاهش مصرف و مشاوره تخصصی توصیه می‌شود.';
else if (grade === 'پرخطر') description = 'مصرف پرخطر. ارزیابی تخصصی و برنامه ترک تحت نظر کارشناس توصیه می‌شود.';

console.log('Description:', description);

// Test result object
const result = {
  score,
  grade,
  gradeDescription: description,
  recommendedPackages: [],
  resultId: 'test-result-id'
};

console.log('\nFinal result:', JSON.stringify(result, null, 2));