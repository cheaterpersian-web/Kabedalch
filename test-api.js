// Test script for API endpoints
const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...');
    
    // Test 1: Get templates
    console.log('\n1. Testing templates endpoint...');
    const templatesResponse = await fetch(`${API_BASE}/tests/templates`);
    const templates = await templatesResponse.json();
    console.log('Templates:', templates.length, 'found');
    
    if (templates.length === 0) {
      console.log('❌ No templates found!');
      return;
    }
    
    const firstTemplate = templates[0];
    console.log('First template:', firstTemplate.name, firstTemplate.type);
    
    // Test 2: Submit test
    console.log('\n2. Testing test submission...');
    const testData = {
      answers: {
        'q1': 'هرگز',
        'q2': 'گاهی',
        'q3': 'اغلب',
        'q4': 'خیر',
        'q5': 'خفیف'
      }
    };
    
    const submitResponse = await fetch(`${API_BASE}/tests/${firstTemplate.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const result = await submitResponse.json();
    console.log('Submit result:', result);
    
    if (result.score !== undefined && result.grade) {
      console.log('✅ Test submission successful!');
      console.log('Score:', result.score);
      console.log('Grade:', result.grade);
      console.log('Description:', result.gradeDescription);
    } else {
      console.log('❌ Test submission failed - no score/grade returned');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the test
testAPI();