import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Delivery Status',
    description: 'Track your delivery status',
};

export default function StatusLayout({
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