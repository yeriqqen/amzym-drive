'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/ui/PageLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRobotTracking } from '@/hooks/useRobotTracking';

// Dynamically import the map to avoid SSR issues
const RobotTrackingMap = dynamic(
    () => import('../../components/delivery/RobotTrackingMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading robot tracker...</p>
                </div>
            </div>
        )
    }
);

export default function RobotTrackingPage() {
    const [mapView, setMapView] = useState<'full' | 'split'>('full');
    
    const {
        currentPosition,
        trail,
        isTracking,
        error,
        robotInfo,
        startTracking,
        stopTracking,
        refreshPosition
    } = useRobotTracking();

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                        🤖 Live Robot Tracking
                    </h1>
                    <p className="text-xl text-gray-700 mt-2">
                        Monitor your delivery robot in real-time
                    </p>
                </div>

                {/* Control Panel */}
                <div className="mb-6">
                    <Card className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Status */}
                            <div className="flex items-center space-x-4">
                                <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                                    isTracking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    <div className={`w-3 h-3 rounded-full mr-2 ${
                                        isTracking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                                    }`}></div>
                                    {isTracking ? 'Live Tracking Active' : 'Tracking Stopped'}
                                </div>

                                {currentPosition && (
                                    <div className="text-sm text-gray-600">
                                        Last update: {new Date(currentPosition.timestamp).toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex space-x-3">
                                <Button
                                    onClick={isTracking ? stopTracking : startTracking}
                                    variant={isTracking ? 'outline' : 'primary'}
                                    size="sm"
                                >
                                    {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                                </Button>
                                <Button
                                    onClick={refreshPosition}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                    </Card>
                </div>

                {/* View Toggle */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-white rounded-lg p-1 shadow-md">
                        <button
                            onClick={() => setMapView('full')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                mapView === 'full'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-blue-500'
                            }`}
                        >
                            Full Map
                        </button>
                        <button
                            onClick={() => setMapView('split')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                mapView === 'split'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-blue-500'
                            }`}
                        >
                            Map + Details
                        </button>
                    </div>
                </div>

                {/* Content */}
                {mapView === 'full' ? (
                    /* Full Map View */
                    <Card className="p-0 overflow-hidden">
                        <RobotTrackingMap 
                            className="h-[600px]"
                            enableTrail={true}
                            showRobotInfo={true}
                        />
                    </Card>
                ) : (
                    /* Split View */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Map Column */}
                        <div className="lg:col-span-2">
                            <Card className="p-0 overflow-hidden">
                                <RobotTrackingMap 
                                    className="h-[500px]"
                                    enableTrail={true}
                                    showRobotInfo={false}
                                />
                            </Card>
                        </div>

                        {/* Details Column */}
                        <div className="space-y-6">
                            {/* Robot Info */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    🤖 Robot Status
                                </h3>
                                
                                {currentPosition ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`font-medium capitalize ${
                                                currentPosition.status === 'active' ? 'text-green-600' :
                                                currentPosition.status === 'idle' ? 'text-yellow-600' :
                                                currentPosition.status === 'charging' ? 'text-blue-600' :
                                                'text-red-600'
                                            }`}>
                                                {currentPosition.status || 'Active'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Speed:</span>
                                            <span className="font-medium">{currentPosition.speed || 0} km/h</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Battery:</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${
                                                            (currentPosition.battery || 100) > 50 ? 'bg-green-500' :
                                                            (currentPosition.battery || 100) > 20 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`}
                                                        style={{ width: `${currentPosition.battery || 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium">{currentPosition.battery || 100}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Location:</span>
                                            <span className="font-medium text-sm">
                                                {currentPosition.lat.toFixed(5)}, {currentPosition.lon.toFixed(5)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        No robot data available
                                    </div>
                                )}
                            </Card>

                            {/* Trail Info */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    📍 Movement Trail
                                </h3>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trail Points:</span>
                                        <span className="font-medium">{trail.length}</span>
                                    </div>
                                    
                                    {trail.length > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Recording Since:</span>
                                            <span className="font-medium text-sm">
                                                {new Date(trail[0].timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* AWS API Info */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    ☁️ AWS Connection
                                </h3>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">API Status:</span>
                                        <span className={`font-medium ${
                                            !error ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {!error ? 'Connected' : 'Error'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Update Interval:</span>
                                        <span className="font-medium">2 seconds</span>
                                    </div>
                                    
                                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                        <strong>Endpoint:</strong><br />
                                        sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
