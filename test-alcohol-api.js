// Test script for alcohol API endpoints
const API_BASE = 'http://localhost:3001/api';

async function testAlcoholAPI() {
  try {
    console.log('🍺 Testing Alcohol API endpoints...');
    
    // Test 1: Get templates
    console.log('\n1. Testing templates endpoint...');
    const templatesResponse = await fetch(`${API_BASE}/tests/templates`);
    const templates = await templatesResponse.json();
    console.log('Templates:', templates.length, 'found');
    
    if (templates.length === 0) {
      console.log('❌ No templates found!');
      return;
    }
    
    // Find alcohol template
    const alcoholTemplate = templates.find(t => t.type === 'alcohol');
    if (!alcoholTemplate) {
      console.log('❌ No alcohol template found!');
      return;
    }
    
    console.log('Alcohol template:', alcoholTemplate.name, alcoholTemplate.type);
    console.log('Questions:', alcoholTemplate.questions?.length || 0);
    
    // Test 2: Submit alcohol test
    console.log('\n2. Testing alcohol test submission...');
    const alcoholTestData = {
      answers: {
        'q1': 'هرگز',
        'q2': 'گاهی',
        'q3': 'اغلب',
        'q4': 'خیر',
        'q5': 'بله'
      }
    };
    
    console.log('Submitting test data:', JSON.stringify(alcoholTestData, null, 2));
    
    const submitResponse = await fetch(`${API_BASE}/tests/${alcoholTemplate.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alcoholTestData)
    });
    
    if (!submitResponse.ok) {
      console.log('❌ Submit failed with status:', submitResponse.status);
      const errorText = await submitResponse.text();
      console.log('Error:', errorText);
      return;
    }
    
    const result = await submitResponse.json();
    console.log('Submit result:', JSON.stringify(result, null, 2));
    
    if (result.score !== undefined && result.grade) {
      console.log('✅ Alcohol test submission successful!');
      console.log('Score:', result.score);
      console.log('Grade:', result.grade);
      console.log('Description:', result.gradeDescription);
    } else {
      console.log('❌ Alcohol test submission failed - no score/grade returned');
      console.log('Result keys:', Object.keys(result));
    }
    
  } catch (error) {
    console.error('❌ Alcohol API test failed:', error.message);
  }
}

// Run the test
testAlcoholAPI();