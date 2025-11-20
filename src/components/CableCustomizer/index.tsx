"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";
import { useAutoOpenCart } from "../Providers/AutoOpenCartProvider";
import toast from "react-hot-toast";
import RequestAQuote from "../RequestAQuote";
import { MinusIcon, PlusIcon } from "@/assets/icons";

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

type CableSeries = "RG Series" | "LMR Series" | "";

type CableType = 
  // LMR Series
  | "LMR 100"
  | "LMR 195"
  | "LMR 195 UltraFlex"
  | "LMR 200"
  | "LMR 240"
  | "LMR 240 UltraFlex"
  | "LMR 400"
  | "LMR 400 UltraFlex"
  | "LMR 600"
  // RG Series
  | "RG 58"
  | "RG 142"
  | "RG 174"
  | "RG 213"
  | "RG 223"
  | "RG 316";

interface CableConfig {
  cableSeries: CableSeries;
  cableType: CableType | "";
  connector1: ConnectorOption | "";
  connector2: ConnectorOption | "";
  length: number | "";
  quantity: number;
}

const LMR_CABLE_TYPES: CableType[] = [
  "LMR 100",
  "LMR 195",
  "LMR 195 UltraFlex",
  "LMR 200",
  "LMR 240",
  "LMR 240 UltraFlex",
  "LMR 400",
  "LMR 400 UltraFlex",
  "LMR 600",
];

const RG_CABLE_TYPES: CableType[] = [
  "RG 58",
  "RG 142",
  "RG 174",
  "RG 213",
  "RG 223",
  "RG 316",
];

const CABLE_SERIES_OPTIONS: CableSeries[] = ["RG Series", "LMR Series"];

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

// Price per foot for each cable type (from spreadsheet Row 28)
const CABLE_PRICE_PER_FOOT: Record<string, number> = {
  // LMR Series
  "LMR 100": 0.55,
  "LMR 195": 0.75,
  "LMR 195 UltraFlex": 0.75, // Same as LMR 195
  "LMR 200": 0.85,
  "LMR 240": 0.88,
  "LMR 240 UltraFlex": 0.88, // Same as LMR 240
  "LMR 400": 1.05,
  "LMR 400 UltraFlex": 1.05, // Same as LMR 400
  "LMR 600": 1.98,
  // RG Series
  "RG 58": 0.75,
  "RG 142": 3.85,
  "RG 174": 0.45,
  "RG 213": 1.05,
  "RG 223": 1.25,
  "RG 316": 0.55,
};

