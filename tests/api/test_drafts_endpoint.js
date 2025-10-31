// Test script to verify the drafts endpoint is working
// Run this after restarting your backend server

const API_BASE = 'http://localhost:5000';

async function testDraftsEndpoint() {
  console.log('🧪 Testing Drafts Endpoint...\n');

  try {
    // Test 1: Check if the endpoint exists (without auth - should get 401)
    console.log('1. Testing endpoint existence (should return 401)...');
    const response = await fetch(`${API_BASE}/api/drafts/me`);
    console.log('   Status:', response.status);
    console.log('   Expected: 401 (Unauthorized)');
    
    if (response.status === 404) {
      console.log('❌ ISSUE: Endpoint not found (404)');
      console.log('   This means the route is not registered properly');
      console.log('   Please restart your backend server');
      return;
    }
    
    if (response.status === 401) {
      console.log('✅ Endpoint exists and requires authentication');
    }

    // Test 2: Test with a dummy token (should still get 401 but different message)
    console.log('\n2. Testing with dummy token...');
    const authResponse = await fetch(`${API_BASE}/api/drafts/me`, {
      headers: {
        'Authorization': 'Bearer dummy-token'
      }
    });
    console.log('   Status:', authResponse.status);
    const authText = await authResponse.text();
    console.log('   Response:', authText);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Possible solutions:');
    console.log('   1. Make sure your backend server is running');
    console.log('   2. Restart your backend server to pick up route changes');
    console.log('   3. Check if the server is running on port 5000');
  }
}

console.log('📋 Instructions:');
console.log('1. Make sure your backend server is running');
console.log('2. If you made changes to routes, restart the server');
console.log('3. Run: node test_drafts_endpoint.js\n');

testDraftsEndpoint();