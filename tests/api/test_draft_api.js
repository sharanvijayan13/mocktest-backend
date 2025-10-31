// Test script to verify draft API functionality
// Run this with: node test_draft_api.js

const API_BASE = 'http://localhost:5000';

// Replace with your actual JWT token
const TOKEN = 'your_jwt_token_here';

async function testDraftAPI() {
  console.log('🧪 Testing Draft API...\n');

  try {
    // Test 1: Create a draft
    console.log('1. Creating a draft...');
    const createResponse = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: 'Test Draft',
        body: 'This is a test draft',
        is_draft: true
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Create failed: ${createResponse.status}`);
    }

    const createdDraft = await createResponse.json();
    console.log('✅ Draft created:', createdDraft);
    console.log('   is_draft value:', createdDraft.is_draft);

    // Test 2: Fetch drafts
    console.log('\n2. Fetching drafts...');
    const draftsResponse = await fetch(`${API_BASE}/api/drafts/me`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (!draftsResponse.ok) {
      throw new Error(`Fetch drafts failed: ${draftsResponse.status}`);
    }

    const drafts = await draftsResponse.json();
    console.log('✅ Drafts fetched:', drafts.length, 'drafts found');
    drafts.forEach(draft => {
      console.log(`   - "${draft.title}" (is_draft: ${draft.is_draft})`);
    });

    // Test 3: Fetch published notes
    console.log('\n3. Fetching published notes...');
    const notesResponse = await fetch(`${API_BASE}/api/posts/me`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (!notesResponse.ok) {
      throw new Error(`Fetch notes failed: ${notesResponse.status}`);
    }

    const notes = await notesResponse.json();
    console.log('✅ Published notes fetched:', notes.length, 'notes found');
    notes.forEach(note => {
      console.log(`   - "${note.title}" (is_draft: ${note.is_draft})`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Instructions
console.log('📋 Instructions:');
console.log('1. Replace TOKEN variable with your actual JWT token');
console.log('2. Make sure your backend is running on localhost:5000');
console.log('3. Run: node test_draft_api.js\n');

// Uncomment the line below after setting your token
// testDraftAPI();