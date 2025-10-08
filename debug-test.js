// Debug script for testing the test submission
const testData = {
  answers: {
    'q1': 'هرگز',
    'q2': 'گاهی',
    'q3': 'اغلب',
    'q4': 'خیر',
    'q5': 'خفیف'
  }
};

console.log('Test data:', JSON.stringify(testData, null, 2));

// Simulate the scoring logic
const questions = [
  { id: 'q1', type: 'single', weight: 1, options: [{ value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }] },
  { id: 'q2', type: 'single', weight: 1, options: [{ value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }] },
  { id: 'q3', type: 'single', weight: 2, options: [{ value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }] },
  { id: 'q4', type: 'single', weight: 1, options: [{ value: 'خیر', score: 0 }, { value: 'بله', score: 1 }] },
  { id: 'q5', type: 'single', weight: 1, options: [{ value: 'خفیف', score: 1 }, { value: 'متوسط', score: 2 }, { value: 'شدید', score: 3 }] }
];

let score = 0;
for (const q of questions) {
  const ans = testData.answers[q.id];
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

// Calculate grade
let grade = 'نامشخص';
if (score <= 4) grade = 'Grade 0 (نرمال)';
else if (score <= 9) grade = 'Grade 1 (خفیف)';
else if (score <= 14) grade = 'Grade 2 (متوسط)';
else grade = 'Grade 3 (شدید)';

console.log('Grade:', grade);