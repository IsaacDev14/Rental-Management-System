// frontend/src/utils/helpers.ts

/**
 * Formats a number as a currency string (KES).
 * @param amount The number to format.
 * @returns A string representing the amount in KES, e.g., "KES 123,456.00".
 */
export const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Calculates the difference in days between two date strings.
 * @param startDateString The start date in YYYY-MM-DD format.
 * @param endDateString The end date in YYYY-MM-DD format.
 * @returns The number of days between the two dates. Returns 0 if dates are invalid.
 */
export const getDaysDifference = (startDateString: string, endDateString: string): number => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid date format provided to getDaysDifference');
    return 0;
  }

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Capitalizes the first letter of a string.
 * @param str The input string.
 * @returns The string with its first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generates an Unsplash image URL with specified dimensions and quality.
 * @param unsplashId The Unsplash photo ID (e.g., 'photo-1570129476814').
 * @param width The desired width of the image.
 * @param height The desired height of the image.
 * @returns A formatted Unsplash image URL.
 */
export const getUnsplashImageUrl = (unsplashId: string, width: number = 600, height: number = 400): string => {
  // Base URL for Unsplash photos.
  // We use the ID directly and append parameters for sizing and quality.
  return `https://images.unsplash.com/photo-${unsplashId}?w=${width}&h=${height}&auto=format&fit=crop&q=80`;
};

/**
 * Gets the lease status based on the current date and lease end date.
 * @param leaseEnd The lease end date string (YYYY-MM-DD).
 * @returns 'Expired', 'Ending Soon', 'Active', or 'N/A'.
 */
export const getLeaseStatus = (leaseEnd: string | undefined): 'Expired' | 'Ending Soon' | 'Active' | 'N/A' => {
  if (!leaseEnd) return 'N/A';
  const today = new Date();
  const leaseEndDate = new Date(leaseEnd);

  // Set both dates to start of day to avoid time component issues
  today.setHours(0, 0, 0, 0);
  leaseEndDate.setHours(0, 0, 0, 0);

  const diffTime = leaseEndDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
      return 'Expired';
  } else if (diffDays <= 90) { // Lease ending within 90 days
      return 'Ending Soon';
  } else {
      return 'Active';
  }
};
