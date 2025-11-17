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
    const mainImage =
        product.previewImages && product.previewImages.length > 0
            ? imageBuilder(product.previewImages[0].image).url()
            : null;

    const datasheetImage =
        product.datasheetImage != null
            ? imageBuilder(product.datasheetImage).url()
            : null;

    const datasheetPdfUrl = (product as any).datasheetPdfUrl as
        | string
        | undefined;
    const forceDownloadUrl = datasheetPdfUrl
        ? `${datasheetPdfUrl}?dl=${product.slug?.current || "datasheet"}.pdf`
        : null;

    return (
        <section className="pb-20 pt-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row xl:px-0">
                {/* LEFT COLUMN – PRODUCT + DATASHEET */}
                <div className="flex w-full flex-col gap-6 lg:w-[35%]">
                    {/* Main product image */}
                    {mainImage && (
                        <div className="relative overflow-hidden rounded-[20px] bg-gray-100">
                            <Image
                                src={mainImage}
                                alt={product.name}
                                width={400}
                                height={400}
                                className="h-full w-full object-contain"
                                priority
                            />
                        </div>
                    )}

                    {/* Datasheet preview + button */}
                    <div className="flex flex-col gap-4">
                        {datasheetImage && (
                            <div className="relative overflow-hidden rounded-[20px] bg-gray-100">
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
                        )}

                        <button
                            type="button"
                            disabled={!datasheetPdfUrl}
                            className={`flex w-full items-center justify-center rounded-full px-8 py-3 text-[16px] font-medium leading-[26px] text-white ${datasheetPdfUrl ? "bg-[#2958A4] hover:bg-[#1F4480]" : "cursor-not-allowed bg-[#A1A9C3]"
                                }`}
                        >
                            {datasheetPdfUrl ? (
                                <a
                                    href={forceDownloadUrl || "#"}
                                    download

                                >
                                    Download Data Sheet
                                </a>
                            ) : (
                                "Download Data Sheet"
                            )}
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN – TABS + CONTENT */}
                <div className="w-full rounded-[20px] bg-[#F6F7F7] px-6 py-8 lg:w-[65%] lg:px-10 lg:py-10">
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
                    <div className="text-[16px] leading-[26px] text-black">
                        {activeTab === "description" ? (
                            product.description && product.description.length > 0 ? (
                                <div>
                                    <div>
                                        <PortableText value={product.description} />
                                    </div>
                                    <div className="mt-8 grid-cols-2">
                                        <div className="cols-1">
                                            <h4 className="text-black text-[19px] font-bold leading-7 tracking-[-0.38px]">Features</h4>
                                            {product.features.map((feature: string, index: number) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CircleCheckIcon className="fill-[#2958A4]" />
                                                    <span className="text-black text-[16px] font-medium leading-[26px]">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </div>
                                        <div className="cols-1">
                                            <h4 className="text-black text-[19px] font-bold leading-7 tracking-[-0.38px]">Features</h4>
                                            {product.application.map((feature: string, index: number) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CircleCheckIcon className="fill-[#2958A4]" />
                                                    <span className="text-black text-[16px] font-medium leading-[26px]">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </div>

                                    </div>

                                </div>
                            ) : (
                                <p>No description available.</p>
                            )
                        ) : product.specifications && product.specifications.length > 0 ? (
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
