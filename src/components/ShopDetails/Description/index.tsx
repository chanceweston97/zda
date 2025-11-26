"use client";

import Image from "next/image";
import { useState } from "react";
import { PortableText } from "@portabletext/react";
import { imageBuilder } from "@/sanity/sanity-shop-utils";
import { Product } from "@/types/product";
import { CircleCheckIcon } from "@/assets/icons";

type Props = {
    product: Product;
};
export default function Description({ product }: Props) {
    const [activeTab, setActiveTab] = useState<"description" | "specifications">(
        "description"
    );

    const datasheetImage =
        product.datasheetImage != null && product.datasheetImage
            ? imageBuilder(product.datasheetImage).url()
            : null;

    const datasheetPdfUrl = (product as any).datasheetPdfUrl as
        | string
        | undefined;
    const forceDownloadUrl = datasheetPdfUrl
        ? `${datasheetPdfUrl}?dl=${product.slug?.current || "datasheet"}.pdf`
        : null;
    console.log("PRODUCTS", product)
    return (
        <section className="pb-5 pt-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-stretch xl:px-0">
                {/* LEFT COLUMN – DATASHEET */}
                <div className="flex w-full flex-col gap-4 lg:w-[35%]">
                    {/* Datasheet preview + button */}
                    {datasheetImage && (
                        <div className="relative overflow-hidden rounded-[20px] bg-gray-100 h-full flex flex-col">
                            <div className="flex-1 relative">
                                <Image
                                    src={datasheetImage}
                                    alt={`${product.name} datasheet`}
                                    width={400}
                                    height={518}
                                    className="h-full w-full object-contain cursor-pointer"
                                    onClick={() => {
                                        if (!datasheetPdfUrl) return;
                                        window.open(datasheetPdfUrl, "_blank", "noopener,noreferrer");
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                disabled={!datasheetPdfUrl}
                                className={`flex w-full items-center justify-center rounded-full border border-transparent bg-[#2958A4] text-white text-[16px] font-medium px-8 py-3 transition-colors mt-4 ${
                                    datasheetPdfUrl 
                                        ? "hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]" 
                                        : "cursor-not-allowed bg-[#A1A9C3] opacity-70"
                                }`}
                            >
                                {datasheetPdfUrl ? (
                                    <a
                                        href={forceDownloadUrl || "#"}
                                        download
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        Download Data Sheet
                                    </a>
                                ) : (
                                    "Download Data Sheet"
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN – TABS + CONTENT */}
                <div className="w-full rounded-[20px] bg-[#F6F7F7] px-6 py-8 lg:w-[65%] lg:px-10 lg:py-10 h-full flex flex-col">
                    {/* Tabs */}
                    <div className="mb-6 flex w-full justify-center">
                        <div className="w-full justify-center inline-flex rounded-full bg-[#E9ECF3] p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab("description")}
                                className={`w-full px-8 py-2 text-[16px] font-medium leading-[26px] ${activeTab === "description"
                                    ? "rounded-full bg-[#2958A4] text-white shadow-sm"
                                    : "text-[#2958A4]"
                                    }`}
                            >
                                Description
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("specifications")}
                                className={`w-full px-8 py-2 text-[16px] font-medium leading-[26px] ${activeTab === "specifications"
                                    ? "rounded-full bg-[#2958A4] text-white shadow-sm"
                                    : "text-[#2958A4]"
                                    }`}
                            >
                                Specifications
                            </button>
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="text-[16px] leading-[26px] text-black flex-1">
                        {activeTab === "description" ? (
                            product.description && product.description.length > 0 ? (
                                <div>
                                    <div className="font-medium">
                                        <PortableText value={product.description} />
                                    </div>
                                    {(product.features && Array.isArray(product.features) && product.features.length > 0) ||
                                     (product.applications && Array.isArray(product.applications) && product.applications.length > 0) ? (
                                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                                            {/* FEATURES */}
                                            {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                                                <div className="col-span-1">
                                                    <h4 className="text-black text-[19px] font-bold leading-7 tracking-[-0.38px]">
                                                        Features
                                                    </h4>

                                                    <ul className="mt-2 space-y-2">
                                                        {product.features.map((feature: string, index: number) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-black text-[16px] leading-[24px]">•</span>
                                                                <span className="text-black text-[16px] font-medium leading-[26px]">
                                                                    {feature}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* APPLICATIONS */}
                                            {product.applications && Array.isArray(product.applications) && product.applications.length > 0 && (
                                                <div className="col-span-1">
                                                    <h4 className="text-black text-[19px] font-bold leading-7 tracking-[-0.38px]">
                                                        Application
                                                    </h4>

                                                    <ul className="mt-2 space-y-2">
                                                        {product.applications.map((application: string, index: number) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-black text-[16px] leading-[24px]">•</span>
                                                                <span className="text-black text-[16px] font-medium leading-[26px]">
                                                                    {application}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : null}



                                </div>
                            ) : (
                                <p>No description available.</p>
                            )
                        ) : product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                            <PortableText value={product.specifications} />
                        ) : (
                            <p>No specifications available.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
