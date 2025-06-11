#!/usr/bin/env node

const API_URL = 'https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps';

async function monitorAPI() {
    console.log('🔍 Monitoring Robot GPS API for changes...');
    console.log('='.repeat(60));
    
    let previousData = null;
    let unchangedCount = 0;
    
    const monitor = setInterval(async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const timestamp = new Date().toLocaleTimeString();
            
            if (previousData) {
                const latChanged = data.lat !== previousData.lat;
                const lonChanged = data.lon !== previousData.lon;
                const timestampChanged = data.timestamp !== previousData.timestamp;
                
                if (latChanged || lonChanged || timestampChanged) {
                    console.log(`🔄 [${timestamp}] CHANGE DETECTED!`);
                    console.log(`   Lat: ${previousData.lat} → ${data.lat} ${latChanged ? '✅' : '➖'}`);
                    console.log(`   Lon: ${previousData.lon} → ${data.lon} ${lonChanged ? '✅' : '➖'}`);
                    console.log(`   TS:  ${previousData.timestamp} → ${data.timestamp} ${timestampChanged ? '✅' : '➖'}`);
                    unchangedCount = 0;
                } else {
                    unchangedCount++;
                    console.log(`⏸️  [${timestamp}] No change (${unchangedCount} times) - Lat: ${data.lat}, Lon: ${data.lon}`);
                }
            } else {
                console.log(`🚀 [${timestamp}] Initial data - Lat: ${data.lat}, Lon: ${data.lon}, TS: ${data.timestamp}`);
            }
            
            if (unchangedCount >= 10) {
                console.log('\n⚠️  WARNING: API data hasn\'t changed in 10+ requests');
                console.log('   This could mean:');
                console.log('   • Robot is stationary');
                console.log('   • API is returning cached data');
                console.log('   • Robot is not sending live updates');
            }
            
            previousData = data;
            
        } catch (error) {
            console.log(`❌ [${new Date().toLocaleTimeString()}] Error: ${error.message}`);
        }
        
        console.log('-'.repeat(40));
        
    }, 3000); // Check every 3 seconds
    
    // Stop after 1 minute
    setTimeout(() => {
        clearInterval(monitor);
        console.log('\n🏁 Monitoring complete');
    }, 60000);
}

monitorAPI();
