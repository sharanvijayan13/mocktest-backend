// Debug script to check current state of the application
// Run this with: node debug_current_state.js

const BACKEND = "http://localhost:5000";

async function debugCurrentState() {
  console.log('🔍 Debugging Current State...\n');

  // Replace with your actual JWT token
  const TOKEN = 'your_jwt_token_here';
  
  if (TOKEN === 'your_jwt_token_here') {
    console.log('❌ Please replace TOKEN with your actual JWT token');
    console.log('   1. Open your app in browser');
    console.log('   2. Login to your account');
    console.log('   3. Open browser dev tools (F12)');
    console.log('   4. Go to Application/Storage tab');
    console.log('   5. Find localStorage and copy the "token" value');
    return;
  }

  try {
    // Test 1: Check if backend is running
    console.log('1. Testing backend connection...');
    const healthRes = await fetch(`${BACKEND}/`);
    console.log('   Backend status:', healthRes.status);
    
    if (!healthRes.ok) {
      console.log('❌ Backend not accessible');
      return;
    }

    // Test 2: Check old API format
    console.log('\n2. Testing old API format...');
    const oldRes = await fetch(`${BACKEND}/api/posts/me`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });

    console.log('   Old API status:', oldRes.status);
    
    if (oldRes.ok) {
      const oldData = await oldRes.json();
      console.log('   Old API response type:', Array.isArray(oldData) ? 'Array' : 'Object');
      console.log('   Old API data count:', Array.isArray(oldData) ? oldData.length : 'N/A');
      
      if (Array.isArray(oldData) && oldData.length > 0) {
        console.log('   Sample post structure:', Object.keys(oldData[0]));
        console.log('   Has tags column:', 'tags' in oldData[0]);
      }
    }

    // Test 3: Check new API format
    console.log('\n3. Testing new API format...');
    const newRes = await fetch(`${BACKEND}/api/posts/me?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });

    console.log('   New API status:', newRes.status);
    
    if (newRes.ok) {
      const newData = await newRes.json();
      console.log('   New API response type:', typeof newData);
      console.log('   Has pagination:', !!newData.pagination);
      console.log('   Has data array:', !!newData.data);
      
      if (newData.data) {
        console.log('   Data count:', newData.data.length);
        if (newData.data.length > 0) {
          console.log('   Sample post structure:', Object.keys(newData.data[0]));
          console.log('   Has tags column:', 'tags' in newData.data[0]);
        }
      }
    }

    // Test 4: Try creating a simple post
    console.log('\n4. Testing post creation...');
    const createRes = await fetch(`${BACKEND}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        title: 'Debug Test Post',
        body: 'This is a test post to debug the system',
        is_draft: false
      })
    });

    console.log('   Create status:', createRes.status);
    
    if (createRes.ok) {
      const createData = await createRes.json();
      console.log('✅ Post creation works');
      console.log('   Created post ID:', createData.id);
    } else {
      const error = await createRes.text();
      console.log('❌ Post creation failed:', error);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugCurrentState();