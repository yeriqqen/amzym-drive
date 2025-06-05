'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
}

export default function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        router.push('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#ff6600]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#ff6600] to-[#ff3300] bg-clip-text text-transparent">
                            AmzymDrive
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/items"
                            className="text-gray-600 hover:text-[#ff6600] transition-colors"
                        >
                            Items
                        </Link>
                        <Link
                            href="/map"
                            className="text-gray-600 hover:text-[#ff6600] transition-colors"
                        >
                            Map
                        </Link>
                        {user && (
                            <>
                                <Link
                                    href="/chat"
                                    className="text-gray-600 hover:text-[#ff6600] transition-colors"
                                >
                                    Chat
                                </Link>
                                <Link
                                    href="/status"
                                    className="text-gray-600 hover:text-[#ff6600] transition-colors"
                                >
                                    Status
                                </Link>
                            </>
                        )}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600">
                                    {user.name}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login">
                                    <Button variant="outline" size="sm">Sign In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden p-2 border-none hover:bg-[#ff6600]/5"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-6 w-6 text-gray-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <div
                    id="mobile-menu"
                    className={`md:hidden transition-all duration-200 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                    <nav className="py-4 space-y-2">
                        <Link
                            href="/items"
                            className="block px-4 py-2 text-gray-600 hover:text-[#ff6600] transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Items
                        </Link>
                        <Link
                            href="/map"
                            className="block px-4 py-2 text-gray-600 hover:text-[#ff6600] transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Map
                        </Link>
                        {user && (
                            <>
                                <Link
                                    href="/chat"
                                    className="block px-4 py-2 text-gray-600 hover:text-[#ff6600] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Chat
                                </Link>
                                <Link
                                    href="/status"
                                    className="block px-4 py-2 text-gray-600 hover:text-[#ff6600] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Status
                                </Link>
                            </>
                        )}
                        {user ? (
                            <div className="px-4 py-2 space-y-2">
                                <div className="text-gray-600">
                                    {user.name}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="w-full"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="px-4 py-2 space-y-2">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block"
                                >
                                    <Button
                                        size="sm"
                                        className="w-full"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}