'use client';
import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Login: NextPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, you would handle authentication here
        // For now, let's just redirect to the items page
        window.location.href = '/items';
    };

    return (
        <div className="min-h-screen bg-[#fff8f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>Login</title>
                <meta name="description" content="Login to your account" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="max-w-md w-full bg-white p-8 rounded-lg border-[3px] border-[#ff6600] shadow-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                        LOGIN
                    </h1>
                    <p className="text-xl text-[#2c3e50]">Welcome back! Please sign in to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-lg text-[#2c3e50] font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-lg text-[#2c3e50] font-medium mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                            placeholder="Your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="rememberMe"
                                type="checkbox"
                                className="h-5 w-5 border-[#ff6600] rounded"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-[#2c3e50]">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="text-[#007bff] hover:text-[#0056b3]">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 uppercase shadow-md"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[#2c3e50]">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-[#007bff] hover:text-[#0056b3] font-medium">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;