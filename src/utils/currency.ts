// Tanzania Shilling (TZS) currency utilities

export const formatTZS = (amount: number): string => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseTZS = (formattedAmount: string): number => {
  // Remove currency symbols and convert to number
  return parseFloat(formattedAmount.replace(/[^\d.-]/g, '')) || 0;
};

export const calculateDeliveryFee = (distance: number): number => {
  // Base delivery fee: 2000 TZS + 500 TZS per km
  const baseFee = 2000;
  const perKmFee = 500;
  return baseFee + (distance * perKmFee);
};

export const TZS_SYMBOL = 'TZS';
export const TZS_CODE = 'TZS';