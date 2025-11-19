"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";
import { useAutoOpenCart } from "../Providers/AutoOpenCartProvider";
import toast from "react-hot-toast";
import RequestAQuote from "../RequestAQuote";
import FaqSection from "../Home/Faq";
import Newsletter from "../Common/Newsletter";

type ConnectorOption = 
  | "N-Female"
  | "N-Male"
  | "TNC-Male"
  | "TNC-Female"
  | "SMA-Male"
  | "SMA-Female"
  | "Reverse Polarity SMA-Male"
  | "Reverse Polarity SMA-Female"
  | "Reverse Polarity TNC-Male"
  | "Reverse Polarity TNC-Female"
  | "BNC-Male"
  | "BNC-Female"
  | "N-Female Bulkhead";

type CableType = "White" | "Black";

interface CableConfig {
  cableType: CableType;
  connector1: ConnectorOption;
  connector2: ConnectorOption;
  length: number;
  quantity: number;
}

const CONNECTOR_OPTIONS: ConnectorOption[] = [
  "N-Female",
  "N-Male",
  "TNC-Male",
  "TNC-Female",
  "SMA-Male",
  "SMA-Female",
  "Reverse Polarity SMA-Male",
  "Reverse Polarity SMA-Female",
  "Reverse Polarity TNC-Male",
  "Reverse Polarity TNC-Female",
  "BNC-Male",
  "BNC-Female",
  "N-Female Bulkhead",
];

// Price calculation based on cable configuration
const calculatePrice = (config: CableConfig): number => {
  // Base price per foot
  const basePricePerFoot = 2.5;
  
  // Connector pricing (additional cost per connector)
  const connectorPrices: Record<string, number> = {
    "N-Female": 5,
    "N-Male": 5,
    "TNC-Male": 4,
    "TNC-Female": 4,
    "SMA-Male": 3,
    "SMA-Female": 3,
    "Reverse Polarity SMA-Male": 4,
    "Reverse Polarity SMA-Female": 4,
    "Reverse Polarity TNC-Male": 5,
    "Reverse Polarity TNC-Female": 5,
    "BNC-Male": 3.5,
    "BNC-Female": 3.5,
    "N-Female Bulkhead": 6,
  };

  const connector1Price = connectorPrices[config.connector1] || 0;
  const connector2Price = connectorPrices[config.connector2] || 0;
  const cablePrice = basePricePerFoot * config.length;
  
  // Total price = (cable price + connector prices) * quantity
  const unitPrice = cablePrice + connector1Price + connector2Price;
  return Math.round(unitPrice * 100); // Convert to cents
};

// Get connector image path
const getConnectorImage = (connector: ConnectorOption): string => {
  const connectorLower = connector.toLowerCase().replace(/\s+/g, "-");
  
  // Map connector options to available images
  if (connectorLower.includes("n-male")) {
    return "/images/cable-customizer/n-male-main.png";
  }
  if (connectorLower.includes("n-female") && !connectorLower.includes("bulkhead")) {
    return "/images/cable-customizer/n-female-main.png";
  }
  if (connectorLower.includes("sma-male")) {
    return "/images/cable-customizer/sma-male-main.png";
  }
  if (connectorLower.includes("sma-female")) {
    return "/images/cable-customizer/sma-female-main.png";
  }
  
  // Default fallback
  return "/images/cable-customizer/n-male-main.png";
};

