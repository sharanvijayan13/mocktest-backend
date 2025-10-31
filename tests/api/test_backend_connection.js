// Simple test to check if backend is accessible
// Run this in your browser console or as a Node.js script

const BACKEND = "http://localhost:5000";

async function testBackendConnection() {
  console.log('🔍 Testing backend connection...\n');

  try {
    // Test 1: Basic server health check
    console.log('1. Testing basic server connection...');
    const healthRes = await fetch(`${BACKEND}/`);
    console.log('   Status:', healthRes.status);
    console.log('   Response:', await healthRes.text());

    // Test 2: Check if API routes are accessible
    console.log('\n2. Testing API routes (without auth)...');
    const apiRes = await fetch(`${BACKEND}/api/posts`);
    console.log('   Status:', apiRes.status);
    
    if (apiRes.ok) {
      const data = await apiRes.json();
      console.log('   Public posts found:', data.length);
    } else {
      console.log('   Error:', await apiRes.text());
    }

    // Test 3: Test protected route (should fail without token)
    console.log('\n3. Testing protected route (should return 401)...');
    const protectedRes = await fetch(`${BACKEND}/api/posts/me`);
    console.log('   Status:', protectedRes.status);
    console.log('   Expected: 401 (Unauthorized)');

    // Test 4: Test drafts endpoint (should fail without token)
    console.log('\n4. Testing drafts endpoint (should return 401)...');
    const draftsRes = await fetch(`${BACKEND}/api/drafts/me`);
    console.log('   Status:', draftsRes.status);
    console.log('   Expected: 401 (Unauthorized)');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('   - Backend server is not running');
    console.log('   - Backend is running on a different port');
    console.log('   - CORS issues');
    console.log('   - Network connectivity problems');
  }
}

// Run the test
testBackendConnection();