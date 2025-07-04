import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
  const navigate = useNavigate(); // Initialize useNavigate
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown to detect outside clicks

  // Dummy data for Kenyan properties with multiple image URLs for carousel
  const properties: Property[] = [
    {
      id: 1,
      name: "Charming Apartment",
      location: "Nairobi, Kilimani",
      price: "KSh 7,500 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1574362678128-4c9b2d3e3e3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGl2aW5nJTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1556912167-f705199a0a3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3w1MjA3fDB8MHxzZWFyY2h8N3x8a2l0Y2hlbiUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D",
      ],
      description:
        "Modern and cozy apartment in the heart of Kilimani, perfect for business or leisure.",
      rating: 4.8,
      reviews: 120,
      isGuestFavorite: true,
    },
    {
      id: 2,
      name: "Beachfront Villa",
      location: "Diani Beach, Kwale",
      price: "KSh 25,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW4lMjBjYWJpbnxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZXN0JTIwY2FiaW58ZW58MHx8fHwxNzAxOTU3ODY5fDA%3D",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW91bnRhaW4lMjBsYWtlfGVufDB8fHx8MA%3D%3D",
      ],
      description:
        "Luxurious villa with direct beach access, private pool, and stunning ocean views.",
      rating: 4.9,
      reviews: 85,
      isGuestFavorite: false,
    },
    {
      id: 3,
      name: "Serene Cottage",
      location: "Naivasha, Nakuru",
      price: "KSh 12,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y290dGFnZSUyMG5haXZhc2hhfGVufDB8fHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y290dGFnZSUyMGludGVyaW9yfGVufDB8fHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y290dGFnZSUyMGV4dGVyaW9yfGVufDB8fHx8MA%3D%3D",
      ],
      description:
        "Escape to this peaceful cottage near Lake Naivasha. Enjoy nature and tranquility.",
      rating: 4.7,
      reviews: 95,
      isGuestFavorite: true,
    },
    {
      id: 4,
      name: "Urban Loft",
      location: "Nairobi, Westlands",
      price: "KSh 8,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXJiYW4lMjBsb2Z0fGVufDB8fHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0b21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXJiYW4lMjBsb2Z0JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzAxOTU3NzEyfDA%3D",
      ],
      description:
        "Stylish loft apartment in a vibrant neighborhood, close to nightlife and corporate offices.",
      rating: 4.6,
      reviews: 150,
      isGuestFavorite: false,
    },
    {
      id: 5,
      name: "Safari Tent",
      location: "Maasai Mara, Narok",
      price: "KSh 35,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FmYXJpJTIwdGVudHxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1506535995048-638aa1b62b77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FmYXJpJTIwc3Vuc2V0fGVufDB8fHx8MA%3D%3D",
      ],
      description:
        "Experience the wild in comfort with this luxury safari tent. Game drives await.",
      rating: 5.0,
      reviews: 60,
      isGuestFavorite: true,
    },
    {
      id: 6,
      name: "Cozy Studio",
      location: "Nairobi, Lavington",
      price: "KSh 6,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3R1ZGlvJTIwYXBhcnRtZW50fGVufDB8fHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0b21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R1ZGlvJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzAxOTU3ODI5fDA%3D",
      ],
      description:
        "Compact and comfortable studio, perfect for solo travelers or couples.",
      rating: 4.5,
      reviews: 70,
      isGuestFavorite: false,
    },
    {
      id: 7,
      name: "Mountain View Cabin",
      location: "Nanyuki, Laikipia",
      price: "KSh 15,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW4lMjBjYWJpbnxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZXN0JTIwY2FiaW58ZW58MHx8fHwxNzAxOTU3ODY5fDA%3D",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW91bnRhaW4lMjBsYWtlfGVufDB8fHx8MA%3D%3D",
      ],
      description:
        "Rustic cabin with breathtaking views of Mount Kenya. Ideal for hiking.",
      rating: 4.9,
      reviews: 45,
      isGuestFavorite: true,
    },
    {
      id: 8,
      name: "Lakeside Retreat",
      location: "Kisumu, Kisumu County",
      price: "KSh 9,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGakeside%20retreat%7Cen%7C0%7C0%7C0%7C0%7C1701957920%7C0",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFrZSUyMHZpY3RvcmlhfGVufDB8fHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFrZSUyMHN1bnNldHxlbnwwfHx8fDA%3D",
      ],
      description:
        "Tranquil retreat by Lake Victoria. Enjoy stunning sunsets and fresh fish.",
      rating: 4.7,
      reviews: 110,
      isGuestFavorite: false,
    },
    {
      id: 9,
      name: "Modern Townhouse",
      location: "Nairobi, Karen",
      price: "KSh 18,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZXJuJTIwdG93bmhvdXNlfGVufDB8fHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG93bmhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzAxOTU3OTY2fDA%3D",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG93bmhvdXNlJTIwZ2FyZGVufGVufDB8fHx8MA%3D%3D",
      ],
      description:
        "Spacious and elegant townhouse in the leafy suburbs of Karen. Perfect for families.",
      rating: 4.8,
      reviews: 90,
      isGuestFavorite: true,
    },
    {
      id: 10,
      name: "Coastal Bungalow",
      location: "Watamu, Kilifi",
      price: "KSh 20,000 / night",
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29hc3RhbCUyMGJ1bmdhbG93fGVufDB8fHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0YW11JTIwYmVhY2h8ZW58MHx8fHwxNzAxOTU4MDExfDA%3D",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29hc3RhbCUyMHBvb2x8ZW58MHx8fHwxNzAxOTU4MDEyfDA%3D",
      ],
      description:
        "Charming bungalow a short walk from Watamu's pristine beaches. Dive into ocean life.",
      rating: 4.9,
      reviews: 75,
      isGuestFavorite: false,
    },
  ];

  // Dummy data for categories (inspired by Airbnb's category scrollbar)
  const categories: Category[] = [
    {
      name: "Amazing views",
      icon: `<svg class="h-6 w-6 text-indigo-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`,
    },
    {
      name: "Beachfront",
      icon: `<svg class="h-6 w-6 text-blue-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    },
    {
      name: "Cabins",
      icon: `<svg class="h-6 w-6 text-green-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`,
    },
    {
      name: "Treehouses",
      icon: `<svg class="h-6 w-6 text-yellow-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 2m0 0l-2-2m2 2V3m2 17a2 2 0 11-4 0 2 2 0 014 0zM7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-2.414-2.414A1 1 0 0015.586 6H7a2 2 0 00-2 2v11a2 2 0 002 2z"></path></svg>`,
    },
    {
      name: "Glamping",
      icon: `<svg class="h-6 w-6 text-purple-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
    },
    {
      name: "Tiny homes",
      icon: `<svg class="h-6 w-6 text-pink-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`,
    },
    {
      name: "Unique stays",
      icon: `<svg class="h-6 w-6 text-orange-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7m0 0L9 7"></path></svg>`,
    },
    {
      name: "Castles",
      icon: `<svg class="h-6 w-6 text-red-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`,
    },
    {
      name: "Lakeside",
      icon: `<svg class="h-6 w-6 text-teal-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    },
    {
      name: "Farms",
      icon: `<svg class="h-6 w-6 text-lime-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586L4 13.586V10a2 2 0 012-2h11z"></path></svg>`,
    },
    {
      name: "Desert",
      icon: `<svg class="h-6 w-6 text-amber-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M3 12H2M18.364 5.636l-.707-.707M6.343 17.657l-.707.707M16.95 18.364l.707-.707M7.05 5.636l-.707.707M12 12a5 5 0 110-10 5 5 0 010 10z"></path></svg>`,
    },
    {
      name: "Ski-in/out",
      icon: `<svg class="h-6 w-6 text-sky-700 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 2m0 0l-2-2m2 2V3m2 17a2 2 0 11-4 0 2 2 0 014 0zM7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-2.414-2.414A1 1 0 0015.586 6H7a2 2 0 00-2 2v11a2 2 0 002 2z"></path></svg>`,
    },
  ];

  // Component for a single property card with custom carousel logic
  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const goToNextImage = () => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % property.imageUrls.length
      );
    };

    const goToPrevImage = () => {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + property.imageUrls.length) %
          property.imageUrls.length
      );
    };

    return (
      <div
        className="bg-white rounded-xl overflow-hidden transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="property-image-container relative aspect-[4/3]">
          {/* Image */}
          <img
            src={property.imageUrls[currentImageIndex]}
            alt={`${property.name} ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/800x600/e2e8f0/64748b?text=Image+Unavailable";
            }}
          />

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevImage();
            }}
            className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:outline-none"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-label="Previous image"
          >
            <svg
              className="h-5 w-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextImage();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:outline-none"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-label="Next image"
          >
            <svg
              className="h-5 w-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          {/* Pagination Dots */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10"
            style={{ opacity: isHovered ? 1 : 0.7 }}
          >
            {property.imageUrls.map((_, dotIndex) => (
              <div
                key={dotIndex}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  dotIndex === currentImageIndex
                    ? "bg-white w-3"
                    : "bg-gray-300 bg-opacity-70"
                } cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(dotIndex);
                }}
                aria-label={`Go to image ${dotIndex + 1}`}
              ></div>
            ))}
          </div>

          {/* Like/Heart Icon */}
          <button className="absolute top-3 right-3 z-10 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 focus:outline-none">
            <svg
              className="h-5 w-5 text-red-500 hover:text-red-700" // Changed to red-500
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          {property.isGuestFavorite && (
            <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md z-10">
              Guest favorite
            </span>
          )}
        </div>
        <div className="p-4 pt-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
              {property.location}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="h-4 w-4 text-yellow-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.83-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-sm font-medium">{property.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 text-base mb-1 truncate">
            {property.name}
          </p>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
            {property.description}
          </p>
          <p className="font-bold text-gray-900 text-base">{property.price}</p>
        </div>
      </div>
    );
  };

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center">
          <svg
            className="h-10 w-10 text-red-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm3 0a1 1 0 112 0v4a1 1 0 11-2 0V7z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-2xl font-bold text-gray-800">KenyaRentals</span>
        </div>

        {/* Search Bar (Desktop) - More Airbnb-like */}
        <div className="hidden md:flex items-center border border-gray-200 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="px-3 border-r border-gray-200">
            <span className="text-sm font-medium">Anywhere</span>
          </div>
          <div className="px-3 border-r border-gray-200">
            <span className="text-sm font-medium">Any week</span>
          </div>
          <div className="px-3 flex items-center">
            <span className="text-sm text-gray-500 mr-2">Add guests</span>
            <div className="bg-red-500 p-2 rounded-full">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* User Menu with Dropdown */}
        <div className="relative flex items-center space-x-4" ref={dropdownRef}>
          <button className="hidden md:block py-2 px-5 rounded-full text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors duration-300">
            Become a Host
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2v2.945M15 3.935V5.5A2.5 2.5 0 0117.5 8h.5A2 2 0 0120 10v2.945M8 19.065V17.5a2.5 2.5 0 00-2.5-2.5h-.5a2 2 0 01-2-2 2 2 0 00-2-2V7.055M15 19.065V17.5a2.5 2.5 0 012.5-2.5h.5a2 2 0 002-2 2 2 0 012-2V7.055"
              />
            </svg>
          </button>
          <div
            className="flex items-center space-x-2 border border-gray-200 rounded-full p-1 pl-3 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-lg"
              >
                <svg
                  className="h-5 w-5 mr-3 text-gray-600" // Kept as gray-600 for consistency with dropdown text
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
                Log in
              </button>
              <button
                onClick={() => {
                  navigate("/Register");
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-lg"
              >
                <svg
                  className="h-5 w-5 mr-3 text-gray-600" // Kept as gray-600 for consistency with dropdown text
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Sign up
              </button>
              {/* Add more dropdown items as needed */}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Search Bar (visible on small screens) */}
      <div className="md:hidden px-6 py-4 bg-white">
        <div className="flex items-center border border-gray-300 rounded-full py-3 px-4 shadow-sm">
          <svg
            className="h-5 w-5 text-gray-500 mr-2" // Kept as gray-500
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Anywhere</span>
            <span className="text-xs text-gray-500">Any week · Add guests</span>
          </div>
        </div>
      </div>

      {/* Category Scrollbar */}
      <section className="px-6 md:px-12 py-4 bg-white overflow-x-auto">
        <div className="flex space-x-8 justify-center">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex flex-col items-center min-w-fit pb-2 ${
                index === 0
                  ? "border-b-2 border-black"
                  : "border-b-2 border-transparent hover:border-gray-300"
              } transition-colors duration-200 cursor-pointer`}
            >
              <div dangerouslySetInnerHTML={{ __html: category.icon }} />
              <span className="text-xs font-medium text-gray-700 mt-1">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area - Property Listings */}
      <main className="container mx-auto px-6 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Popular homes in Kenya
          </h2>
          <button className="text-sm font-medium text-gray-700 hover:underline">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Featured destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Diani Beach"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-xl">Diani Beach</h3>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FmYXJpJTIwdGVudHxlbnwwfHwwfHx8MA%3D%3D"
                alt="Maasai Mara"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-xl">Maasai Mara</h3>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y290dGFnZSUyMG5haXZhc2hhfGVufDB8fHx8MA%3D%3D"
                alt="Naivasha"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-xl">Naivasha</h3>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXJiYW4lMjBsb2Z0fGVufDB8fHx8MA%3D%3D"
                alt="Nairobi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-xl">Nairobi</h3>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6 md:px-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Safety information</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Cancellation options</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">Community</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Disaster relief</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Support refugees</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Combating discrimination</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Try hosting</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">AirCover for Hosts</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Explore hosting resources</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">KenyaRentals</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Newsroom</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Investors</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-sm text-gray-600">© 2025 KenyaRentals, Inc.</span>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Privacy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Terms</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Sitemap</a>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.75c-4.832 0-8.75-3.918-8.75-8.75S7.168 3.25 12 3.25s8.75 3.918 8.75 8.75-3.918 8.75-8.75 8.75zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
              </svg>
              <span className="text-sm font-medium text-gray-600">English (US)</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">$ USD</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {/* Corrected: Wrapped path data in an SVG tag */}
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.69h3.123V8.75c0-3.116 1.892-4.816 4.657-4.816 1.325 0 2.463.098 2.795.142v3.25l-1.938.001c-1.512 0-1.807.718-1.807 1.775V11.69h3.64l-.576 3.016h-3.064V24h6.115c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
