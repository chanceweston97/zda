import { Product } from "@/types/product";

/**
 * Get the default price for a product
 * Priority: 
 *   - Connector products: Lowest price from connector pricing
 *   - Antenna products: Product price field, or first gain option's price
 * This is used on shop/category listing pages to show a single default price
 * On product detail pages, use dynamic pricing based on selected gain option or cable type
 * 
 * @returns The product's default price, or 0 if no price is available
 */
export function getProductPrice(product: Product): number {
  // For connector products, calculate price based on first length option
  if (product.productType === "connector" && product.pricePerFoot && product.lengthOptions && product.lengthOptions.length > 0) {
    // Parse first length option (e.g., "10 ft" -> 10)
    const firstLength = product.lengthOptions[0];
    const lengthMatch = firstLength?.match(/(\d+\.?\d*)/);
    const lengthInFeet = lengthMatch ? parseFloat(lengthMatch[1]) : 0;
    
    if (lengthInFeet > 0 && product.pricePerFoot > 0) {
      return Math.round(product.pricePerFoot * lengthInFeet * 100) / 100;
    }
  }

  // First, check if product has a direct price field (default price)
  if (product.price && typeof product.price === 'number' && product.price > 0) {
    return product.price;
  }

  // Fallback to first gain option's price (for antenna products)
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
 * Get price range for a product (min and max prices from gain options or connector pricing)
 * Returns { min: number, max: number } or null if no valid prices found
 */
export function getProductPriceRange(product: Product): { min: number; max: number } | null {
  const prices: number[] = [];

  // For connector products, use connector pricing
  if (product.productType === "connector" && product.connector?.pricing) {
    for (const pricing of product.connector.pricing) {
      if (pricing?.price != null && typeof pricing.price === 'number' && pricing.price > 0) {
        prices.push(pricing.price);
      }
    }
  } 
  // For antenna products, use gain options
  else if (product.gainOptions && product.gainOptions.length > 0) {
    for (const gainOption of product.gainOptions) {
      if (gainOption && typeof gainOption === 'object' && gainOption !== null) {
        if ('price' in gainOption && typeof gainOption.price === 'number' && gainOption.price > 0) {
          prices.push(gainOption.price);
        }
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

