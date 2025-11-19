import { Product } from "@/types/product";

/**
 * Get the default price for a product
 * Priority: 1. Product price field, 2. First gain option's price
 * This is used on shop/category listing pages to show a single default price
 * On product detail pages, use dynamic pricing based on selected gain option
 * 
 * @returns The product's default price, or 0 if no price is available
 */
export function getProductPrice(product: Product): number {
  // First, check if product has a direct price field (default price)
  if (product.price && typeof product.price === 'number' && product.price > 0) {
    return product.price;
  }

  // Fallback to first gain option's price
  if (product.gainOptions && product.gainOptions.length > 0) {
    const firstGain = product.gainOptions[0];
    
    // New format: object with price
    if (firstGain && typeof firstGain === 'object' && firstGain !== null && 'price' in firstGain && typeof firstGain.price === 'number') {
      return firstGain.price;
    }
  }
  
  // No price available
  return 0;
}

/**
 * Get price range for a product (min and max prices from gain options)
 * Returns { min: number, max: number } or null if no valid prices found
 */
export function getProductPriceRange(product: Product): { min: number; max: number } | null {
  if (!product.gainOptions || product.gainOptions.length === 0) {
    return null;
  }

  const prices: number[] = [];

  for (const gainOption of product.gainOptions) {
    if (gainOption && typeof gainOption === 'object' && gainOption !== null) {
      if ('price' in gainOption && typeof gainOption.price === 'number' && gainOption.price > 0) {
        prices.push(gainOption.price);
      }
    }
  }

  if (prices.length === 0) {
    return null;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return { min, max };
}

/**
 * Get formatted price display string for a product
 * Shows single price, or price range if prices vary
 */
export function getProductPriceDisplay(product: Product): string {
  const price = getProductPrice(product);
  
  if (price === 0) {
    return 'Price on request';
  }

  const priceRange = getProductPriceRange(product);
  
  if (priceRange && priceRange.min !== priceRange.max) {
    // Multiple prices - show range
    return `$${priceRange.min.toFixed(2)} - $${priceRange.max.toFixed(2)}`;
  }

  // Single price
  return `$${price.toFixed(2)}`;
}

