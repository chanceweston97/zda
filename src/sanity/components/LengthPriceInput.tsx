import { useEffect, useMemo } from "react";
import { set, useFormValue } from "sanity";
import { NumberInputProps } from "sanity";

/**
 * Custom input component for length option price that automatically calculates
 * price = pricePerFoot × length when length is entered
 * The price field is read-only and cannot be manually edited
 */
export function LengthPriceInput(props: NumberInputProps) {
  const { value, onChange } = props;
  
  // Get the length value from the same object (sibling field)
  // The path structure: lengthOptions[].length (sibling) and lengthOptions[].price (this field)
  const length = useFormValue(["_parent", "length"]) as string | undefined;
  
  // Get pricePerFoot from the parent document (cableType)
  // Path: lengthOptions[].price -> lengthOptions[] -> cableType document -> pricePerFoot
  const pricePerFoot = useFormValue(["_parent", "_parent", "pricePerFoot"]) as number | undefined;

  // Calculate the price based on length and pricePerFoot
  const calculatedPrice = useMemo(() => {
    if (length && pricePerFoot && pricePerFoot > 0) {
      // Parse length from string (e.g., "10 ft" -> 10)
      const lengthMatch = length.match(/(\d+\.?\d*)/);
      if (lengthMatch) {
        const lengthInFeet = parseFloat(lengthMatch[1]);
        if (lengthInFeet > 0) {
          return Math.round(pricePerFoot * lengthInFeet * 100) / 100;
        }
      }
    }
    return value || 0;
  }, [length, pricePerFoot, value]);

  // Update price when calculation changes
  useEffect(() => {
    if (calculatedPrice !== value && calculatedPrice > 0) {
      onChange(set(calculatedPrice));
    }
  }, [calculatedPrice, value, onChange]);

  // Render the default input with readOnly prop
  return props.renderDefault({
    ...props,
    readOnly: true,
  });
}

