'use client';
import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Register: NextPage = () => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        faculty: '',
        phoneNumber: '',
        zipCode: '',
        address: '',
        city: '',
        country: '',
        differentAddress: false,
        name: '',
        university: '',
        major: '',
        graduationDate: '2021',
        userType: '',
        taxId: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff8f0] py-10">
            <Head>
                <title>Create Account</title>
                <meta name="description" content="Register for our services" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="max-w-4xl mx-auto">
                {step === 1 && (
                    <div className="bg-white p-8 rounded-lg border-[3px] border-[#ff6600] shadow-md mb-8 text-center">
                        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                            CREATE YOUR ACCOUNT
                        </h1>
                        <p className="text-2xl text-[#2c3e50] mb-6">1st Step<br />Email</p>

                        <form onSubmit={handleNext} className="max-w-md mx-auto">
                            <input
                                className="w-full p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] mb-4 focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="w-full p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] mb-4 focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="w-full p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] mb-6 focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="submit"
                                className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 uppercase shadow-md"
                            >
                                NEXT
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white p-8 rounded-lg border-[3px] border-[#ff6600] shadow-md mb-8">
                        <h3 className="text-2xl text-[#2c3e50] text-center mb-6">2nd Step<br />Address</h3>

                        <form onSubmit={handleNext} className="max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="firstName"
                                    placeholder="Firstname"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="lastName"
                                    placeholder="Lastname"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="faculty"
                                    placeholder="Faculty"
                                    value={formData.faculty}
                                    onChange={handleChange}
                                />
                                <input
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="zipCode"
                                    placeholder="Zip code"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                                <select
                                    className="p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600] appearance-none bg-no-repeat bg-right-8 bg-contain"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")" }}
                                >
                                    <option value="">Select a country</option>
                                    <option value="1">Germany</option>
                                    <option value="2">Russia</option>
                                    <option value="3">Kazakhstan</option>
                                    <option value="4">USA</option>
                                    <option value="5">China</option>
                                    <option value="6">United Kingdom</option>
                                    <option value="7">France</option>
                                    <option value="8">Italy</option>
                                    <option value="9">India</option>
                                    <option value="10">Japan</option>
                                    <option value="11">Canada</option>
                                    <option value="12">Australia</option>
                                    <option value="13">Brazil</option>
                                    <option value="14">South Africa</option>
                                    <option value="15">Netherlands</option>
                                    <option value="16">Morocco</option>
                                    <option value="17">Pakistan</option>
                                    <option value="18">Spain</option>
                                    <option value="19">Egypt</option>
                                    <option value="20">Nigeria</option>
                                    <option value="21">Turkey</option>
                                    <option value="22">Mexico</option>
                                    <option value="23">Indonesia</option>
                                    <option value="24">South Korea</option>
                                </select>
                            </div>

                            <div className="flex items-center mb-6">
                                <input
                                    type="checkbox"
                                    id="differentAddress"
                                    name="differentAddress"
                                    className="w-6 h-6 mr-3"
                                    checked={formData.differentAddress}
                                    onChange={handleChange}
                                />
                                <label htmlFor="differentAddress" className="text-xl text-[#2c3e50]">
                                    Ship to a different address
                                </label>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 uppercase shadow-md"
                                >
                                    NEXT
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white p-8 rounded-lg border-[3px] border-[#ff6600] shadow-md">
                        <h5 className="text-2xl text-[#2c3e50] text-center">Please, enter your personal information.</h5>
                        <h6 className="text-xl text-[#2c3e50] text-center mb-2">You will receive priority for these subjects.</h6>
                        <hr className="border-t-2 border-gray-300 mb-6" />

                        <form className="max-w-2xl mx-auto">
                            <div className="mb-4 grid grid-cols-4">
                                <label htmlFor="name" className="col-span-1 text-lg text-[#2c3e50] font-bold flex items-center">Name</label>
                                <input
                                    id="name"
                                    className="col-span-3 p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="name"
                                    placeholder="Flip Justic"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4 grid grid-cols-4">
                                <label htmlFor="email" className="col-span-1 text-lg text-[#2c3e50] font-bold flex items-center">Email</label>
                                <input
                                    id="email"
                                    className="col-span-3 p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="email"
                                    name="email"
                                    placeholder="Flip.justic@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4 grid grid-cols-4">
                                <label className="col-span-1 text-lg text-[#2c3e50] font-bold flex items-center">What are you?</label>
                                <div className="col-span-3 flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="student"
                                            name="userType"
                                            value="student"
                                            className="w-5 h-5 mr-2"
                                            checked={formData.userType === 'student'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="student" className="text-[#2c3e50]">University student</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="professional"
                                            name="userType"
                                            value="professional"
                                            className="w-5 h-5 mr-2"
                                            checked={formData.userType === 'professional'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="professional" className="text-[#2c3e50]">Professional</label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-4">
                                <label htmlFor="university" className="col-span-1 text-lg text-[#2c3e50] font-bold flex items-center">University</label>
                                <input
                                    id="university"
                                    className="col-span-3 p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="university"
                                    placeholder="Which university?"
                                    value={formData.university}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4 grid grid-cols-4">
                                <label htmlFor="major" className="col-span-1 text-lg text-[#2c3e50] font-bold flex items-center">Major</label>
                                <input
                                    id="major"
                                    className="col-span-3 p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                                    type="text"
                                    name="major"
                                    value={formData.major}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4 grid grid-cols-4">
                                <label htmlFor="graduationDate" className="col-span-1 text-lg text-[#2c3e50] font-bold flex items-center">Graduation Date:</label>
                                <select
                                    id="graduationDate"
                                    className="col-span-3 p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600] appearance-none bg-no-repeat bg-right-8 bg-contain"
                                    name="graduationDate"
                                    value={formData.graduationDate}
                                    onChange={handleChange}
                                    style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")" }}
                                >
                                    <option value="2015">2015</option>
                                    <option value="2016">2016</option>
                                    <option value="2017">2017</option>
                                    <option value="2018">2018</option>
                                    <option value="2019">2019</option>
                                    <option value="2020">2020</option>
                                    <option value="2021">2021</option>
                                </select>
                            </div>

                            <div className="mb-6 grid grid-cols-4">
                                <label className="col-span-1 text-lg text-[#2c3e50] font-bold flex items-center">Do you have a Tax ID?</label>
                                <div className="col-span-3 flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="hasTaxId"
                                            name="taxId"
                                            value="has"
                                            className="w-5 h-5 mr-2"
                                            checked={formData.taxId === 'has'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="hasTaxId" className="text-[#2c3e50]">I have a US Tax ID (SSN)</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="noTaxId"
                                            name="taxId"
                                            value="no"
                                            className="w-5 h-5 mr-2"
                                            checked={formData.taxId === 'no'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="noTaxId" className="text-[#2c3e50]">I don't have a US Tax ID (SSN)</label>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <Link href="/items">
                                    <button
                                        type="button"
                                        className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 uppercase shadow-md"
                                    >
                                        COMPLETE REGISTRATION
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;