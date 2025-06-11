import Link from 'next/link';

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        🤖 Robot Tracking System Demo
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Complete AWS IoT integration for real-time robot tracking with interactive maps, 
                        live position updates, and comprehensive monitoring dashboard.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-3xl mb-4">🌐</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">AWS IoT Integration</h3>
                        <p className="text-gray-600 mb-4">
                            Connected to AWS IoT → DynamoDB → Lambda → HTTP API pipeline for real-time GPS data from delivery robots.
                        </p>
                        <div className="text-sm text-green-600 font-medium">✅ Production Ready</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-3xl mb-4">🗺️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Maps</h3>
                        <p className="text-gray-600 mb-4">
                            Leaflet-based mapping with robot markers, position trails, info popups, and real-time movement visualization.
                        </p>
                        <div className="text-sm text-blue-600 font-medium">📍 Live Tracking</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-3xl mb-4">⚡</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Updates</h3>
                        <p className="text-gray-600 mb-4">
                            Position updates every 2 seconds with battery monitoring, speed tracking, and status indicators.
                        </p>
                        <div className="text-sm text-purple-600 font-medium">🔄 2s Interval</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-3xl mb-4">🛠️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Monitoring Dashboard</h3>
                        <p className="text-gray-600 mb-4">
                            Control panel with start/stop tracking, robot status display, battery levels, and speed indicators.
                        </p>
                        <div className="text-sm text-orange-600 font-medium">📊 Full Control</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-3xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Trail Visualization</h3>
                        <p className="text-gray-600 mb-4">
                            Historical position trails with 100-point history, color-coded paths, and smooth trajectory display.
                        </p>
                        <div className="text-sm text-red-600 font-medium">📈 100 Points</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-3xl mb-4">🔄</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Fallback System</h3>
                        <p className="text-gray-600 mb-4">
                            Mock service for testing and development when AWS API is unavailable, with simulated robot data.
                        </p>
                        <div className="text-sm text-indigo-600 font-medium">🧪 Demo Mode</div>
                    </div>
                </div>

                {/* Technical Architecture */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🏗️ Technical Architecture</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Backend Services</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• AWS IoT Core for device connectivity</li>
                                <li>• DynamoDB for GPS data storage</li>
                                <li>• Lambda functions for data processing</li>
                                <li>• HTTP API Gateway for REST endpoints</li>
                                <li>• Real-time WebSocket connections</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Frontend Components</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• React hooks for state management</li>
                                <li>• TypeScript for type safety</li>
                                <li>• Leaflet.js for interactive maps</li>
                                <li>• Tailwind CSS for styling</li>
                                <li>• Next.js for server-side rendering</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Code Structure */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">📁 Code Implementation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">Core Files</h3>
                            <div className="text-sm space-y-1 font-mono text-gray-600">
                                <div>📄 types/robot.ts - Type definitions</div>
                                <div>⚙️ services/robotTrackingService.ts - AWS API</div>
                                <div>🎣 hooks/useRobotTracking.ts - React hook</div>
                                <div>🗺️ components/RobotTrackingMap.tsx - Map UI</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">Pages</h3>
                            <div className="text-sm space-y-1 font-mono text-gray-600">
                                <div>📱 app/robot-tracking/page.tsx - Dashboard</div>
                                <div>🗺️ app/map/page.tsx - Main map</div>
                                <div>🔄 services/mockRobotService.ts - Fallback</div>
                                <div>🧭 components/Header.tsx - Navigation</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Configuration */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🔗 AWS API Configuration</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Endpoint:</span>
                            <code className="bg-white px-3 py-1 rounded text-sm font-mono">
                                https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps
                            </code>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Region:</span>
                            <span className="text-gray-600">ap-northeast-2 (Seoul)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Update Frequency:</span>
                            <span className="text-gray-600">2 seconds</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Data Format:</span>
                            <span className="text-gray-600">JSON with GPS coordinates, battery, speed</span>
                        </div>
                    </div>
                </div>

                {/* Demo Links */}
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">🚀 Try the Demo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <Link 
                            href="/robot-tracking"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            🤖 Full Robot Dashboard
                        </Link>
                        <Link 
                            href="/map"
                            className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            🗺️ Integrated Map View
                        </Link>
                        <Link 
                            href="/items"
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            🛒 Order & Track
                        </Link>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
                        <div className="font-semibold">✅ Frontend</div>
                        <div className="text-sm">Running on :3000</div>
                    </div>
                    <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
                        <div className="font-semibold">🗺️ Maps</div>
                        <div className="text-sm">Leaflet Integration</div>
                    </div>
                    <div className="bg-purple-100 text-purple-800 p-4 rounded-lg text-center">
                        <div className="font-semibold">🤖 Robots</div>
                        <div className="text-sm">AWS IoT Connected</div>
                    </div>
                    <div className="bg-orange-100 text-orange-800 p-4 rounded-lg text-center">
                        <div className="font-semibold">📡 Real-time</div>
                        <div className="text-sm">2s Updates</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
