import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add items that match the frontend mock data
  const items = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomatoes, and basil on our signature crust',
      price: 16500,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
    },
    {
      id: 2,
      name: 'Gourmet Burger',
      description: 'Angus beef patty with premium toppings',
      price: 13000,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    },
    {
      id: 3,
      name: 'Premium Sushi Set',
      description: 'Assorted fresh sushi rolls (12 pieces)',
      price: 32000,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
    },
    {
      id: 4,
      name: 'Fresh Garden Salad',
      description: 'Mixed greens with seasonal vegetables',
      price: 11500,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    },
    {
      id: 5,
      name: 'Spring Water (6-pack)',
      description: 'Natural spring water in recyclable bottles',
      price: 6500,
      category: 'goods',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
    },
    {
      id: 6,
      name: 'Premium Snack Box',
      description: 'Assorted premium snacks and treats',
      price: 20500,
      category: 'goods',
      image: 'https://images.unsplash.com/photo-1582169296194-d4d644c48081?w=800&q=80',
    },
    {
      id: 7,
      name: 'Essential Toiletries Kit',
      description: 'Basic travel-sized toiletries pack',
      price: 25500,
      category: 'goods',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80',
    },
    {
      id: 8,
      name: 'Home Office Bundle',
      description: 'Essential stationery for your home office',
      price: 38500,
      category: 'goods',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log('Seeded items!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
