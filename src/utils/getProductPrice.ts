import { Product } from "@/types/product";

/**
 * Get the price for a product from its gain options
 * Returns the first gain option's price, or 0 if no gain options exist
 */
export function getProductPrice(product: Product): number {
  if (!product.gainOptions || product.gainOptions.length === 0) {
    return 0;
  }

  const firstGain = product.gainOptions[0];
  
  // New format: object with price
  if (firstGain && typeof firstGain === 'object' && firstGain !== null && 'price' in firstGain && typeof firstGain.price === 'number') {
    return firstGain.price;
  }
  
  // Old format: string array - return 0 (shouldn't happen with new schema, but for backward compatibility)
  return 0;
}

