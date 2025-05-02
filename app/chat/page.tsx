import Link from 'next/link';

export default function ChatPage() {
    return (
        <main className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">Chat</h1>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Back to Home
                    </Link>
                </div>
                <div className="border rounded-lg p-4 h-[600px] bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Chat component will be added here</p>
                </div>
            </div>
        </main>
    );
} 