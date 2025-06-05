'use client';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageLayout } from '@/components/ui/PageLayout';
import { formatPrice } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const popularItems = [
  {
    name: 'Premium Sushi Set',
    price: 32000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
  },
  {
    name: 'Margherita Pizza',
    price: 16500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
  },
  {
    name: 'Gourmet Burger',
    price: 13000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  },
  {
    name: 'Premium Snack Box',
    price: 20500,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
  },
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/items');
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (user) return null;

  return (
    <PageLayout className="bg-gradient-to-b from-[#fff8f0] to-white">
      {/* Hero Section */}
      <div className="pb-16 px-4 sm:pb-24">
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
              Your trusted partner for quick, safe, and efficient delivery of food
              and goods.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/map">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Track Delivery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items Preview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2c3e50] text-center mb-8">
            Popular Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularItems.map((item) => (
              <Card key={item.name} className="text-center p-6" hover>
                <div className="relative h-48 mb-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                  {item.name}
                </h3>
                <p className="text-[#ff6600] font-bold mb-2">
                  {formatPrice(item.price)}
                </p>
                <div className="flex justify-center text-yellow-500 mb-4">
                  {'⭐'.repeat(Math.floor(item.rating))}
                  <span className="ml-1 text-gray-600">
                    ({item.rating})
                  </span>
                </div>
                <Link href="/items" className="block">
                  <Button className="w-full">Order Now</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-[#fff8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8" hover>
              <Image
                src="/globe.svg"
                alt="Global Coverage"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                Global Coverage
              </h3>
              <p className="text-gray-600">
                Delivering to multiple locations worldwide with tracking
                capabilities.
              </p>
            </Card>

            <Card className="text-center p-8" hover>
              <Image
                src="/window.svg"
                alt="Real-time Tracking"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                Real-time Tracking
              </h3>
              <p className="text-gray-600">
                Track your deliveries in real-time with our advanced system.
              </p>
            </Card>

            <Card className="text-center p-8" hover>
              <Image
                src="/file.svg"
                alt="Secure Delivery"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                Secure Delivery
              </h3>
              <p className="text-gray-600">
                Your items are handled with care and delivered safely.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Card className="p-8">
            <h3 className="text-2xl font-semibold text-[#2c3e50] text-center mb-6">
              Why Choose Us?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-[#ff6600] text-2xl">✔️</span>
                <div>
                  <h4 className="font-semibold text-[#2c3e50]">
                    Fast Delivery
                  </h4>
                  <p className="text-gray-600">
                    Starting from {formatPrice(3000)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#ff6600] text-2xl">✔️</span>
                <div>
                  <h4 className="font-semibold text-[#2c3e50]">
                    24/7 Support
                  </h4>
                  <p className="text-gray-600">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#ff6600] text-2xl">✔️</span>
                <div>
                  <h4 className="font-semibold text-[#2c3e50]">
                    Secure Payments
                  </h4>
                  <p className="text-gray-600">100% secure transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#ff6600] text-2xl">✔️</span>
                <div>
                  <h4 className="font-semibold text-[#2c3e50]">
                    Live Tracking
                  </h4>
                  <p className="text-gray-600">Real-time order tracking</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}