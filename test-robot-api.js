#!/usr/bin/env node

// Simple test script to verify the robot tracking API
const API_URL = 'https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps';

async function testAPI() {
    console.log('🤖 Robot Tracking API Test');
    console.log('='.repeat(50));
    console.log(`📡 Testing endpoint: ${API_URL}`);
    console.log('⏱️  Monitoring for 10 seconds with 2-second intervals...\n');

    let testCount = 0;
    const maxTests = 5;

    const interval = setInterval(async () => {
        testCount++;
        const timestamp = new Date().toLocaleTimeString();
        
        try {
            console.log(`[${testCount}/${maxTests}] ${timestamp} - Fetching GPS data...`);
            
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Success: Lat: ${data.lat}, Lon: ${data.lon}, Timestamp: ${data.timestamp}`);
            
            // Calculate distance from previous position if available
            if (testCount > 1 && global.lastPosition) {
                const distance = calculateDistance(
                    global.lastPosition.lat, global.lastPosition.lon,
                    data.lat, data.lon
                );
                console.log(`📏 Distance moved: ${distance.toFixed(2)} meters`);
            }
            
            global.lastPosition = data;
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log('-'.repeat(30));
        
        if (testCount >= maxTests) {
            clearInterval(interval);
            console.log('\n🏁 Test completed!');
            console.log('✨ Robot tracking API is working correctly');
            console.log('🗺️  You can now use the map at: http://localhost:3000/map');
        }
    }, 2000);
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Start the test
testAPI().catch(console.error);
