import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f0] to-white">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6600] to-[#ff3300]">
                Fast & Reliable
              </span>
              <br />
              <span className="text-[#2c3e50]">Delivery Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for quick, safe, and efficient delivery of food and goods.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Track Delivery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8" hover>
              <Image src="/globe.svg" alt="Global Coverage" width={64} height={64} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">Global Coverage</h3>
              <p className="text-gray-600">Delivering to multiple locations worldwide with tracking capabilities.</p>
            </Card>

            <Card className="text-center p-8" hover>
              <Image src="/window.svg" alt="Real-time Tracking" width={64} height={64} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your deliveries in real-time with our advanced system.</p>
            </Card>

            <Card className="text-center p-8" hover>
              <Image src="/file.svg" alt="Secure Delivery" width={64} height={64} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">Secure Delivery</h3>
              <p className="text-gray-600">Your items are handled with care and delivered safely.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-[#fff8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mb-8">
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-[#2c3e50] text-center mb-6">Explore Our Services</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Input
                  type="text"
                  placeholder="Search for services"
                  className="w-full md:w-2/3"
                />
                <Button>
                  Search
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-[#2c3e50] text-center">Why Choose Us?</h3>
              <p className="text-xl text-[#2c3e50] text-center mb-6">
                We offer the best services for students and professionals.
              </p>
              <hr className="border-t-2 border-[#ff6600]/10 mb-6" />

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-[#2c3e50]">
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6600]">✔️</span>
                  Easy Registration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6600]">✔️</span>
                  Reliable Service
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6600]">✔️</span>
                  24/7 Support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff6600]">✔️</span>
                  Global Community
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}