import { useState, useCallback } from 'react';
import type { AnyObject } from '../types/common'; // Use type-only import for AnyObject

export const useFormValidation = <T extends AnyObject>(
  initialValues: T,
  validate: (values: T) => AnyObject
) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<AnyObject>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
  }, []);

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
    setFormData,
    setErrors,
  };
};
