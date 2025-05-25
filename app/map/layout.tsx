import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Select Delivery Location',
    description: 'Choose your delivery location',
};

export default function MapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}