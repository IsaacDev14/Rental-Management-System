// frontend/src/components/ui/Modal.tsx

import React, { useEffect } from 'react';
import { X } from 'lucide-react'; // Import the close icon

/**
 * Props interface for the Modal component.
 */
interface ModalProps {
  isOpen: boolean; // Controls the visibility of the modal
  onClose: () => void; // Callback function when the modal is closed
  title: string; // Title to display in the modal header
  children: React.ReactNode; // Content to display inside the modal body
  maxWidth?: string; // Optional: custom max-width for the modal (e.g., 'max-w-lg', 'max-w-4xl')
}

/**
 * Reusable Modal component for displaying overlay dialogs.
 * Includes a backdrop, title, close button, and content area.
 * Handles escape key to close and prevents body scrolling when open.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl', // Default max-width
}) => {
  // Effect to handle body scroll locking and escape key press
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';

      // Handle escape key press to close modal
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscape);

      return () => {
        // Re-enable body scrolling when modal closes
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      // Ensure body scrolling is unset if modal is closed by other means
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]); // Depend on isOpen and onClose

  if (!isOpen) return null; // Don't render anything if modal is not open

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose} // Close modal when clicking on the backdrop
    >
      <div
        className={`bg-gray-800 rounded-2xl shadow-2xl w-full ${maxWidth} border border-gray-700 transform scale-95 animate-scale-in`}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
