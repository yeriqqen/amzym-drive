import React from 'react';

interface ManagerInfo {
    name: string;
    phone: string;
    department: string;
    role: string;
}

interface ManagerInfoProps {
    managerInfo: ManagerInfo;
    className?: string;
}

export const ManagerInfo: React.FC<ManagerInfoProps> = ({ managerInfo, className = '' }) => {
    if (!managerInfo) return null;

    const handleCallManager = () => {
        window.open(`tel:${managerInfo.phone}`, '_self');
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-xl font-bold text-gray-700 mb-4">Order Manager</h3>

            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {managerInfo.name.split(' ')[0][0]}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-700 text-lg">{managerInfo.name}</h4>
                    <p className="text-gray-600">{managerInfo.role}</p>
                    <p className="text-gray-500 text-sm">{managerInfo.department}</p>
                </div>
            </div>

            <button
                onClick={handleCallManager}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
                <span className="text-xl">📞</span>
                <span>Call Manager</span>
            </button>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">👨‍💼</span>
                    <div className="text-sm text-gray-600">
                        Manager is overseeing your order delivery
                    </div>
                </div>
            </div>
        </div>
    );
};
