import React from 'react';
import { DeliveryStep as DeliveryStepType } from '../../types/order';

interface DeliveryStepsProps {
    steps: DeliveryStepType[];
    className?: string;
}

export const DeliverySteps: React.FC<DeliveryStepsProps> = ({ steps, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-xl font-bold text-[#2c3e50] mb-6">Delivery Progress</h3>

            <div className="relative">
                {/* Progress line */}
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                <div
                    className="absolute left-8 top-8 w-0.5 bg-[#007bff] transition-all duration-500"
                    style={{
                        height: `${(steps.filter(step => step.status === 'completed').length / (steps.length - 1)) * 100}%`
                    }}
                ></div>

                {/* Steps */}
                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-4">
                            {/* Icon */}
                            <div className={`
                flex items-center justify-center w-16 h-16 rounded-full text-2xl relative z-10
                ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
                ${step.status === 'current' ? 'bg-[#007bff] text-white animate-pulse' : ''}
                ${step.status === 'upcoming' ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                                {step.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className={`
                  text-lg font-semibold
                  ${step.status === 'completed' ? 'text-green-600' : ''}
                  ${step.status === 'current' ? 'text-[#007bff]' : ''}
                  ${step.status === 'upcoming' ? 'text-gray-500' : ''}
                `}>
                                    {step.name}
                                </div>

                                {step.timestamp && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        {new Date(step.timestamp).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </div>
                                )}

                                {step.status === 'current' && (
                                    <div className="text-sm text-[#007bff] mt-1 font-medium">
                                        In Progress...
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
