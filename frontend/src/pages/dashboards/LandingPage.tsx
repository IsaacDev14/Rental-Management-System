import React, { useState } from 'react';

// Define the types for Property and Category
interface Property {
  id: number;
  name: string;
  location: string;
  price: string;
  imageUrls: string[];
  description: string;
  rating: number;
  reviews: number;
  isGuestFavorite: boolean;
}

interface Category {
  name: string;
  icon: string;
}

const LandingPage: React.FC = () => {
  // Dummy data for Kenyan properties with multiple image URLs for carousel
  const properties: Property[] = [
    {
      id: 1,
      name: "Charming Apartment",
      location: "Nairobi, Kilimani",
      price: "KSh 7,500 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1617409242550-9f5b5f2f5f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMkNuYWlyb2JpJTJDbW9kZXJufGVufDB8fHx8MTcwMTk1NzU0Nnww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now()}`,
        `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMkNpbnRlcmlvciUyQ25haXJvYml8ZW58MHx8fHwxNzAxOTU3NTQ3fDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 1}`,
        `https://images.unsplash.com/photo-1556912167-f705199a0a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMkNraXRjaGVuJTJDbW9kZXJufGVufDB8fHx8MTcwMTk1NzU0OHww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 2}`
      ],
      description: "Modern and cozy apartment in the heart of Kilimani, perfect for business or leisure.",
      rating: 4.8,
      reviews: 120,
      isGuestFavorite: true
    },
    {
      id: 2,
      name: "Beachfront Villa",
      location: "Diani Beach, Kwale",
      price: "KSh 25,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1596436889106-be35e1f0e799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxiZWFjaCUyQ2RpYW5pJTJCdmlsbGF8ZW58MHx8fHwxNzAxOTU3NjA5fDB&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 3}`,
        `https://images.unsplash.com/photo-1570539139266-9d3b3c3e3c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxiZWFjaCUyQ3Bvb2wlMkNkaWFuaXxlbnwwfHx8fDE3MDE5NTc2MTB8MA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 4}`,
        `https://images.unsplash.com/photo-1507525428034-b723cf961c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxiZWFjaCUyQ29jZWFuJTJCc2VhfGVufDB8fHx8MTcwMTk1NzYxMXww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 5}`
      ],
      description: "Luxurious villa with direct beach access, private pool, and stunning ocean views.",
      rating: 4.9,
      reviews: 85,
      isGuestFavorite: false
    },
    {
      id: 3,
      name: "Serene Cottage",
      location: "Naivasha, Nakuru",
      price: "KSh 12,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1620959067527-3b2e3e3b2e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxjZXR0YWdlJTJDbWFpdmFzaGElMkNuYXR1cmV8ZW58MHx8fHwxNzAxOTU3NjYyfDB&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 6}`,
        `https://images.unsplash.com/photo-1506748687-bb4799e6f140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxjZXR0YWdlJTJCcml2ZXIlMkNuYXR1cmV8ZW58MHx8fHwxNzAxOTU3NjYzfDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 7}`,
        `https://images.unsplash.com/photo-1546484393-2c1a1b1b1c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxjZXR0YWdlJTJCd29vZCUyQ2ZvcmVzdHxlbnwwfHx8fDE3MDE5NTc2NjR8MA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 8}`
      ],
      description: "Escape to this peaceful cottage near Lake Naivasha. Enjoy nature and tranquility.",
      rating: 4.7,
      reviews: 95,
      isGuestFavorite: true
    },
    {
      id: 4,
      name: "Urban Loft",
      location: "Nairobi, Westlands",
      price: "KSh 8,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1595152772835-219672d50e2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxvcmJhbiUyQ2xvZnQlMkNuYWlyb2JpJTJCc2t5bGluZXxlbnwwfHx8fDE3MDE5NTc3MTF8MA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 9}`,
        `https://images.unsplash.com/photo-1522708323590-d24dbb6b0b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMkNpbnRlcmlvciUyQ25haXJvYml8ZW58MHx8fHwxNzAxOTU3NzEyfDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 10}`,
        `https://images.unsplash.com/photo-1540518614372-c557022639a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMkNtb2Rlcm58ZW58MHx8fHwxNzAxOTU3NzEzfDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 11}`
      ],
      description: "Stylish loft apartment in a vibrant neighborhood, close to nightlife and corporate offices.",
      rating: 4.6,
      reviews: 150,
      isGuestFavorite: false
    },
    {
      id: 5,
      name: "Safari Tent",
      location: "Maasai Mara, Narok",
      price: "KSh 35,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1620959067527-3b2e3e3b2e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxzYWZhcmklMkN0ZW50JTJCd2lsZGxpZmV8ZW58MHx8fHwxNzAxOTU3Nzc0fDB&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 12}`,
        `https://images.unsplash.com/photo-1546484393-2c1a1b1b1c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxzYWZhcmklMkNtYWFzYWklMkNtYXJhfGVufDB8fHx8MTcwMTk1Nzc3NXww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 13}`,
        `https://images.unsplash.com/photo-1507525428034-b723cf961c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxzYWZhcmklMkNzdW5zZXQlMkNtYXJhfGVufDB8fHx8MTcwMTk1Nzc3Nnww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 14}`
      ],
      description: "Experience the wild in comfort with this luxury safari tent. Game drives await.",
      rating: 5.0,
      reviews: 60,
      isGuestFavorite: true
    },
    {
      id: 6,
      name: "Cozy Studio",
      location: "Nairobi, Lavington",
      price: "KSh 6,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1505693416388-ac51e443a8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMkNsYXZpbmd0b24lMkNjb3p5fGVufDB8fHx8MTcwMTk1NzgyOHww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 15}`,
        `https://images.unsplash.com/photo-1522708323590-d24dbb6b0b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMkNpbnRlcmlvciUyQ25haXJvYml8ZW58MHx8fHwxNzAxOTU3ODI5fDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 16}`,
        `https://images.unsplash.com/photo-1540518614372-c557022639a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMkNtb2Rlcm58ZW58MHx8fHwxNzAxOTU3ODMwfDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 17}`
      ],
      description: "Compact and comfortable studio, perfect for solo travelers or couples.",
      rating: 4.5,
      reviews: 70,
      isGuestFavorite: false
    },
    {
      id: 7,
      name: "Mountain View Cabin",
      location: "Nanyuki, Laikipia",
      price: "KSh 15,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1506748687-bb4799e6f140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxjYWJpbiUyQ25hbnl1a2klMkNtb3VudGFpbnxlbnwwfHx8fDE3MDE5NTc4Njh8MA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 18}`,
        `https://images.unsplash.com/photo-1546484393-2c1a1b1b1c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxjYWJpbiUyQ2ZvcmVzdCUyQ25hbnl1a2l8ZW58MHx8fHwxNzAxOTU3ODY5fDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 19}`,
        `https://images.unsplash.com/photo-1507525428034-b723cf961c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxjYWJpbiUyQ2xha2UlMkNuYW55dGtpfGVufDB8fHx8MTcwMTk1Nzg3MHww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 20}`
      ],
      description: "Rustic cabin with breathtaking views of Mount Kenya. Ideal for hiking.",
      rating: 4.9,
      reviews: 45,
      isGuestFavorite: true
    },
    {
      id: 8,
      name: "Lakeside Retreat",
      location: "Kisumu, Kisumu County",
      price: "KSh 9,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1555949987-92e1b1b1b1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxsYWtlJTJCa2lzdW11JTJCdHJldHJlYXR8ZW58MHx8fHwxNzAxOTU3OTIwfDA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 21}`,
        `https://images.unsplash.com/photo-1507525428034-b723cf961c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxsYWtlJTJCc3Vuc2V0JTJCa2lzdW11fGVufDB8fHx8MTcwMTk1NzkyMXww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 22}`,
        `https://images.unsplash.com/photo-1546484393-2c1a1b1b1c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxsYWtlJTJCdmlldyUyQ2tpc3VtdXxlbnwwfHx8fDE3MDk1NzkyMnww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 23}`
      ],
      description: "Tranquil retreat by Lake Victoria. Enjoy stunning sunsets and fresh fish.",
      rating: 4.7,
      reviews: 110,
      isGuestFavorite: false
    },
    {
      id: 9,
      name: "Modern Townhouse",
      location: "Nairobi, Karen",
      price: "KSh 18,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1582268710609-b1d1b1d1b1d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHx0b3duaG91c2UlMkNrYXJlbiUyQ2x1eHVyeXxlbnwwfHx8fDE3MDE5NTc5NjV8MA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 24}`,
        `https://images.unsplash.com/photo-1506748687-bb4799e6f140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMkNpbnRlcmlvciUyQ2thcmVufGVufDB8fHx8MTcwMTk1Nzk2Nnww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 25}`,
        `https://images.unsplash.com/photo-1546484393-2c1a1b1b1c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMkNnYXJkZW4lMkNrYXJlbnxlbnwwfHx8fDE3MDE5NTc5Njd8MA&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 26}`
      ],
      description: "Spacious and elegant townhouse in the leafy suburbs of Karen. Perfect for families.",
      rating: 4.8,
      reviews: 90,
      isGuestFavorite: true
    },
    {
      id: 10,
      name: "Coastal Bungalow",
      location: "Watamu, Kilifi",
      price: "KSh 20,000 / night",
      imageUrls: [
        `https://images.unsplash.com/photo-1563299797-e0d4d4e0d4d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxiYW5nYWxvdyUyQ3dhdGFtdSUyQ2NvYXN0fGVufDB8fHx8MTcwMTk1ODAxMHww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 27}`,
        `https://images.unsplash.com/photo-1507525428034-b723cf961c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxiZWFjaCUyQ3dhdGFtdSUyQ29jZWFuJTJCc2VhfGVufDB8fHx8MTcwMTk1ODAxMXww&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 28}`,
        `https://images.unsplash.com/photo-1546484393-2c1a1b1b1c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI3NjF8MHwxfHNlYXJjaHwxfHxiYW5nYWxvdyUyQ3Bvb2wlMkN3YXRhbXUuLi4&ixlib=rb-4.0.3&q=80&w=400&t=${Date.now() + 29}`
      ],
      description: "Charming bungalow a short walk from Watamu's pristine beaches. Dive into ocean life.",
      rating: 4.9,
      reviews: 75,
      isGuestFavorite: false
    }
  ];

  // Dummy data for categories (inspired by Airbnb's category scrollbar)
  const categories: Category[] = [
    { name: "Amazing views", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>` },
    { name: "Beachfront", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` },
    { name: "Cabins", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>` },
    { name: "Treehouses", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 2m0 0l-2-2m2 2V3m2 17a2 2 0 11-4 0 2 2 0 014 0zM7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-2.414-2.414A1 1 0 0015.586 6H7a2 2 0 00-2 2v11a2 2 0 002 2z"></path></svg>` },
    { name: "Glamping", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>` },
    { name: "Tiny homes", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>` },
    { name: "Unique stays", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7m0 0L9 7"></path></svg>` },
    { name: "Castles", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>` },
    { name: "Lakeside", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` },
    { name: "Farms", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586L4 13.586V10a2 2 0 012-2h11z"></path></svg>` },
    { name: "Desert", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M3 12H2M18.364 5.636l-.707-.707M6.343 17.657l-.707.707M16.95 18.364l.707-.707M7.05 5.636l-.707.707M12 12a5 5 0 110-10 5 5 0 010 10z"></path></svg>` },
    { name: "Ski-in/out", icon: `<svg class="h-6 w-6 text-gray-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 2m0 0l-2-2m2 2V3m2 17a2 2 0 11-4 0 2 2 0 014 0zM7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-2.414-2.414A1 1 0 0015.586 6H7a2 2 0 00-2 2v11a2 2 0 002 2z"></path></svg>` }
  ];

  // Component for a single property card with custom carousel logic
  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToNextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.imageUrls.length);
    };

    const goToPrevImage = () => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + property.imageUrls.length) % property.imageUrls.length
      );
    };

    return (
      <div className="group bg-white rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
        <div className="property-image-container relative">
          {/* Image */}
          <img
            src={property.imageUrls[currentImageIndex]}
            alt={`${property.name} ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Unavailable';
            }}
          />

          {/* Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
            className="absolute top-1/2 left-2 -translate-y-1/2 p-1 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
            {property.imageUrls.map((_, dotIndex) => (
              <div
                key={dotIndex}
                className={`w-1.5 h-1.5 rounded-full ${
                  dotIndex === currentImageIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-70'
                } cursor-pointer`}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(dotIndex); }}
              ></div>
            ))}
          </div>

          {/* Like/Heart Icon */}
          <button className="absolute top-2 right-2 z-10 p-1 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all duration-200">
            <svg className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
          </button>
          {property.isGuestFavorite && (
            <span className="absolute top-2 left-2 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10">
              Guest favorite
            </span>
          )}
        </div>
        <div className="p-3 pt-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{property.location}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.83-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
              <span className="text-xs">{property.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{property.name}</p>
          <p className="text-gray-500 text-xs mb-2">{property.description}</p>
          <p className="font-bold text-gray-900 text-sm">{property.price}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 rounded-b-lg">
        {/* Logo */}
        <div className="flex items-center">
          <svg className="h-9 w-9 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm3 0a1 1 0 112 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
          </svg>
          <span className="text-2xl font-bold text-gray-800">KenyaRentals</span>
        </div>

        {/* Search Bar (Desktop) - More Airbnb-like */}
        <div className="hidden md:flex airbnb-search-bar">
          <div className="search-item">Anywhere</div>
          <div className="divider"></div>
          <div className="search-item">Any week</div>
          <div className="divider"></div>
          <div className="flex items-center">
            <span className="search-item placeholder">Add guests</span>
            <button>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <button className="hidden md:block py-2 px-4 rounded-full text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors duration-300">
            Become a Host
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2v2.945M15 3.935V5.5A2.5 2.5 0 0117.5 8h.5A2 2 0 0120 10v2.945M8 19.065V17.5a2.5 2.5 0 00-2.5-2.5h-.5a2 2 0 01-2-2 2 2 0 00-2-2V7.055M15 19.065V17.5a2.5 2.5 0 012.5-2.5h.5a2 2 0 002-2 2 2 0 012-2V7.055" /></svg>
          </button>
          <div className="flex items-center border border-gray-300 rounded-full p-1 space-x-2 hover:shadow-md transition-all duration-300 cursor-pointer">
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-300">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar (visible on small screens) */}
      <div className="md:hidden px-6 py-4">
        <div className="flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm">
          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="Where are you going?" className="outline-none text-sm text-gray-700 flex-grow" />
        </div>
      </div>

      {/* Category Scrollbar */}
      <section className="px-6 md:px-12 py-4 bg-white shadow-sm overflow-x-auto category-scrollbar">
        <div id="category-list" className="flex space-x-8 justify-center md:justify-start">
          {categories.map((category, index) => (
            <div key={index} className={`category-card ${index === 0 ? 'active' : ''} pb-2 border-b-2 border-transparent hover:border-gray-300 transition-colors duration-200`}>
              <div dangerouslySetInnerHTML={{ __html: category.icon }} />
              <span className="text-xs font-medium text-gray-700">{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area - Property Listings */}
      <main className="container mx-auto px-6 py-8 flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular homes in Kajiado</h2>
        <div id="property-listings" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6 md:px-12 mt-8 rounded-t-lg">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">How KenyaRentals works</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Newsroom</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Investors</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">KenyaRentals Plus</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">KenyaRentals Luxe</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Diversity & Belonging</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Accessibility</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Frontline Stays</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Guest Referrals</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Host</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Host your home</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Host an Online Experience</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Responsible hosting</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors duration-300">Community Centre</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} KenyaRentals, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
