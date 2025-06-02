import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add your initial items here
  const items = [
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
      price: 12000,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Pepperoni, mozzarella, and tomato sauce.',
      price: 14000,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    },
    {
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing.',
      price: 9000,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0',
    },
    {
      name: 'Bottled Water',
      description: '500ml mineral water.',
      price: 2000,
      category: 'goods',
      image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc',
    },
    {
      name: 'Coke',
      description: 'Classic Coca-Cola 355ml can.',
      price: 2500,
      category: 'goods',
      image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad04',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: 0 }, // always fails, so always creates
      update: {},
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
