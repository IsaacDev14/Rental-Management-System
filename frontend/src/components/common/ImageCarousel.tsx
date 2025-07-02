// frontend/src/components/common/ImageCarousel.tsx

import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import navigation icons
import { getUnsplashImageUrl } from '../../utils/helpers'; // Import helper for Unsplash URLs

/**
 * Props interface for the ImageCarousel component.
 */
interface ImageCarouselProps {
  images: string[]; // Array of Unsplash image IDs (e.g., 'photo-12345')
}

/**
 * Reusable ImageCarousel component for displaying a slideshow of images.
 * Features navigation arrows, dot indicators, and handles image loading errors.
 * It uses a helper function to construct Unsplash image URLs.
 */
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Navigates to the previous image in the carousel.
   * Loops back to the end if currently at the first image.
   */
  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  /**
   * Navigates to the next image in the carousel.
   * Loops back to the beginning if currently at the last image.
   */
  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  // If no images are provided, display a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-48 bg-gray-600 flex items-center justify-center rounded-lg overflow-hidden">
        <p className="text-gray-400 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden group">
      <img
        // Use the helper function to construct the image URL from the Unsplash ID
        src={getUnsplashImageUrl(images[currentIndex])}
        alt={`Property image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        // Fallback image in case of loading error
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://placehold.co/600x400/374151/FFFFFF?text=Image+Error"; }}
      />
      {images.length > 1 && (
        <>
          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
          {/* Pagination dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'} transition-colors duration-300`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
