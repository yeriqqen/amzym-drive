import React from 'react';
import { DeliveryTracking } from '../../types/order';

interface DriverInfoProps {
    driverInfo: DeliveryTracking['driverInfo'];
    className?: string;
}

export const DriverInfo: React.FC<DriverInfoProps> = ({ driverInfo, className = '' }) => {
    if (!driverInfo) return null;

    const handleCallDriver = () => {
        window.open(`tel:${driverInfo.phone}`, '_self');
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-xl font-bold text-[#2c3e50] mb-4">Your Driver</h3>

            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-[#007bff] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {driverInfo.name.split(' ')[0][0]}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-[#2c3e50] text-lg">{driverInfo.name}</h4>
                    <p className="text-gray-600">{driverInfo.vehicle}</p>
                </div>
            </div>

            <button
                onClick={handleCallDriver}
                className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
                <span className="text-xl">📞</span>
                <span>Call Driver</span>
            </button>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">🚚</span>
                    <div className="text-sm text-gray-600">
                        Driver is on the way to your location
                    </div>
                </div>
            </div>
        </div>
    );
};
