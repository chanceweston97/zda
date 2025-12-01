import { useEffect } from "react";
import { set, useFormValue } from "sanity";
import { NumberInputProps } from "sanity";

/**
 * Custom input component for length option price that automatically calculates
 * price = pricePerFoot × length when length is entered
 */
export function LengthPriceInput(props: NumberInputProps) {
  const { value, onChange } = props;
  
  // Get the length value from the same object (sibling field)
  // The path structure: lengthOptions[].length (sibling) and lengthOptions[].price (this field)
  const length = useFormValue(["_parent", "length"]) as string | undefined;
  
  // Get pricePerFoot from the parent document (cableType)
  // Path: lengthOptions[].price -> lengthOptions[] -> cableType document -> pricePerFoot
  const pricePerFoot = useFormValue(["_parent", "_parent", "pricePerFoot"]) as number | undefined;

  // Calculate price when length changes
  useEffect(() => {
    if (length && pricePerFoot && pricePerFoot > 0) {
      // Parse length from string (e.g., "10 ft" -> 10)
      const lengthMatch = length.match(/(\d+\.?\d*)/);
      if (lengthMatch) {
        const lengthInFeet = parseFloat(lengthMatch[1]);
        if (lengthInFeet > 0) {
          const calculatedPrice = Math.round(pricePerFoot * lengthInFeet * 100) / 100;
          // Only update if the current value is different (to avoid infinite loops)
          if (value !== calculatedPrice) {
            onChange(set(calculatedPrice));
          }
        }
      }
    }
  }, [length, pricePerFoot, value, onChange]);

  // Use the default number input
  return props.renderDefault(props);
}

