// Debug script to check if labels column exists in database
// Run this with: node debug_labels_schema.js

const API_BASE = 'http://localhost:5000';

// Replace with your actual JWT token
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzYxODg2OTU1LCJleHAiOjE3NjQ0Nzg5NTV9.5RCyb30RzbR8La8zii692lB8Ur4avnAoU4mBjxLoPeU';

async function debugLabelsSchema() {
  console.log('🔍 Debugging Labels Schema...\n');

  if (TOKEN === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzYxODg2OTU1LCJleHAiOjE3NjQ0Nzg5NTV9.5RCyb30RzbR8La8zii692lB8Ur4avnAoU4mBjxLoPeU') {
    console.log('❌ Please replace TOKEN with your actual JWT token');
    console.log('   1. Open your app in browser');
    console.log('   2. Login to your account');
    console.log('   3. Open browser dev tools (F12)');
    console.log('   4. Go to Application/Storage tab');
    console.log('   5. Find localStorage and copy the "token" value');
    return;
  }

  try {
    // Test 1: Create a simple note without labels first
    console.log('1. Creating a note without labels...');
    const simpleResponse = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: 'Test Note - No Labels',
        body: 'This is a test note without labels',
        is_draft: false
      })
    });

    if (!simpleResponse.ok) {
      const error = await simpleResponse.text();
      console.log('❌ Simple note creation failed:', error);
      return;
    }

    const simpleNote = await simpleResponse.json();
    console.log('✅ Simple note created:', simpleNote);
    console.log('   Has labels property:', 'labels' in simpleNote);
    console.log('   Labels value:', simpleNote.labels);

    // Test 2: Try creating a note with labels
    console.log('\n2. Creating a note with labels...');
    const labelResponse = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: 'Test Note - With Labels',
        body: 'This is a test note with labels',
        is_draft: false,
        labels: [
          { id: 1, name: 'Test', color: '#3b82f6' }
        ]
      })
    });

    if (!labelResponse.ok) {
      const error = await labelResponse.text();
      console.log('❌ Label note creation failed:', error);
      console.log('   This might indicate the labels column doesn\'t exist');
    } else {
      const labelNote = await labelResponse.json();
      console.log('✅ Label note created:', labelNote);
      console.log('   Labels stored:', labelNote.labels);
    }

    // Test 3: Fetch existing notes to check schema
    console.log('\n3. Fetching existing notes...');
    const fetchResponse = await fetch(`${API_BASE}/api/posts/me`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (!fetchResponse.ok) {
      throw new Error(`Fetch failed: ${fetchResponse.status}`);
    }

    const notes = await fetchResponse.json();
    console.log('✅ Notes fetched:', notes.length, 'notes found');
    
    if (notes.length > 0) {
      const sampleNote = notes[0];
      console.log('   Sample note structure:', Object.keys(sampleNote));
      console.log('   Has labels property:', 'labels' in sampleNote);
      console.log('   Labels value:', sampleNote.labels);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Instructions
console.log('📋 Debug Instructions:');
console.log('1. Replace TOKEN variable with your actual JWT token');
console.log('2. Make sure your backend is running on localhost:5000');
console.log('3. Run: node debug_labels_schema.js');
console.log('4. If labels column doesn\'t exist, run the migration SQL\n');

// Uncomment the line below after setting your token
// debugLabelsSchema();