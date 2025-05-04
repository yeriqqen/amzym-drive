import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#fff8f0]">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Food & Goods Delivery</title>
      </Head>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
            WELCOME TO OUR WEBSITE
          </h1>
          <p className="text-2xl text-[#2c3e50] mb-6">Start your journey with us!</p>

          <div className="flex justify-center gap-4">
            <Link href="/register">
              <button className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 uppercase shadow-md">
                Create Account
              </button>
            </Link>
            <Link href="/login">
              <button className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 uppercase shadow-md">
                Login
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border-[3px] border-[#ff6600] shadow-md mb-8">
          <h3 className="text-2xl text-[#2c3e50] text-center mb-4">Explore Our Services</h3>
          <div className="text-center">
            <input
              className="w-full md:w-2/3 p-3 border-[3px] border-[#ff6600] rounded-lg bg-[#fff8f0] text-[#333] placeholder-[#901] mb-4 focus:border-[#ff3300] focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
              type="text"
              placeholder="Search for services"
            />
            <button className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 uppercase shadow-md">
              Search
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border-[3px] border-[#ff6600] shadow-md">
          <h5 className="text-2xl text-[#2c3e50] text-center">Why Choose Us?</h5>
          <h6 className="text-xl text-[#2c3e50] text-center mb-2">We offer the best services for students and professionals.</h6>
          <hr className="border-t-2 border-gray-300 mb-6" />

          <ul className="list-none text-xl md:text-2xl text-[#2c3e50] text-center space-y-3">
            <li>✔️ Easy Registration</li>
            <li>✔️ Reliable Service</li>
            <li>✔️ 24/7 Support</li>
            <li>✔️ Global Community</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;