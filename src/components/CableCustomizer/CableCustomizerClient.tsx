"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";
import { useAutoOpenCart } from "../Providers/AutoOpenCartProvider";
import toast from "react-hot-toast";
import RequestAQuote from "../RequestAQuote";
import { MinusIcon, PlusIcon } from "@/assets/icons";

// Types for Sanity data
interface CableCustomizerData {
  cableSeries: Array<{ id: string; name: string; slug: string }>;
  cableTypes: Array<{
    id: string;
    name: string;
    slug: string;
    series: string;
    seriesName: string;
    pricePerFoot: number;
    image: string | null;
  }>;
  connectors: Array<{
    id: string;
    name: string;
    slug: string;
    image: string | null;
    pricing: Array<{
      cableTypeSlug: string;
      cableTypeName: string;
      price: number;
    }>;
  }>;
}

interface CableConfig {
  cableSeries: string;
  cableType: string;
  connector1: string;
  connector2: string;
  length: number | "";
  quantity: number;
}

interface CableCustomizerClientProps {
  data: CableCustomizerData;
}

export default function CableCustomizerClient({ data }: CableCustomizerClientProps) {
  const { addItemWithAutoOpen } = useAutoOpenCart();
  const [config, setConfig] = useState<CableConfig>({
    cableSeries: "",
    cableType: "",
    connector1: "",
    connector2: "",
    length: "",
    quantity: 1,
  });

  // Build lookup maps from Sanity data
  const cableSeriesMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string; slug: string }>();
    data.cableSeries.forEach((series) => {
      map.set(series.slug, series);
    });
    return map;
  }, [data.cableSeries]);

  const cableTypesMap = useMemo(() => {
    const map = new Map<string, typeof data.cableTypes[0]>();
    data.cableTypes.forEach((type) => {
      map.set(type.slug, type);
    });
    return map;
  }, [data.cableTypes]);

  const connectorsMap = useMemo(() => {
    const map = new Map<string, typeof data.connectors[0]>();
    data.connectors.forEach((connector) => {
      map.set(connector.slug, connector);
    });
    return map;
  }, [data.connectors]);

  // Get available cable types based on selected series
  const availableCableTypes = useMemo(() => {
    if (!config.cableSeries) return [];
    const selectedSeries = cableSeriesMap.get(config.cableSeries);
    if (!selectedSeries) return [];
    
    return data.cableTypes
      .filter((type) => type.series === selectedSeries.slug)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }, [config.cableSeries, data.cableTypes, cableSeriesMap]);

  // Get available connectors
  const availableConnectors = useMemo(() => {
    return data.connectors.sort((a, b) => (a.name > b.name ? 1 : -1));
  }, [data.connectors]);

  // Get connector price for a specific cable type
  const getConnectorPrice = (connectorSlug: string, cableTypeSlug: string): number => {
    const connector = connectorsMap.get(connectorSlug);
    if (!connector) {
      console.warn(`Connector not found: ${connectorSlug}`);
      return 0;
    }
    
    const pricing = connector.pricing.find((p) => p.cableTypeSlug === cableTypeSlug);
    if (!pricing) {
      console.warn(`Pricing not found for connector "${connector.name}" with cable type slug "${cableTypeSlug}"`);
      console.warn(`Available cable types for this connector:`, connector.pricing.map(p => p.cableTypeSlug));
    }
    return pricing?.price || 0;
  };

  // Calculate price based on Sanity data
  const calculatePrice = (config: CableConfig & { cableType: string; connector1: string; connector2: string; length: number }): number => {
    const cableType = cableTypesMap.get(config.cableType);
    if (!cableType) return 0;

    const connector1 = connectorsMap.get(config.connector1);
    const connector2 = connectorsMap.get(config.connector2);
    
    if (!connector1 || !connector2) return 0;

    // Find connector prices for this cable type
    const connector1Price = getConnectorPrice(config.connector1, config.cableType);
    const connector2Price = getConnectorPrice(config.connector2, config.cableType);

    // Calculate cable footage cost
    const cableFootageCost = cableType.pricePerFoot * config.length;

    // Apply formula: ((Connector 1 cost + Cable footage cost + Connect 2 cost) x 1.35)
    const unitPrice = (connector1Price + cableFootageCost + connector2Price) * 1.35;

    // Return price in dollars (not cents)
    return unitPrice;
  };

  // Get connector image from Sanity or fallback
  const getConnectorImage = (connectorSlug: string): string => {
    const connector = connectorsMap.get(connectorSlug);
    if (connector?.image) {
      return connector.image;
    }
    
    // Fallback to static images
    const connectorLower = connectorSlug.toLowerCase().replace(/\s+/g, "-");
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
    
    return "/images/cable-customizer/n-male-main.png";
  };

  const handleAddToCart = () => {
    // Validate required fields
    if (!config.cableSeries || !config.cableType || !config.connector1 || !config.connector2 || !config.length || config.length <= 0) {
      toast.error("Please fill in all required fields (Cable Series, Cable Type, Connectors, and Length)");
      return;
    }

    const cableType = cableTypesMap.get(config.cableType);
    const connector1 = connectorsMap.get(config.connector1);
    const connector2 = connectorsMap.get(config.connector2);

    if (!cableType || !connector1 || !connector2) {
      toast.error("Invalid configuration. Please try again.");
      return;
    }

    const priceInDollars = calculatePrice({
      ...config,
      cableType: config.cableType,
      connector1: config.connector1,
      connector2: config.connector2,
      length: typeof config.length === 'number' ? config.length : 0,
    });

    // Convert to cents for cart (shopping cart expects prices in cents)
    const priceInCents = Math.round(priceInDollars * 100);

    const cableName = `Custom Cable - ${connector1.name} to ${connector2.name} (${config.length}ft, ${cableType.name})`;
    
    // Create a unique ID for this custom cable configuration
    const customId = `custom-cable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const cartItem = {
      id: customId,
      name: cableName,
      price: priceInCents,
      currency: "usd",
      image: "/images/cable-customizer/hero-cable.png",
      price_id: null,
      slug: "custom-cable",
      metadata: {
        cableSeries: config.cableSeries,
        cableType: config.cableType,
        cableTypeName: cableType.name,
        connector1: config.connector1,
        connector1Name: connector1.name,
        connector2: config.connector2,
        connector2Name: connector2.name,
        length: config.length,
        isCustom: true,
      },
    };

    // Add to cart with quantity
    addItemWithAutoOpen(cartItem, config.quantity);
    toast.success("Custom cable added to cart!");
  };

  const totalPrice = config.cableType && config.connector1 && config.connector2 && config.length && typeof config.length === 'number' && config.length > 0
    ? calculatePrice({
        ...config,
        cableType: config.cableType,
        connector1: config.connector1,
        connector2: config.connector2,
        length: config.length,
      })
    : 0;

  // Get connector prices for display
  const connector1Price = config.cableType && config.connector1 
    ? getConnectorPrice(config.connector1, config.cableType)
    : 0;
  const connector2Price = config.cableType && config.connector2
    ? getConnectorPrice(config.connector2, config.cableType)
    : 0;

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
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(61, 107, 184, 0.6) 0%, rgba(41, 88, 164, 0.4) 40%, rgba(31, 68, 128, 0.2) 70%, transparent 100%)',
                    filter: 'blur(40px)',
                    transform: 'scale(1.2)',
                  }}
                ></div>
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
                      const series = e.target.value;
                      setConfig((prev) => ({ 
                        ...prev, 
                        cableSeries: series,
                        cableType: "" // Reset cable type when series changes
                      }));
                    }}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none"
                  >
                    <option value="">Select Cable Series</option>
                    {data.cableSeries.map((series) => (
                      <option key={series.id} value={series.slug}>
                        {series.name}
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
                    onChange={(e) => setConfig((prev) => ({ ...prev, cableType: e.target.value }))}
                    disabled={!config.cableSeries}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    <option value="">
                      {config.cableSeries ? "Select Cable Type" : "Select Cable Series first"}
                    </option>
                    {availableCableTypes.map((type) => (
                      <option key={type.id} value={type.slug}>
                        {type.name}
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
                    onChange={(e) => setConfig((prev) => ({ ...prev, connector1: e.target.value }))}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none"
                  >
                    <option value="">Select Connector A</option>
                    {availableConnectors.map((connector) => (
                      <option key={connector.id} value={connector.slug}>
                        {connector.name}
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
                    onChange={(e) => setConfig((prev) => ({ ...prev, connector2: e.target.value }))}
                    className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none appearance-none"
                  >
                    <option value="">Select Connector B</option>
                    {availableConnectors.map((connector) => (
                      <option key={connector.id} value={connector.slug}>
                        {connector.name}
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
                      step="1"
                      value={config.length}
                      onChange={(e) => setConfig((prev) => ({ ...prev, length: e.target.value ? parseInt(e.target.value) : "" }))}
                      placeholder="Enter length in feet"
                      className="w-full py-3 px-4 rounded-lg border-2 border-gray-3 bg-white text-[#383838] focus:border-[#2958A4] focus:outline-none"
                    />
                    <p className="text-sm text-gray-4">Minimum length: 1 foot</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-[#383838] text-[16px] font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center divide-x divide-[#2958A4] border border-[#2958A4] rounded-full quantity-controls w-fit">
                    <button
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
                      onClick={() => setConfig((prev) => ({ ...prev, quantity: prev.quantity + 1 }))}
                      className="flex items-center justify-center w-10 h-10 text-[#2958A4] ease-out duration-200 hover:text-[#1F4480]"
                    >
                      <span className="sr-only">Increase quantity</span>
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                {totalPrice > 0 && (
                  <div className="mb-4 pt-4 border-t border-gray-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#383838] text-[18px] font-medium">Total Price:</span>
                      <span className="text-[#2958A4] text-[24px] font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-4 mt-1">Price per unit (quantity: {config.quantity})</p>
                  </div>
                )}

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
                          alt={connectorsMap.get(config.connector1)?.name || "Connector A"}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="mt-2 text-[#383838] text-sm text-center max-w-[100px]">
                        {connectorsMap.get(config.connector1)?.name || "Connector A"}
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
                          alt={connectorsMap.get(config.connector2)?.name || "Connector B"}
                          fill
                          className="object-contain scale-x-[-1]"
                        />
                      </div>
                      <p className="mt-2 text-[#383838] text-sm text-center max-w-[100px]">
                        {connectorsMap.get(config.connector2)?.name || "Connector B"}
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
                    <span className="font-medium">{cableSeriesMap.get(config.cableSeries)?.name || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cable Type:</span>
                    <span className="font-medium">{cableTypesMap.get(config.cableType)?.name || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connector A:</span>
                    <span className="font-medium">
                      {config.connector1 
                        ? `${connectorsMap.get(config.connector1)?.name || "Not selected"}${connector1Price > 0 ? ` ($${connector1Price.toFixed(2)})` : ""}`
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connector B:</span>
                    <span className="font-medium">
                      {config.connector2 
                        ? `${connectorsMap.get(config.connector2)?.name || "Not selected"}${connector2Price > 0 ? ` ($${connector2Price.toFixed(2)})` : ""}`
                        : "Not selected"}
                    </span>
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

