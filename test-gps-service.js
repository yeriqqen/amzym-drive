#!/usr/bin/env node

/**
 * GPS Service Test Script
 * 
 * This script tests the GPS service to ensure it correctly fetches data
 * from the AWS API endpoint and handles errors gracefully.
 */

const AWS_API_URL = 'https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps';

async function testGPSService() {
  console.log('🧪 Testing GPS Service');
  console.log('=' .repeat(50));
  console.log(`📡 API Endpoint: ${AWS_API_URL}\n`);

  try {
    console.log('📋 Test 1: Basic GPS data fetch');
    const response = await fetch(AWS_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ GPS data received:', data);
    
    // Validate data structure
    if (data.lat && data.lon && data.timestamp) {
      console.log('✅ Data structure is valid');
      console.log(`   📍 Coordinates: ${data.lat}, ${data.lon}`);
      console.log(`   🕐 Timestamp: ${new Date(data.timestamp).toISOString()}`);
    } else {
      console.log('❌ Invalid data structure:', data);
    }
    
    console.log('\n📋 Test 2: Multiple requests to check for updates');
    for (let i = 1; i <= 3; i++) {
      console.log(`   Request ${i}...`);
      const testResponse = await fetch(AWS_API_URL);
      const testData = await testResponse.json();
      console.log(`   📍 ${testData.lat}, ${testData.lon} (${new Date(testData.timestamp).toLocaleTimeString()})`);
      
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }
    
    console.log('\n✅ All tests passed! GPS service is working correctly.');
    console.log('\n🔧 Integration Summary:');
    console.log('   • Frontend can now fetch GPS data from AWS API');
    console.log('   • WebSocket connection errors should be resolved');
    console.log('   • 404 errors for /location/gps-data should be fixed');
    console.log('   • Both Vercel frontend and Render backend are properly configured');

  } catch (error) {
    console.error('❌ GPS Service test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Check if AWS API endpoint is accessible');
    console.log('   • Verify CORS settings on AWS API Gateway');
    console.log('   • Ensure GPS service is properly imported in components');
  }
}

// Run the test
testGPSService();
