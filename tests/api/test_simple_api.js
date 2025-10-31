// Simple test to check if basic API endpoints work
// Run this with: node test_simple_api.js

const BACKEND = "http://localhost:5000";

async function testSimpleAPI() {
  console.log('🔍 Testing Simple API Endpoints...\n');

  // Replace with your actual JWT token
  const TOKEN = 'your_jwt_token_here';
  
  if (TOKEN === 'your_jwt_token_here') {
    console.log('❌ Please replace TOKEN with your actual JWT token');
    console.log('   1. Login to your app');
    console.log('   2. Open browser dev tools (F12)');
    console.log('   3. Go to Application → Local Storage');
    console.log('   4. Copy the "token" value');
    return;
  }

  try {
    // Test 1: Check server health
    console.log('1. Testing server health...');
    const healthRes = await fetch(`${BACKEND}/`);
    console.log('   Server status:', healthRes.status);
    
    if (healthRes.ok) {
      const healthText = await healthRes.text();
      console.log('   Server response:', healthText);
    }

    // Test 2: Test basic posts endpoint
    console.log('\n2. Testing basic posts endpoint...');
    const postsRes = await fetch(`${BACKEND}/api/posts/me`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });

    console.log('   Posts endpoint status:', postsRes.status);
    
    if (postsRes.ok) {
      const postsData = await postsRes.json();
      console.log('✅ Posts endpoint works');
      console.log('   Response type:', Array.isArray(postsData) ? 'Array' : 'Object');
      console.log('   Posts count:', Array.isArray(postsData) ? postsData.length : 'N/A');
      
      if (Array.isArray(postsData) && postsData.length > 0) {
        console.log('   Sample post keys:', Object.keys(postsData[0]));
        console.log('   Has is_draft field:', 'is_draft' in postsData[0]);
        
        const drafts = postsData.filter(p => p.is_draft);
        const published = postsData.filter(p => !p.is_draft);
        console.log('   Drafts:', drafts.length);
        console.log('   Published:', published.length);
      }
    } else {
      const error = await postsRes.text();
      console.log('❌ Posts endpoint failed:', error);
    }

    // Test 3: Test drafts endpoint
    console.log('\n3. Testing drafts endpoint...');
    const draftsRes = await fetch(`${BACKEND}/api/drafts/me`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });

    console.log('   Drafts endpoint status:', draftsRes.status);
    
    if (draftsRes.ok) {
      const draftsData = await draftsRes.json();
      console.log('✅ Drafts endpoint works');
      console.log('   Drafts count:', Array.isArray(draftsData) ? draftsData.length : 'N/A');
    } else {
      console.log('⚠️ Drafts endpoint failed, will use posts endpoint with filtering');
    }

    // Test 4: Create a simple post
    console.log('\n4. Testing post creation...');
    const createRes = await fetch(`${BACKEND}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: 'Simple API Test',
        body: 'This is a test post to verify the API works',
        is_draft: false
      })
    });

    console.log('   Create status:', createRes.status);
    
    if (createRes.ok) {
      const createData = await createRes.json();
      console.log('✅ Post creation works');
      console.log('   Created post ID:', createData.id);
      console.log('   Created post title:', createData.title);
    } else {
      const error = await createRes.text();
      console.log('❌ Post creation failed:', error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure backend server is running');
    console.log('   - Check if you can access ' + BACKEND + ' in browser');
    console.log('   - Verify your JWT token is valid');
    console.log('   - Check backend console for error messages');
  }
}

testSimpleAPI();