// Connector prices by cable type (from spreadsheet)
// Format: { cableType: { connectorType: price } }
const CONNECTOR_PRICES_BY_CABLE: Record<string, Record<string, number>> = {
  // LMR 100 pricing (similar to LMR 195)
  "LMR 100": {
    "N-Male": 4.95,
    "N-Female": 4.95,
    "N-Female Bulkhead": 4.95,
    "TNC-Male": 4.95,
    "TNC-Female": 4.95,
    "SMA-Male": 3.95,
    "SMA-Female": 3.95,
    "Reverse Polarity SMA-Male": 3.95,
    "Reverse Polarity SMA-Female": 3.95,
    "Reverse Polarity TNC-Male": 4.95,
    "Reverse Polarity TNC-Female": 4.95,
    "BNC-Male": 4.95,
    "BNC-Female": 4.95,
  },
  // LMR 195 / LMR 200 pricing (similar pricing)
  "LMR 195": {
    "N-Male": 4.95,
    "N-Female": 4.95,
    "N-Female Bulkhead": 4.95, // Using N-Female price
    "TNC-Male": 4.95,
    "TNC-Female": 4.95,
    "SMA-Male": 3.95,
    "SMA-Female": 3.95,
    "Reverse Polarity SMA-Male": 3.95, // Using SMA-Male price
    "Reverse Polarity SMA-Female": 3.95, // Using SMA-Female price
    "Reverse Polarity TNC-Male": 4.95, // Using TNC-Male price
    "Reverse Polarity TNC-Female": 4.95, // Using TNC-Female price
    "BNC-Male": 4.95, // Using TNC-Male price as closest
    "BNC-Female": 4.95, // Using TNC-Female price as closest
  },
  "LMR 195 UltraFlex": {
    "N-Male": 4.95,
    "N-Female": 4.95,
    "N-Female Bulkhead": 4.95,
    "TNC-Male": 4.95,
    "TNC-Female": 4.95,
    "SMA-Male": 3.95,
    "SMA-Female": 3.95,
    "Reverse Polarity SMA-Male": 3.95,
    "Reverse Polarity SMA-Female": 3.95,
    "Reverse Polarity TNC-Male": 4.95,
    "Reverse Polarity TNC-Female": 4.95,
    "BNC-Male": 4.95,
    "BNC-Female": 4.95,
  },
  "LMR 200": {
    "N-Male": 4.95,
    "N-Female": 4.95,
    "N-Female Bulkhead": 4.95,
    "TNC-Male": 4.95,
    "TNC-Female": 4.95,
    "SMA-Male": 3.95,
    "SMA-Female": 3.95,
    "Reverse Polarity SMA-Male": 3.95,
    "Reverse Polarity SMA-Female": 3.95,
    "Reverse Polarity TNC-Male": 4.95,
    "Reverse Polarity TNC-Female": 4.95,
    "BNC-Male": 4.95,
    "BNC-Female": 4.95,
  },
  // LMR 240 pricing
  "LMR 240": {
    "N-Male": 5.95,
    "N-Female": 5.95,
    "N-Female Bulkhead": 5.95,
    "TNC-Male": 5.95,
    "TNC-Female": 5.95,
    "SMA-Male": 4.45,
    "SMA-Female": 4.45,
    "Reverse Polarity SMA-Male": 4.45,
    "Reverse Polarity SMA-Female": 4.45,
    "Reverse Polarity TNC-Male": 5.95,
    "Reverse Polarity TNC-Female": 5.95,
    "BNC-Male": 5.95,
    "BNC-Female": 5.95,
  },
  "LMR 240 UltraFlex": {
    "N-Male": 5.95,
    "N-Female": 5.95,
    "N-Female Bulkhead": 5.95,
    "TNC-Male": 5.95,
    "TNC-Female": 5.95,
    "SMA-Male": 4.45,
    "SMA-Female": 4.45,
    "Reverse Polarity SMA-Male": 4.45,
    "Reverse Polarity SMA-Female": 4.45,
    "Reverse Polarity TNC-Male": 5.95,
    "Reverse Polarity TNC-Female": 5.95,
    "BNC-Male": 5.95,
    "BNC-Female": 5.95,
  },
  // LMR 400 pricing
  "LMR 400": {
    "N-Male": 6.95,
    "N-Female": 6.95,
    "N-Female Bulkhead": 6.95,
    "TNC-Male": 6.95,
    "TNC-Female": 6.95,
    "SMA-Male": 4.95,
    "SMA-Female": 4.95,
    "Reverse Polarity SMA-Male": 4.95,
    "Reverse Polarity SMA-Female": 4.95,
    "Reverse Polarity TNC-Male": 6.95,
    "Reverse Polarity TNC-Female": 6.95,
    "BNC-Male": 6.95,
    "BNC-Female": 6.95,
  },
  "LMR 400 UltraFlex": {
    "N-Male": 6.95,
    "N-Female": 6.95,
    "N-Female Bulkhead": 6.95,
    "TNC-Male": 6.95,
    "TNC-Female": 6.95,
    "SMA-Male": 4.95,
    "SMA-Female": 4.95,
    "Reverse Polarity SMA-Male": 4.95,
    "Reverse Polarity SMA-Female": 4.95,
    "Reverse Polarity TNC-Male": 6.95,
    "Reverse Polarity TNC-Female": 6.95,
    "BNC-Male": 6.95,
    "BNC-Female": 6.95,
  },
  // LMR 600 pricing
  "LMR 600": {
    "N-Male": 9.95,
    "N-Female": 9.95,
    "N-Female Bulkhead": 9.95,
    "TNC-Male": 9.95,
    "TNC-Female": 9.95,
    "SMA-Male": 9.95, // Using N-Male price as closest
    "SMA-Female": 9.95,
    "Reverse Polarity SMA-Male": 9.95,
    "Reverse Polarity SMA-Female": 9.95,
    "Reverse Polarity TNC-Male": 9.95,
    "Reverse Polarity TNC-Female": 9.95,
    "BNC-Male": 9.95,
    "BNC-Female": 9.95,
  },
  // RG Series pricing (using similar pricing structure to LMR)
  "RG 58": {
    "N-Male": 4.95,
    "N-Female": 4.95,
    "N-Female Bulkhead": 4.95,
    "TNC-Male": 4.95,
    "TNC-Female": 4.95,
    "SMA-Male": 3.95,
    "SMA-Female": 3.95,
    "Reverse Polarity SMA-Male": 3.95,
    "Reverse Polarity SMA-Female": 3.95,
    "Reverse Polarity TNC-Male": 4.95,
    "Reverse Polarity TNC-Female": 4.95,
    "BNC-Male": 4.95,
    "BNC-Female": 4.95,
  },
  "RG 142": {
    "N-Male": 6.95,
    "N-Female": 6.95,
    "N-Female Bulkhead": 6.95,
    "TNC-Male": 6.95,
    "TNC-Female": 6.95,
    "SMA-Male": 4.95,
    "SMA-Female": 4.95,
    "Reverse Polarity SMA-Male": 4.95,
    "Reverse Polarity SMA-Female": 4.95,
    "Reverse Polarity TNC-Male": 6.95,
    "Reverse Polarity TNC-Female": 6.95,
    "BNC-Male": 6.95,
    "BNC-Female": 6.95,
  },
  "RG 174": {
    "N-Male": 4.95,
    "N-Female": 4.95,
    "N-Female Bulkhead": 4.95,
    "TNC-Male": 4.95,
    "TNC-Female": 4.95,
    "SMA-Male": 3.95,
    "SMA-Female": 3.95,
    "Reverse Polarity SMA-Male": 3.95,
    "Reverse Polarity SMA-Female": 3.95,
    "Reverse Polarity TNC-Male": 4.95,
    "Reverse Polarity TNC-Female": 4.95,
    "BNC-Male": 4.95,
    "BNC-Female": 4.95,
  },
  "RG 213": {
    "N-Male": 6.95,
    "N-Female": 6.95,
    "N-Female Bulkhead": 6.95,
    "TNC-Male": 6.95,
    "TNC-Female": 6.95,
    "SMA-Male": 4.95,
    "SMA-Female": 4.95,
    "Reverse Polarity SMA-Male": 4.95,
    "Reverse Polarity SMA-Female": 4.95,
    "Reverse Polarity TNC-Male": 6.95,
    "Reverse Polarity TNC-Female": 6.95,
    "BNC-Male": 6.95,
    "BNC-Female": 6.95,
  },
  "RG 223": {
    "N-Male": 4.95,
    "N-Female": 4.95,
    "N-Female Bulkhead": 4.95,
    "TNC-Male": 4.95,
    "TNC-Female": 4.95,
    "SMA-Male": 4.75,
    "SMA-Female": 4.75,
    "Reverse Polarity SMA-Male": 4.75,
    "Reverse Polarity SMA-Female": 4.75,
    "Reverse Polarity TNC-Male": 4.95,
    "Reverse Polarity TNC-Female": 4.95,
    "BNC-Male": 4.95,
    "BNC-Female": 4.95,
  },
  "RG 316": {
    "N-Male": 5.95,
    "N-Female": 5.95,
    "N-Female Bulkhead": 5.95,
    "TNC-Male": 5.95,
    "TNC-Female": 5.95,
    "SMA-Male": 4.45,
    "SMA-Female": 4.45,
    "Reverse Polarity SMA-Male": 4.45,
    "Reverse Polarity SMA-Female": 4.45,
    "Reverse Polarity TNC-Male": 5.95,
    "Reverse Polarity TNC-Female": 5.95,
    "BNC-Male": 5.95,
    "BNC-Female": 5.95,
  },
};

