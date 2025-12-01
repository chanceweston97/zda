"use client";

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import {
  FullScreenIcon,
  MinusIcon,
  PlusIcon,
} from "@/assets/icons";
import { updateproductDetails } from "@/redux/features/product-details";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "@/redux/features/wishlist-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { imageBuilder } from "@/sanity/sanity-shop-utils";
import { Product } from "@/types/product";
import Image from "next/image";

import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useShoppingCart } from "use-shopping-cart";
import toast from "react-hot-toast";
import { useAutoOpenCart } from "../Providers/AutoOpenCartProvider";
import Breadcrumb from "../Common/Breadcrumb";
import Newsletter from "../Common/Newsletter";
import Description from "./Description";
import RequestAQuote from "../RequestAQuote";
import FaqSection from "../Home/Faq";
import { useRouter } from "next/navigation";

type SelectedAttributesType = {
  [key: number]: string | undefined;
};
const productDetailsHeroData = [
  {
    img: "/images/icons/shield-check.svg",
    title: "1 Year Warranty",
  },
  {
    img: "/images/icons/truck.svg",
    title: "Orders Shipped Within 24 Business Hours"
  },
  {
    img: "/images/icons/vectorr.svg",
    title: "Complete Technical Support",
  },
];
type ShopDetailsProps = {
  product: Product;
  cableSeries?: any[] | null;
  cableTypes?: any[] | null;
};