export default function CableCustomizer() {
  const { addItemWithAutoOpen } = useAutoOpenCart();
  const [config, setConfig] = useState<CableConfig>({
    cableType: "Black",
    connector1: "N-Female",
    connector2: "N-Male",
    length: 3,
    quantity: 1,
  });

  const handleAddToCart = () => {
    const price = calculatePrice(config);
    const cableName = `Custom Cable - ${config.connector1} to ${config.connector2} (${config.length}ft, ${config.cableType})`;
    
    // Create a unique ID for this custom cable configuration
    const customId = `custom-cable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const cartItem = {
      id: customId,
      name: cableName,
      price: price,
      currency: "usd",
      image: "/images/cable-customizer/hero-cable.png", // Use cable image as product image
      price_id: null,
      slug: "custom-cable",
      // Store custom configuration in metadata
      metadata: {
        cableType: config.cableType,
        connector1: config.connector1,
        connector2: config.connector2,
        length: config.length,
        isCustom: true,
      },
    };

    // Add to cart with quantity
    addItemWithAutoOpen(cartItem, config.quantity);
    toast.success("Custom cable added to cart!");
  };

  const totalPrice = calculatePrice(config) / 100; // Convert back to dollars

  return (
    <>    
      {/* Hero Section */}
      <section className="relative bg-[#2958A4] py-16 lg:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-white text-[48px] lg:text-[72px] font-medium leading-[58px] lg:leading-[76px] tracking-[-1.92px] lg:tracking-[-2.88px] mb-4">
                CUSTOM CABLE BUILDER
              </h1>
              <p className="text-white text-[18px] lg:text-[24px] font-medium leading-7 lg:leading-[30px]">
                Engineered to carry what matters, built to length for the links you rely on.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md h-64 lg:h-80 flex items-center justify-center">
                {/* Circular gradient background - radial gradient */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(61, 107, 184, 0.6) 0%, rgba(41, 88, 164, 0.4) 40%, rgba(31, 68, 128, 0.2) 70%, transparent 100%)',
                    filter: 'blur(40px)',
                    transform: 'scale(1.2)',
                  }}
                ></div>
                {/* Additional outer glow */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(41, 88, 164, 0.3) 0%, transparent 60%)',
                    filter: 'blur(60px)',
                    transform: 'scale(1.5)',
                  }}
                ></div>
                <div className="relative w-full h-full flex items-center justify-center z-10">
                  <Image
                    src="/images/cable-customizer/hero-cable.png"
                    alt="Custom Cable"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10 lg:py-20 bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Configuration Panel */}
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-lg shadow-1 p-6">
                <h3 className="text-[#2958A4] text-[24px] font-medium mb-6">
                  Order Summary
                </h3>

                {/* Cable Type */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Cable Type *
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfig((prev) => ({ ...prev, cableType: "White" }))}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        config.cableType === "White"
                          ? "border-[#2958A4] bg-[#2958A4] text-white"
                          : "border-gray-3 bg-white text-[#383838] hover:border-[#2958A4]"
                      }`}
                    >
                      White
                    </button>
                    <button
                      onClick={() => setConfig((prev) => ({ ...prev, cableType: "Black" }))}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        config.cableType === "Black"
                          ? "border-[#2958A4] bg-[#2958A4] text-white"
                          : "border-gray-3 bg-white text-[#383838] hover:border-[#2958A4]"
                      }`}
                    >
                      Black
                    </button>
                  </div>
                </div>

                {/* Connector 1 Dropdown */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Step 1: Connector A *
                  </label>
                  <select
                    value={config.connector1}
                    onChange={(e) => setConfig((prev) => ({ ...prev, connector1: e.target.value as ConnectorOption }))}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none"
                  >
                    {CONNECTOR_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Connector 2 Dropdown */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Step 2: Connector B *
                  </label>
                  <select
                    value={config.connector2}
                    onChange={(e) => setConfig((prev) => ({ ...prev, connector2: e.target.value as ConnectorOption }))}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none"
                  >
                    {CONNECTOR_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cable Length */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Step 3: Cable Length *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={config.length}
                      onChange={(e) => setConfig((prev) => ({ ...prev, length: Math.max(1, Number(e.target.value)) }))}
                      className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none"
                      placeholder="Enter length in feet"
                    />
                    <div className="flex justify-between text-sm text-[#383838]">
                      <span>Min: 1 ft</span>
                      <span>Max: 1000 ft</span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setConfig((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-3 hover:border-[#2958A4] transition-all"
                    >
                      <span className="text-[#383838] text-lg">−</span>
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={config.quantity}
                      onChange={(e) => setConfig((prev) => ({ ...prev, quantity: Math.max(1, Number(e.target.value)) }))}
                      className="w-20 text-center py-2 px-3 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none"
                    />
                    <button
                      onClick={() => setConfig((prev) => ({ ...prev, quantity: prev.quantity + 1 }))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-3 hover:border-[#2958A4] transition-all"
                    >
                      <span className="text-[#383838] text-lg">+</span>
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-6 p-4 bg-gray-1 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-[#383838] text-[18px] font-medium">Total Price:</span>
                    <span className="text-[#2958A4] text-[24px] font-bold">
                      ${(totalPrice * config.quantity).toFixed(2)}
                    </span>
                  </div>
                  {config.quantity > 1 && (
                    <div className="text-sm text-[#383838] mt-1 text-right">
                      ${totalPrice.toFixed(2)} each
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full inline-flex items-center justify-center py-3 px-6 rounded-full bg-[#2958A4] text-white font-medium transition-all hover:bg-[#1F4480]"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Right: Visual Preview */}
            <div className="bg-white rounded-lg shadow-1 p-6 lg:p-8">
              <h3 className="text-[#2958A4] text-[24px] font-medium mb-6 text-center">
                Preview
              </h3>
              
              <div className="flex items-center justify-center gap-4 lg:gap-8 mb-8">
                {/* Connector 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 relative">
                    <Image
                      src={getConnectorImage(config.connector1)}
                      alt={config.connector1}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[#383838] text-sm text-center max-w-[100px]">
                    {config.connector1}
                  </p>
                </div>

                {/* Cable */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="relative w-full h-16 lg:h-20">
                    <Image
                      src="/images/cable-customizer/cable.png"
                      alt="Cable"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 text-center text-[#383838] text-sm font-medium">
                    {config.length} ft
                  </div>
                </div>

                {/* Connector 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 relative">
                    <Image
                      src={getConnectorImage(config.connector2)}
                      alt={config.connector2}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[#383838] text-sm text-center max-w-[100px]">
                    {config.connector2}
                  </p>
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="pt-6 border-t border-gray-3">
                <h4 className="text-[#2958A4] text-[18px] font-medium mb-4">
                  Configuration Summary
                </h4>
                <div className="space-y-2 text-[#383838] text-[14px]">
                  <div className="flex justify-between">
                    <span>Cable Type:</span>
                    <span className="font-medium">{config.cableType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connector A:</span>
                    <span className="font-medium">{config.connector1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connector B:</span>
                    <span className="font-medium">{config.connector2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Length:</span>
                    <span className="font-medium">{config.length} ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{config.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <RequestAQuote />
      <FaqSection />
      <Newsletter />
    </>
  );
}
