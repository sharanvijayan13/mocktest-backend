// Test script to verify label functionality
// Run this with: node test_labels_api.js

const API_BASE = 'http://localhost:5000';

// Replace with your actual JWT token
const TOKEN = 'your_jwt_token_here';

async function testLabelsAPI() {
  console.log('🏷️ Testing Labels API...\n');

  try {
    // Test 1: Create a note with labels
    console.log('1. Creating a note with labels...');
    const createResponse = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: 'Test Note with Labels',
        body: 'This is a test note with multiple labels',
        is_draft: false,
        labels: [
          { id: 1, name: 'Work', color: '#3b82f6' },
          { id: 2, name: 'Important', color: '#ef4444' }
        ]
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Create failed: ${createResponse.status}`);
    }

    const createdNote = await createResponse.json();
    console.log('✅ Note created with labels:', createdNote);
    console.log('   Labels:', createdNote.labels);

    // Test 2: Create a draft with labels
    console.log('\n2. Creating a draft with labels...');
    const draftResponse = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: 'Draft with Labels',
        body: 'This is a draft with labels',
        is_draft: true,
        labels: [
          { id: 3, name: 'Ideas', color: '#f59e0b' },
          { id: 4, name: 'Personal', color: '#10b981' }
        ]
      })
    });

    if (!draftResponse.ok) {
      throw new Error(`Draft create failed: ${draftResponse.status}`);
    }

    const createdDraft = await draftResponse.json();
    console.log('✅ Draft created with labels:', createdDraft);

    // Test 3: Fetch notes and verify labels
    console.log('\n3. Fetching notes to verify labels...');
    const notesResponse = await fetch(`${API_BASE}/api/posts/me`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (!notesResponse.ok) {
      throw new Error(`Fetch notes failed: ${notesResponse.status}`);
    }

    const notes = await notesResponse.json();
    console.log('✅ Notes fetched:', notes.length, 'notes found');
    notes.forEach(note => {
      console.log(`   - "${note.title}"`);
      if (note.labels && note.labels.length > 0) {
        console.log(`     Labels: ${note.labels.map(l => l.name).join(', ')}`);
      }
    });

    // Test 4: Update note labels
    console.log('\n4. Updating note labels...');
    const updateResponse = await fetch(`${API_BASE}/api/posts/${createdNote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: createdNote.title,
        body: createdNote.body,
        labels: [
          { id: 1, name: 'Work', color: '#3b82f6' },
          { id: 5, name: 'Updated', color: '#8b5cf6' }
        ]
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }

    const updatedNote = await updateResponse.json();
    console.log('✅ Note updated with new labels:', updatedNote.labels);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Instructions
console.log('📋 Instructions:');
console.log('1. Replace TOKEN variable with your actual JWT token');
console.log('2. Make sure your backend is running on localhost:5000');
console.log('3. Run the labels migration SQL in your Supabase dashboard');
console.log('4. Run: node test_labels_api.js\n');

// Uncomment the line below after setting your token
// testLabelsAPI();