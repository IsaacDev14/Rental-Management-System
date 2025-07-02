// frontend/src/hooks/useFormValidation.ts

import { useState, useCallback } from 'react';
import { AnyObject } from '../types/common'; // Import generic object type

/**
 * Custom hook for handling form validation.
 * Provides state for form data and errors, and a function to validate the form.
 *
 * @param initialValues The initial state of the form data.
 * @param validate A function that takes the form data and returns an errors object.
 * The errors object should have keys corresponding to form fields
 * and string values for error messages.
 * @returns An object containing:
 * - formData: The current state of the form data.
 * - errors: An object containing validation error messages.
 * - handleChange: A function to update form data and clear related errors.
 * - handleSubmit: A function to trigger validation and call a callback if valid.
 * - setFormData: Function to directly set form data.
 * - setErrors: Function to directly set errors.
 */
export const useFormValidation = <T extends AnyObject>(
  initialValues: T,
  validate: (values: T) => AnyObject
) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<AnyObject>({});

  /**
   * Handles changes to form input fields.
   * Updates the formData state and clears any existing error for that field.
   * @param e The change event from an input element.
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: undefined })); // Clear error on change
  }, []);

  /**
   * Handles form submission.
   * Validates the form and calls the provided callback if the form is valid.
   * @param callback The function to call if the form is valid.
   */
  const handleSubmit = useCallback((callback: (values: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      const currentErrors = validate(formData);
      setErrors(currentErrors);

      if (Object.keys(currentErrors).length === 0) {
        callback(formData);
      }
    };
  }, [formData, validate]);

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData, // Expose for external updates if needed (e.g., editing existing data)
    setErrors,   // Expose for external error setting if needed
  };
};