// Price calculation based on cable configuration
// Formula: ((Connector 1 cost + Cable footage cost + Connect 2 cost) x 1.35)
const calculatePrice = (config: CableConfig & { cableType: CableType; connector1: ConnectorOption; connector2: ConnectorOption; length: number }): number => {
  // Get price per foot for the selected cable type
  const pricePerFoot = CABLE_PRICE_PER_FOOT[config.cableType] || 0;
  
  // Get connector prices for this cable type
  const connectorPrices = CONNECTOR_PRICES_BY_CABLE[config.cableType] || {};
  
  // Get individual connector prices
  const connector1Price = connectorPrices[config.connector1] || 0;
  const connector2Price = connectorPrices[config.connector2] || 0;
  
  // Calculate cable footage cost
  const cableFootageCost = pricePerFoot * config.length;
  
  // Apply formula: ((Connector 1 cost + Cable footage cost + Connect 2 cost) x 1.35)
  const unitPrice = (connector1Price + cableFootageCost + connector2Price) * 1.35;
  
  // Convert to cents and round
  return Math.round(unitPrice * 100);
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
    cableSeries: "",
    cableType: "",
    connector1: "",
    connector2: "",
    length: "",
    quantity: 1,
  });

  // Get available cable types based on selected series
  const availableCableTypes = config.cableSeries === "RG Series" 
    ? RG_CABLE_TYPES 
    : config.cableSeries === "LMR Series" 
    ? LMR_CABLE_TYPES 
    : [];

  const handleAddToCart = () => {
    // Validate required fields
    if (!config.cableSeries || !config.cableType || !config.connector1 || !config.connector2 || !config.length || config.length <= 0) {
      toast.error("Please fill in all required fields (Cable Series, Cable Type, Connectors, and Length)");
      return;
    }

    const price = calculatePrice(config as CableConfig & { cableType: CableType; connector1: ConnectorOption; connector2: ConnectorOption; length: number });
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
        cableSeries: config.cableSeries,
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

  const totalPrice = config.cableType && config.connector1 && config.connector2 && config.length && typeof config.length === 'number' && config.length > 0
    ? calculatePrice(config as CableConfig & { cableType: CableType; connector1: ConnectorOption; connector2: ConnectorOption; length: number }) / 100
    : 0; // Convert back to dollars

  return (
    <>      
      {/* Hero Section */}
      <section className="relative bg-[#2958A4] py-16 lg:py-24 mt-[108px]">
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

                {/* Cable Series */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Cable Series *
                  </label>
                  <select
                    value={config.cableSeries}
                    onChange={(e) => {
                      const series = e.target.value as CableSeries;
                      setConfig((prev) => ({ 
                        ...prev, 
                        cableSeries: series,
                        cableType: "" // Reset cable type when series changes
                      }));
                    }}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none"
                  >
                    <option value="">Select Cable Series</option>
                    {CABLE_SERIES_OPTIONS.map((series) => (
                      <option key={series} value={series}>
                        {series}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cable Type */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Cable Type *
                  </label>
                  <select
                    value={config.cableType}
                    onChange={(e) => setConfig((prev) => ({ ...prev, cableType: e.target.value as CableType }))}
                    disabled={!config.cableSeries}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    <option value="">
                      {config.cableSeries ? "Select Cable Type" : "Select Cable Series first"}
                    </option>
                    {availableCableTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Connector 1 Dropdown */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Step 1: Connector A *
                  </label>
                  <select
                    value={config.connector1}
                    onChange={(e) => setConfig((prev) => ({ ...prev, connector1: e.target.value as ConnectorOption }))}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none"
                  >
                    <option value="">Select Connector A</option>
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
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none"
                  >
                    <option value="">Select Connector B</option>
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
                      max="150"
                      value={config.length}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "" : Math.max(1, Math.min(150, Number(e.target.value)));
                        setConfig((prev) => ({ ...prev, length: value }));
                      }}
                      className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none"
                      placeholder="Enter length in feet"
                    />
                    <div className="flex justify-between text-sm text-[#383838]">
                      <span>Min: 1 ft</span>
                      <span>Max: 150 ft</span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center divide-x divide-[#2958A4] border border-[#2958A4] rounded-full quantity-controls w-fit">
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                      className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={config.quantity <= 1}
                    >
                      <span className="sr-only">Decrease quantity</span>
                      <MinusIcon className="w-4 h-4" />
                    </button>

                    <span className="flex items-center justify-center w-16 h-10 font-medium text-[#2958A4]">
                      {config.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, quantity: prev.quantity + 1 }))}
                      className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480]"
                    >
                      <span className="sr-only">Increase quantity</span>
                      <PlusIcon className="w-4 h-4" />
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
                  className="w-full inline-flex items-center justify-center rounded-full border border-transparent bg-[#2958A4] text-white text-sm font-medium px-6 py-3 transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
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
                  {config.connector1 ? (
                    <>
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
                    </>
                  ) : (
                    <div className="w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center border-2 border-dashed border-gray-3 rounded-lg">
                      <span className="text-gray-4 text-xs text-center">Select Connector A</span>
                    </div>
                  )}
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
                    {config.length ? `${config.length} ft` : "—"}
                  </div>
                </div>

                {/* Connector 2 */}
                <div className="flex flex-col items-center">
                  {config.connector2 ? (
                    <>
                      <div className="w-24 h-24 lg:w-32 lg:h-32 relative">
                        <Image
                          src={getConnectorImage(config.connector2)}
                          alt={config.connector2}
                          fill
                          className="object-contain scale-x-[-1]"
                        />
                      </div>
                      <p className="mt-2 text-[#383838] text-sm text-center max-w-[100px]">
                        {config.connector2}
                      </p>
                    </>
                  ) : (
                    <div className="w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center border-2 border-dashed border-gray-3 rounded-lg">
                      <span className="text-gray-4 text-xs text-center">Select Connector B</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="pt-6 border-t border-gray-3">
                <h4 className="text-[#2958A4] text-[18px] font-medium mb-4">
                  Configuration Summary
                </h4>
                <div className="space-y-2 text-[#383838] text-[14px]">
                  <div className="flex justify-between">
                    <span>Cable Series:</span>
                    <span className="font-medium">{config.cableSeries || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cable Type:</span>
                    <span className="font-medium">{config.cableType || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connector A:</span>
                    <span className="font-medium">{config.connector1 || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connector B:</span>
                    <span className="font-medium">{config.connector2 || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Length:</span>
                    <span className="font-medium">{config.length ? `${config.length} ft` : "Not selected"}</span>
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
    </>
  );
}
