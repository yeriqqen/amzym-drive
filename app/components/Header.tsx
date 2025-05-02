import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-4xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        AmzymDrive
                    </Link>
                    <div className="flex gap-6">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/map"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Map
                        </Link>
                        <Link
                            href="/chat"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Chat
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
} 