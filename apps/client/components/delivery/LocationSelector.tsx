import React, { useState } from 'react';

interface Location {
    lat: number;
    lng: number;
    address: string;
    name: string;
}

interface LocationSelectorProps {
    onLocationChange: (startLocation: Location, arrivalLocation: Location) => void;
    className?: string;
}

const predefinedLocations = {
    startingPoints: [
        {
            lat: 35.228950619029085,
            lng: 126.8427269951037,
            address: "Building C9",
            name: "Dasan Building"
        },
        {
            lat: 35.22858702880908,
            lng: 126.83922370972543,
            address: "Building W6",
            name: "Student Union Building 1"
        },
        {
            lat: 35.2290,
            lng: 126.8435,
            address: "Building E11",
            name: "Undergraduate Dorm"
        },
        {
            lat: 35.2280,
            lng: 126.8450,
            address: "Building W4 Main Gate",
            name: "Graduate Dorm"
        },
        {
            lat: 35.2312,
            lng: 126.8432,
            address: "University Main Library N1",
            name: "Library Building"
        }

    ],
    arrivalPoints: [
        {
            lat: 35.228950619029085,
            lng: 126.8427269951037,
            address: "Building C9",
            name: "Dasan Building"
        },
        {
            lat: 35.22858702880908,
            lng: 126.83922370972543,
            address: "Building W6",
            name: "Student Union Building 1"
        },
        {
            lat: 35.2290,
            lng: 126.8435,
            address: "Building E11",
            name: "Undergraduate Dorm"
        },
        {
            lat: 35.2280,
            lng: 126.8450,
            address: "Building W4 Main Gate",
            name: "Graduate Dorm"
        },
        {
            lat: 35.2312,
            lng: 126.8432,
            address: "University Main Library N1",
            name: "Library Building"
        }
    ]
};

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    onLocationChange,
    className = ''
}) => {
    const [selectedStart, setSelectedStart] = useState<Location>(predefinedLocations.startingPoints[0]);
    const [selectedArrival, setSelectedArrival] = useState<Location>(predefinedLocations.arrivalPoints[0]);
    const [isCustomStart, setIsCustomStart] = useState(false);
    const [isCustomArrival, setIsCustomArrival] = useState(false);
    const [customStartInput, setCustomStartInput] = useState('');
    const [customArrivalInput, setCustomArrivalInput] = useState('');

    const handleStartLocationChange = (location: Location) => {
        setSelectedStart(location);
        setIsCustomStart(false);
        onLocationChange(location, selectedArrival);
    };

    const handleArrivalLocationChange = (location: Location) => {
        setSelectedArrival(location);
        setIsCustomArrival(false);
        onLocationChange(selectedStart, location);
    };

    const handleCustomStartInput = (address: string) => {
        setCustomStartInput(address);
        if (address.trim()) {
            // For demo purposes, use approximate coordinates
            const customLocation: Location = {
                lat: 35.229 + (Math.random() - 0.5) * 0.01,
                lng: 126.843 + (Math.random() - 0.5) * 0.01,
                address: address,
                name: "Custom Location"
            };
            setSelectedStart(customLocation);
            onLocationChange(customLocation, selectedArrival);
        }
    };

    const handleCustomArrivalInput = (address: string) => {
        setCustomArrivalInput(address);
        if (address.trim()) {
            // For demo purposes, use approximate coordinates
            const customLocation: Location = {
                lat: 35.228 + (Math.random() - 0.5) * 0.01,
                lng: 126.839 + (Math.random() - 0.5) * 0.01,
                address: address,
                name: "Custom Destination"
            };
            setSelectedArrival(customLocation);
            onLocationChange(selectedStart, customLocation);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-xl font-bold text-gray-700 mb-6">Select Delivery Route</h3>

            {/* Starting Point Selection */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-600 mb-3 flex items-center">
                    <span className="text-green-500 mr-2">🟢</span>
                    Starting Point
                </h4>

                <div className="space-y-2 mb-3">
                    {predefinedLocations.startingPoints.map((location, index) => (
                        <button
                            key={index}
                            onClick={() => handleStartLocationChange(location)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedStart.lat === location.lat && selectedStart.lng === location.lng && !isCustomStart
                                ? 'border-secondary bg-blue-50 text-secondary'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold">{location.name}</div>
                            <div className="text-sm text-gray-600">{location.address}</div>
                            <div className="text-xs text-gray-400">
                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsCustomStart(!isCustomStart)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${isCustomStart
                            ? 'border-secondary bg-blue-50 text-secondary'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="font-semibold">Custom Starting Point</div>
                        <div className="text-sm text-gray-600">Enter your own address</div>
                    </button>

                    {isCustomStart && (
                        <div className="mt-2">
                            <input
                                type="text"
                                placeholder="Enter starting address..."
                                value={customStartInput}
                                onChange={(e) => setCustomStartInput(e.target.value)}
                                onBlur={() => handleCustomStartInput(customStartInput)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomStartInput(customStartInput)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Arrival Point Selection */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-600 mb-3 flex items-center">
                    <span className="text-red-500 mr-2">🔴</span>
                    Arrival Point
                </h4>

                <div className="space-y-2 mb-3">
                    {predefinedLocations.arrivalPoints.map((location, index) => (
                        <button
                            key={index}
                            onClick={() => handleArrivalLocationChange(location)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedArrival.lat === location.lat && selectedArrival.lng === location.lng && !isCustomArrival
                                ? 'border-secondary bg-blue-50 text-secondary'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold">{location.name}</div>
                            <div className="text-sm text-gray-600">{location.address}</div>
                            <div className="text-xs text-gray-400">
                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsCustomArrival(!isCustomArrival)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${isCustomArrival
                            ? 'border-secondary bg-blue-50 text-secondary'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="font-semibold">Custom Destination</div>
                        <div className="text-sm text-gray-600">Enter delivery address</div>
                    </button>

                    {isCustomArrival && (
                        <div className="mt-2">
                            <input
                                type="text"
                                placeholder="Enter delivery address..."
                                value={customArrivalInput}
                                onChange={(e) => setCustomArrivalInput(e.target.value)}
                                onBlur={() => handleCustomArrivalInput(customArrivalInput)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomArrivalInput(customArrivalInput)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Route Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-700 mb-2">Selected Route:</h5>
                <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">🟢</span>
                        <div>
                            <div className="font-medium">{selectedStart.name}</div>
                            <div className="text-gray-600">{selectedStart.address}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-gray-400">
                        <span>↓ Delivery Route ↓</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">🔴</span>
                        <div>
                            <div className="font-medium">{selectedArrival.name}</div>
                            <div className="text-gray-600">{selectedArrival.address}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        Distance: ~{(Math.sqrt(
                            Math.pow(selectedArrival.lat - selectedStart.lat, 2) +
                            Math.pow(selectedArrival.lng - selectedStart.lng, 2)
                        ) * 111).toFixed(1)} km
                    </div>
                </div>
            </div>
        </div>
    );
};