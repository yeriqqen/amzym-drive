'use client';

import { useState } from 'react';
import Link from 'next/link';

type DeliveryStep = 'order-received' | 'preparing' | 'out-for-delivery' | 'delivered';

export default function DeliveryStatus() {
    const [currentStep, setCurrentStep] = useState<DeliveryStep>('preparing');
    const [isCompleted, setIsCompleted] = useState(false);

    // Map of delivery steps
    const steps: DeliveryStep[] = ['order-received', 'preparing', 'out-for-delivery', 'delivered'];

    // Step display names
    const stepNames = {
        'order-received': 'Order Received',
        'preparing': 'Preparing Order',
        'out-for-delivery': 'Out for Delivery',
        'delivered': 'Delivered'
    };

    // Current step index
    const currentIndex = steps.indexOf(currentStep);

    const moveStatusForward = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex]);
        } else {
            // Show confirmation screen
            setIsCompleted(true);
        }
    };

    // Function to determine step CSS classes
    const getStepClasses = (stepIndex: number) => {
        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "";
    };

    // Confirmation screen after delivery is completed
    if (isCompleted) {
        return (
            <div className="min-h-screen bg-[#fff8f0] flex flex-col items-center justify-center">
                <div className="text-center max-w-2xl px-4">
                    <div className="text-7xl mb-8">🎉🍔🍕</div>
                    <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                        Delivery Confirmed!
                    </h1>
                    <p className="text-2xl text-[#2c3e50] mb-12">
                        Thank you for ordering with us.<br />
                        Enjoy your food and have a great day!
                    </p>
                    <Link href="/">
                        <button className="px-8 py-4 bg-[#007bff] hover:bg-[#0056b3] text-white text-2xl font-bold rounded-lg transform transition-transform hover:scale-105 shadow-md">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // Delivery status tracking screen
    return (
        <div className="min-h-screen bg-[#fff8f0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                        Track Your Delivery
                    </h1>
                    <p className="text-xl text-[#2c3e50] mt-2">
                        Stay updated on your order status!
                    </p>
                </div>

                <div className="max-w-3xl mx-auto bg-[#fff8f0] border-4 border-[#ff6600] rounded-lg p-8 shadow-md relative mb-12">
                    {/* Status line */}
                    <div className="absolute top-1/2 left-[10%] w-[80%] h-1 bg-gray-300"></div>

                    {/* Status steps */}
                    <div className="flex justify-around relative z-10">
                        {steps.map((step, index) => (
                            <div key={step} className={`w-1/4 text-center ${getStepClasses(index)}`}>
                                <div className={`w-5 h-5 mx-auto rounded-full
                  ${index <= currentIndex ? 'bg-[#007bff]' : 'bg-gray-300'}
                  ${index < currentIndex ? 'bg-green-500' : ''}
                `}></div>
                                <span className={`block mt-2 text-lg
                  ${index === currentIndex ? 'text-[#007bff] font-bold' : 'text-[#2c3e50]'}
                  ${index < currentIndex ? 'text-green-500 line-through' : ''}
                `}>
                                    {stepNames[step]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={moveStatusForward}
                        className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white text-xl font-bold rounded-lg transform transition-transform hover:scale-105 shadow-md"
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
}