const ShopDetails = ({ product, cableSeries, cableTypes }: ShopDetailsProps) => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  const { cartDetails } = useShoppingCart();
  const { addItemWithAutoOpen } = useAutoOpenCart();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();


  useEffect(() => {
    setMounted(true);
  }, []);

  const isProductInCart = useMemo(
    () => Object.values(cartDetails ?? {}).some((cartItem) => cartItem.id === product._id),
    [cartDetails, product._id]
  );

  const isProductInWishlist = useMemo(
    () =>
      Object.values(wishlistItems ?? {}).some(
        (wishlistItem) => wishlistItem._id?.toString() === product._id?.toString()
      ),
    [wishlistItems, product._id]
  );

  // ---------- SAFE IMAGE HELPERS ----------

  const getImageUrl = (img: any | undefined | null): string | null => {
    if (!img) return null;
    try {
      const url = imageBuilder(img).url();
      return url && url.length > 0 ? url : null;
    } catch {
      return null;
    }
  };

  // main hero image: previewImages[previewImg] OR fallback to first thumbnail
  const mainImageUrl = useMemo(() => {
    const candidate =
      product.previewImages?.[previewImg]?.image ??
      product.previewImages?.[0]?.image ??
      product.thumbnails?.[0]?.image;

    return getImageUrl(candidate);
  }, [product.previewImages, product.thumbnails, previewImg]);

  // cart image: just reuse main hero image
  const cartImageUrl = mainImageUrl;
  // Ensure gainIndex is valid
  const validGainOptions = product.gainOptions?.filter((opt) => opt !== null && opt !== undefined) ?? [];
  const initialGainIndex = validGainOptions.length > 0 ? 0 : -1;
  const [gainIndex, setGainIndex] = useState(initialGainIndex);

  // Update gainIndex if it becomes invalid
  useEffect(() => {
    if (gainIndex >= (validGainOptions.length ?? 0) || gainIndex < 0) {
      setGainIndex(validGainOptions.length > 0 ? 0 : -1);
    }
  }, [product.gainOptions, gainIndex, validGainOptions.length]);

  // Connector product: Display cable series/type as buttons, select length as buttons
  const isConnectorProduct = product.productType === "connector" && product.cableSeries && product.cableType;
  // Standalone connector: from connector document, needs cable series/type selection
  const isStandaloneConnector = product.productType === "connector" && !product.cableSeries && !product.cableType && (product.connector?.pricing || product.pricing);
  // Cable product: from cableType document, needs length selection
  const isCableProduct = product.productType === "cable" || (product.cableType && !product.productType);
  
  // For connector products (products with productType="connector")
  const productCableSeries = product.cableSeries?.name || "";
  const cableType = product.cableType || (product as any).cableType?.cableType; // Support both direct and nested cableType
  const cableTypeName = cableType?.name || "";
  const cableTypePricePerFoot = cableType?.pricePerFoot ?? 0;
  const lengthOptions = product.lengthOptions ?? [];
  
  const [selectedLengthIndex, setSelectedLengthIndex] = useState<number>(-1);
  const [selectedLength, setSelectedLength] = useState<string>("");
  
  // For standalone connectors: state for cable series and type selection
  const [selectedCableSeriesSlug, setSelectedCableSeriesSlug] = useState<string>("");
  const [selectedCableTypeSlug, setSelectedCableTypeSlug] = useState<string>("");
  
  // Get connector slug/name to check if it's N-Male or N-Female
  const connectorSlug = product.slug?.current?.toLowerCase() || "";
  const connectorName = product.name?.toLowerCase() || "";
  const isNTypeConnector = connectorSlug === "n-male" || connectorSlug === "n-female" || 
                           connectorName.includes("n-male") || connectorName.includes("n-female");
  
  // Get connector pricing array
  const connectorPricing = (product.connector?.pricing || product.pricing) as any[] || [];
  
  // Get available cable types based on selected series
  const availableCableTypes = useMemo(() => {
    if (!cableTypes || !selectedCableSeriesSlug) return [];
    
    // Filter by series first
    let filtered = cableTypes.filter((type: any) => type.series?.slug === selectedCableSeriesSlug);
    
    // Filter by connector pricing availability
    filtered = filtered.filter((type: any) => {
      // Check if connector has pricing for this cable type
      const hasPricing = connectorPricing.some((p: any) => p?.cableType?._id === type._id);
      if (!hasPricing) return false;
      
      // If connector is NOT N-Male or N-Female, exclude LMR 600
      if (!isNTypeConnector && type.slug === "lmr-600") {
        return false;
      }
      
      return true;
    });
    
    return filtered;
  }, [cableTypes, selectedCableSeriesSlug, isNTypeConnector, connectorPricing]);
  
  // Get selected cable type data
  const selectedCableType = useMemo(() => {
    if (!cableTypes || !selectedCableTypeSlug) return null;
    return cableTypes.find((type: any) => type.slug === selectedCableTypeSlug);
  }, [cableTypes, selectedCableTypeSlug]);
  
  // Get connector price for selected cable type (for standalone connectors)
  const standaloneConnectorPrice = useMemo(() => {
    if (!isStandaloneConnector || !selectedCableType) return 0;
    
    // Check both product.connector.pricing and product.pricing (connectorData has both)
    const pricingArray = (product.connector?.pricing || product.pricing) as any[];
    if (!pricingArray || !Array.isArray(pricingArray)) return 0;
    
    const pricing = pricingArray.find(
      (p: any) => p?.cableType?._id === selectedCableType._id
    );
    return pricing?.price ?? 0;
  }, [isStandaloneConnector, product.connector?.pricing, product.pricing, selectedCableType]);

  // Get connector price for this cable type
  const connectorPrice = useMemo(() => {
    if (!isConnectorProduct || !product.connector?.pricing || !cableType?._id) {
      return 0;
    }
    const pricing = product.connector.pricing.find(
      (p) => p?.cableType?._id === cableType._id
    );
    return pricing?.price ?? 0;
  }, [isConnectorProduct, product.connector?.pricing, cableType?._id]);

  // Helper functions for lengthOptions (similar to gainOptions)
  const getLengthValue = (option: any): string => {
    if (!option) return "";
    if (typeof option === 'string') {
      return option;
    }
    if (typeof option === 'object' && option !== null) {
      return option.length ?? "";
    }
    return "";
  };

  const getLengthPrice = (option: any): number => {
    if (option && typeof option === 'object' && option !== null && 'price' in option && typeof option.price === 'number') {
      return option.price;
    }
    // If it's a string, calculate from pricePerFoot
    if (typeof option === 'string' && cableTypePricePerFoot > 0) {
      const lengthInFeet = parseLengthInFeet(option);
      return Math.round(cableTypePricePerFoot * lengthInFeet * 100) / 100;
    }
    return 0;
  };

  // Auto-select first length option
  useEffect(() => {
    if (lengthOptions.length > 0 && selectedLengthIndex < 0) {
      setSelectedLengthIndex(0);
      const firstLength = lengthOptions[0];
      setSelectedLength(getLengthValue(firstLength));
    }
  }, [lengthOptions, selectedLengthIndex]);

  // Parse length from string (e.g., "25 ft" -> 25)
  const parseLengthInFeet = (lengthStr: string): number => {
    if (!lengthStr) return 0;
    const match = lengthStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Handle both old format (string[]) and new format (object[])
  const getGainValue = (option: any, index: number): string => {
    if (!option) return "";
    if (typeof option === 'string') {
      return option;
    }
    if (typeof option === 'object' && option !== null) {
      return option.gain ?? "";
    }
    return "";
  };

  const getGainPrice = (option: any, index: number): number => {
    // New format: object with price
    if (option && typeof option === 'object' && option !== null && 'price' in option && typeof option.price === 'number') {
      return option.price;
    }
    // Old format: fallback to first gain option's price with calculation
    const firstGainOption = product.gainOptions?.[0];
    let basePrice = 0;

    // Try to get base price from first gain option (new format)
    if (firstGainOption && typeof firstGainOption === 'object' && firstGainOption !== null && 'price' in firstGainOption) {
      basePrice = firstGainOption.price || 0;
    }

    if (typeof option === 'string') {
      const getGainNumericValue = (gainStr: string): number => {
        if (!gainStr) return 0;
        const match = gainStr.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
      };
      const selectedGainValue = getGainNumericValue(option);
      const firstGain = product.gainOptions?.[0];
      const baseGainValue = firstGain ? getGainNumericValue(getGainValue(firstGain, 0)) : selectedGainValue;
      const gainMultiplier = baseGainValue > 0 ? 1 + ((selectedGainValue - baseGainValue) * 0.05) : 1;
      return Math.round(basePrice * gainMultiplier * 100) / 100;
    }
    return basePrice;
  };

  const currentGainOption = gainIndex >= 0 && product.gainOptions && gainIndex < product.gainOptions.length
    ? product.gainOptions[gainIndex]
    : null;
  const currentGain = getGainValue(currentGainOption, gainIndex);

  // Get unit price (per item, without quantity) from selected gain option or calculated from length and connector price
  const dynamicPrice = useMemo(() => {
    // For standalone connectors: show connector price for selected cable type
    if (isStandaloneConnector) {
      if (selectedCableTypeSlug && standaloneConnectorPrice > 0) {
        return standaloneConnectorPrice;
      }
      return product.price ?? 0;
    }
    
    // For connector products: (cableType.pricePerFoot × length) + (connector.price × 2)
    if (isConnectorProduct) {
      if (selectedLength && cableTypePricePerFoot > 0) {
        const lengthInFeet = parseLengthInFeet(selectedLength);
        const cablePrice = cableTypePricePerFoot * lengthInFeet;
        const connectorPriceTotal = connectorPrice * 2; // Connector price × 2
        const unitPrice = cablePrice + connectorPriceTotal;
        return Math.round(unitPrice * 100) / 100; // Round to 2 decimal places (unit price, quantity applied in cart)
      }
      return product.price ?? 0;
    }
    
    // For cable products: use lengthOptions price
    if (isCableProduct && lengthOptions.length > 0) {
      if (selectedLengthIndex >= 0 && selectedLengthIndex < lengthOptions.length) {
        const selectedLengthOption = lengthOptions[selectedLengthIndex];
        return getLengthPrice(selectedLengthOption);
      }
      // Fallback to first length option's price
      const firstLength = lengthOptions[0];
      if (firstLength) {
        return getLengthPrice(firstLength);
      }
      return product.price ?? 0;
    }
    
    // For antenna products, use gain options
    if (gainIndex < 0 || !currentGainOption) {
      // Fallback to first gain option's price, or 0 if no gain options
      const firstGain = product.gainOptions?.[0];
      if (firstGain) {
        return getGainPrice(firstGain, 0);
      }
      return 0;
    }
    return getGainPrice(currentGainOption, gainIndex);
  }, [currentGainOption, gainIndex, product.gainOptions, isConnectorProduct, isStandaloneConnector, isCableProduct, selectedLength, selectedLengthIndex, lengthOptions, cableTypePricePerFoot, connectorPrice, product.price, selectedCableTypeSlug, standaloneConnectorPrice]);

  // Calculate total price for display (unit price × quantity)
  const totalPrice = useMemo(() => {
    if (!dynamicPrice) return 0;
    return Math.round(dynamicPrice * quantity * 100) / 100;
  }, [dynamicPrice, quantity]);

  const cartItem = {
    id: product._id,
    name: product.name,
    price: dynamicPrice * 100, // Convert to cents
    currency: "usd",
    image: cartImageUrl ?? undefined,
    price_id: product?.price_id,
    slug: product?.slug?.current,
    gain: currentGain,
    // Add connector product info
    ...(isConnectorProduct && {
      ...(productCableSeries && { cableSeries: productCableSeries }),
      ...(cableType && { 
        cableType,
        cableTypeId: product.cableType?._id,
      }),
      ...(selectedLength && {
        length: selectedLength,
      }),
    }),
    // Add cable product info
    ...(isCableProduct && {
      ...(cableType && { 
        cableType,
        cableTypeId: cableType._id,
      }),
      ...(selectedLength && {
        length: selectedLength,
      }),
    }),
    // Add standalone connector info
    ...(isStandaloneConnector && {
      ...(selectedCableSeriesSlug && { cableSeriesSlug: selectedCableSeriesSlug }),
      ...(selectedCableTypeSlug && { 
        cableTypeSlug: selectedCableTypeSlug,
        cableTypeId: selectedCableType?._id,
      }),
    }),
  };

  // pass the product here when you get the real data.
  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  const handleCheckout = async () => {
    // For connector products, validate length is selected
    if (isConnectorProduct) {
      if (!selectedLength) {
        toast.error("Please select a length");
        return;
      }
    }
    
    // For cable products, validate length is selected
    if (isCableProduct) {
      if (selectedLengthIndex < 0 || !selectedLength) {
        toast.error("Please select a length");
        return;
      }
    }
    
    // For standalone connectors, validate cable series and type are selected
    if (isStandaloneConnector) {
      if (!selectedCableSeriesSlug || !selectedCableTypeSlug) {
        toast.error("Please select both Cable Series and Cable Type");
        return;
      }
    }

    // Use quantity for both antenna and connector products
    const itemQuantity = quantity;
    // @ts-ignore
    addItemWithAutoOpen(cartItem, itemQuantity);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify([
          {
            ...cartItem,
            quantity: itemQuantity,
          },
        ]),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data?.url) {
        window.location.href = data?.url;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleAddToCart = async () => {
    // For connector products, validate length is selected
    if (isConnectorProduct) {
      if (!selectedLength) {
        toast.error("Please select a length");
        return;
      }
    }
    
    // For cable products, validate length is selected
    if (isCableProduct) {
      if (selectedLengthIndex < 0 || !selectedLength) {
        toast.error("Please select a length");
        return;
      }
    }
    
    // For standalone connectors, validate cable series and type are selected
    if (isStandaloneConnector) {
      if (!selectedCableSeriesSlug || !selectedCableTypeSlug) {
        toast.error("Please select both Cable Series and Cable Type");
        return;
      }
    }

    // Use quantity for both antenna and connector products
    const itemQuantity = quantity;
    // @ts-ignore
    addItemWithAutoOpen(cartItem, itemQuantity);
    toast.success("Product added to cart!");
  };

  const handleToggleWishlist = () => {
    if (isProductInWishlist) {
      dispatch(removeItemFromWishlist(product._id));
      toast.success("Product removed from wishlist!");
    } else {
      dispatch(
        addItemToWishlist({
          _id: product._id,
          name: product.name,
          price: dynamicPrice,
          discountedPrice: product.discountedPrice || dynamicPrice,
          thumbnails: product.thumbnails,
          status: product.status,
          quantity: 1,
          reviews: product.reviews || [],
          slug: product.slug,
        })
      );
      toast.success("Product added to wishlist!");
    }
  };

  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributesType>({});

  const toggleSelectedAttribute = (itemIndex: number, attributeId: string) => {
    setSelectedAttributes((prevSelected) => ({
      ...prevSelected,
      [itemIndex]: attributeId,
    }));
  };

  return (
    <>
      <section className="relative pt-10 pb-10 overflow-hidden lg:pt-[159px] xl:pt-[159px]">
        <div className="w-full px-4 mx-auto max-w-[1340px] sm:px-6 xl:px-0 ">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-16">
            {/* LEFT: GALLERY */}
            <div className="w-full lg:w-1/2">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                <div>
                  <button
                    onClick={handlePreviewSlider}
                    aria-label="button for zoom"
                    className="gallery__Image w-11 h-11 rounded-full bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-[#2958A4] absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                  >
                    <FullScreenIcon className="w-6 h-6" />
                  </button>

                  {mainImageUrl && (
                    <Image
                      src={mainImageUrl}
                      alt={product.name}
                      width={400}
                      height={400}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {product.thumbnails
                  ?.filter((thumb: any) => !!thumb?.image)
                  .map((item: any, key: number) => {
                    const thumbUrl = getImageUrl(item.image);
                    if (!thumbUrl) return null;

                    return (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-[#2958A4] ${key === previewImg ? "border-[#2958A4]" : "border-transparent"
                          }`}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={thumbUrl}
                          alt="thumbnail"
                        />
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* RIGHT: PRODUCT CONTENT */}
            <div className="w-full lg:w-1/2">
              {/* SKU Display */}
              {product.sku && (
                <div className="mb-3">
                  <span className="text-[#383838] text-[16px] font-medium">
                    <span className="bg-[#2958A4] text-white px-[30px] py-[10px] rounded-full font-normal">{product.sku}</span>
                  </span>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <ul className="flex flex-wrap items-center gap-2">
                  {product.tags.map((tag, index) => (
                    <li key={tag} className="flex items-center gap-2 p-2">
                      <span className="text-black text-[20px] font-normal">•</span>
                      <span className="text-black text-[20px] font-normal">{tag}</span>

                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between mb-3">

                <h2 className="text-[#2958A4] text-[48px] font-medium leading-[58px] tracking-[-1.92px]">
                  {product.name}
                </h2>
              </div>



              <h3 className="font-medium text-custom-1">
                <span className="mr-2 text-black">
                  <span className="text-black text-[36px] font-medium leading-9 tracking-[-1.08px] uppercase">
                    ${totalPrice.toFixed(2)}
                  </span>
                </span>
              </h3>

              {/* <ul className="flex flex-col gap-2">
                {product.offers?.map((offer, key) => (
                  <li key={key} className="flex items-center gap-2.5">
                    <CircleCheckIcon className="fill-[#2958A4]" />
                    {offer}
                  </li>
                ))}
              </ul> */}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4.5 mt-3 py-2">
                  {product.featureTitle && (
                    <span className="text-black font-satoshi text-[24px] font-bold leading-[26px]">{product.featureTitle}</span>
                  )}
                  {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {product.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-black text-[16px] leading-6">•</span>
                          <span className="text-black text-[16px] font-medium leading-[26px]">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {product.applications && Array.isArray(product.applications) && product.applications.length > 0 && (
                    <ul className="flex flex-col gap-2 mt-2">
                      {product.applications.map((application: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-black text-[16px] leading-6">•</span>
                          <span className="text-black text-[16px] font-medium leading-[26px]">
                            {application}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-2 w-full px-6 space-y-4">
                      {/* Gain - Full Width Row (Antenna products only) */}
                      {!isConnectorProduct && !isCableProduct && product.gainOptions && product.gainOptions.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-black text-[20px] font-medium leading-[30px]">
                            Gain(dBi)
                          </label>

                          <div className="flex flex-wrap gap-2">
                            {product.gainOptions?.map((gainOption, index) => {
                              if (gainOption === null || gainOption === undefined) return null;
                              const gainValue = getGainValue(gainOption, index);
                              if (!gainValue) return null;
                              const isSelected = gainIndex === index;
                              
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setGainIndex(index)}
                                  className={`rounded-full border-2 flex items-center justify-center text-center text-[16px] leading-[26px] font-medium transition-all duration-200 whitespace-nowrap w-12 h-12 ${
                                    isSelected
                                      ? "border-[#2958A4] bg-[#2958A4] text-white"
                                      : "border-[#2958A4] bg-[#F6F7F7] text-[#2958A4] hover:bg-[#2958A4]/10"
                                  }`}
                                >
                                  {gainValue}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Connector Products: Cable Series, Cable Type, Length, and Quantity */}
                      {isConnectorProduct && (
                        <>
                          {/* Cable Series - Button style */}
                          {productCableSeries && (
                            <div className="space-y-2">
                              <label className="text-black text-[20px] font-medium leading-[30px]">
                                Cable Series
                              </label>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled
                                  className="rounded-full border-2 border-[#2958A4] bg-[#2958A4] text-white flex items-center justify-center text-center text-[16px] leading-[26px] font-medium transition-all duration-200 whitespace-nowrap px-4 py-2 cursor-default"
                                >
                                  {productCableSeries}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Cable Type - Button style */}
                          {cableTypeName && (
                            <div className="space-y-2">
                              <label className="text-black text-[20px] font-medium leading-[30px]">
                                Cable Type
                              </label>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled
                                  className="rounded-full border-2 border-[#2958A4] bg-[#2958A4] text-white flex items-center justify-center text-center text-[16px] leading-[26px] font-medium transition-all duration-200 whitespace-nowrap px-4 py-2 cursor-default"
                                >
                                  {cableTypeName}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Length - Button style (like gain options) */}
                          {lengthOptions.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-black text-[20px] font-medium leading-[30px]">
                                Length (ft)
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {lengthOptions.map((lengthOption, index) => {
                                  if (lengthOption === null || lengthOption === undefined) return null;
                                  const lengthValue = getLengthValue(lengthOption);
                                  if (!lengthValue) return null;
                                  const isSelected = selectedLengthIndex === index;
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => {
                                        setSelectedLengthIndex(index);
                                        setSelectedLength(lengthValue);
                                      }}
                                      className={`rounded-full border-2 flex items-center justify-center text-center text-[16px] leading-[26px] font-medium transition-all duration-200 whitespace-nowrap px-4 py-2 ${
                                        isSelected
                                          ? "border-[#2958A4] bg-[#2958A4] text-white"
                                          : "border-[#2958A4] bg-[#F6F7F7] text-[#2958A4] hover:bg-[#2958A4]/10"
                                      }`}
                                    >
                                      {lengthValue}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Quantity - Full Width Row */}
                          <div className="space-y-2">
                            <label className="text-black text-[20px] font-medium leading-[30px]">
                              Quantity
                            </label>

                            <div className="flex items-center divide-x divide-[#2958A4] border border-[#2958A4] rounded-full quantity-controls w-fit">
                              <button
                                type="button"
                                onClick={() => {
                                  if (quantity > 1) {
                                    setQuantity((prev) => prev - 1);
                                  }
                                }}
                                className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity <= 1}
                              >
                                <span className="sr-only">Decrease quantity</span>
                                <MinusIcon className="w-4 h-4" />
                              </button>

                              <span className="flex items-center justify-center w-16 h-10 font-medium text-[#2958A4]">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => setQuantity((prev) => prev + 1)}
                                className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480]"
                              >
                                <span className="sr-only">Increase quantity</span>
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Standalone Connectors: Cable Series and Cable Type Dropdowns */}
                      {isStandaloneConnector && cableSeries && cableTypes && (
                        <>
                          {/* Cable Series Dropdown */}
                          <div className="flex flex-col space-y-2">
                            <label className="text-black text-[20px] font-medium leading-[30px]">
                              Cable Series *
                            </label>
                            <select
                              value={selectedCableSeriesSlug}
                              onChange={(e) => {
                                setSelectedCableSeriesSlug(e.target.value);
                                setSelectedCableTypeSlug(""); // Reset cable type when series changes
                              }}
                              className="w-fit min-w-[250px] py-3 pl-4 pr-10 border-2 border-[#2958A4] bg-white text-[#383838] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#2958A4] rounded-lg appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232958A4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat"
                              style={{ backgroundPosition: 'right 0.75rem center' }}
                            >
                              <option value="">Select Cable Series</option>
                              {cableSeries.map((series: any) => (
                                <option key={series._id} value={series.slug}>
                                  {series.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Cable Type Dropdown */}
                          <div className="flex flex-col space-y-2">
                            <label className="text-black text-[20px] font-medium leading-[30px]">
                              Cable Type *
                            </label>
                            <select
                              value={selectedCableTypeSlug}
                              onChange={(e) => setSelectedCableTypeSlug(e.target.value)}
                              disabled={!selectedCableSeriesSlug}
                              className={`w-fit min-w-[250px] py-3 pl-4 pr-10 border-2 border-[#2958A4] bg-white text-[#383838] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#2958A4] rounded-lg appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232958A4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat ${
                                !selectedCableSeriesSlug ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              style={{ backgroundPosition: 'right 0.75rem center' }}
                            >
                              <option value="">
                                {selectedCableSeriesSlug ? "Select Cable Type" : "Select Cable Series first"}
                              </option>
                              {availableCableTypes.map((type: any) => (
                                <option key={type._id} value={type.slug}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Price Display when both are selected */}
                          {selectedCableTypeSlug && standaloneConnectorPrice > 0 && (
                            <div className="space-y-2 pt-2 border-t border-gray-3">
                              <div className="flex justify-between items-center">
                                <span className="text-black text-[18px] font-medium">Connector Price:</span>
                                <span className="text-[#2958A4] text-[24px] font-bold">
                                  ${standaloneConnectorPrice.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Quantity */}
                          <div className="space-y-2">
                            <label className="text-black text-[20px] font-medium leading-[30px]">
                              Quantity
                            </label>
                            <div className="flex items-center divide-x divide-[#2958A4] border border-[#2958A4] rounded-full quantity-controls w-fit">
                              <button
                                type="button"
                                onClick={() => {
                                  if (quantity > 1) {
                                    setQuantity((prev) => prev - 1);
                                  }
                                }}
                                className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity <= 1}
                              >
                                <span className="sr-only">Decrease quantity</span>
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="flex items-center justify-center w-16 h-10 font-medium text-[#2958A4]">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQuantity((prev) => prev + 1)}
                                className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480]"
                              >
                                <span className="sr-only">Increase quantity</span>
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Quantity - Full Width Row (Antenna products only) */}
                      {/* Length Options for Cable Products */}
                      {isCableProduct && lengthOptions.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-black text-[20px] font-medium leading-[30px]">
                            Length (ft)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {lengthOptions.map((lengthOption, index) => {
                              if (lengthOption === null || lengthOption === undefined) return null;
                              const lengthValue = getLengthValue(lengthOption);
                              if (!lengthValue) return null;
                              const isSelected = selectedLengthIndex === index;
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setSelectedLengthIndex(index);
                                    setSelectedLength(lengthValue);
                                  }}
                                  className={`rounded-full border-2 flex items-center justify-center text-center text-[16px] leading-[26px] font-medium transition-all duration-200 whitespace-nowrap px-4 py-2 ${
                                    isSelected
                                      ? "border-[#2958A4] bg-[#2958A4] text-white"
                                      : "border-[#2958A4] bg-[#F6F7F7] text-[#2958A4] hover:bg-[#2958A4]/10"
                                  }`}
                                >
                                  {lengthValue}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {!isConnectorProduct && !isStandaloneConnector && !isCableProduct && (
                        <div className="space-y-2">
                          <label className="text-black text-[20px] font-medium leading-[30px]">
                            Quantity
                          </label>

                          <div className="flex items-center divide-x divide-[#2958A4] border border-[#2958A4] rounded-full quantity-controls w-fit">
                            <button
                              type="button"
                              onClick={() => {
                                if (quantity > 1) {
                                  setQuantity((prev) => prev - 1);
                                }
                              }}
                              className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480] disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={quantity <= 1}
                            >
                              <span className="sr-only">Decrease quantity</span>
                              <MinusIcon className="w-4 h-4" />
                            </button>

                            <span className="flex items-center justify-center w-16 h-10 font-medium text-[#2958A4]">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => setQuantity((prev) => prev + 1)}
                              className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480]"
                            >
                              <span className="sr-only">Increase quantity</span>
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 space-y-3 mt-4">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isProductInCart}
                        className={`w-full inline-flex items-center justify-center rounded-full border border-transparent bg-[#2958A4] text-white text-sm font-medium px-6 py-3 transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4] ${
                          isProductInCart
                            ? "opacity-70 cursor-not-allowed disabled:hover:border-transparent disabled:hover:bg-[#2958A4] disabled:hover:text-white"
                            : ""
                        }`}
                      >
                        {isProductInCart ? "Added to Cart" : "Add to Cart"}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push("/request-a-quote")}
                        className="w-full inline-flex items-center justify-center rounded-full border border-transparent bg-[#2958A4] text-white text-sm font-medium px-6 py-3 transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
                      >
                        Request a Quote
                      </button>
                    </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-5">
            {productDetailsHeroData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-4 bg-[#F6F7F7] py-6 px-4 sm:px-6 w-full text-center"
                >
                  <div className="flex items-center justify-center flex-shrink-0">
                    <Image
                      src={item.img}
                      alt="icon"
                      width={60}
                      height={60}
                      className=""
                    />
                  </div>

                  <h3 className="text-[#2958A4] text-[20px] font-medium leading-[30px]">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Description product={product} />
      <RequestAQuote variant="two-column" showProductOrService={false} />
      <FaqSection />
      <Newsletter />
    </>
  );
};

export default ShopDetails;
