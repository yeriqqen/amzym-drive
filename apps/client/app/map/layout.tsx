// Remove 'use client' directive since layout components are server components by default

export default function MapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="flex-1">
                {children}
            </main>
        </>
    );
}