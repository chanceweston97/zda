"use client";

import { CableCustomizerClient } from "@/components/CableCustomizer";
import { Metadata } from "next";
import { getCableSeries, getCableTypes, getConnectors, imageBuilder } from "@/sanity/sanity-shop-utils";

export const metadata: Metadata = {
  title: "Cable Customizer | ZDAComm | Store",
  description: "Build your perfect custom cable. Select connectors, length, and specifications.",
};

const CableCustomizerPage = async () => {
  // Fetch cable customizer data from Sanity
  const [cableSeries, cableTypes, connectors] = await Promise.all([
    getCableSeries(),
    getCableTypes(),
    getConnectors(),
  ]);

  // Transform data for the component
  const transformedData = {
    cableSeries: cableSeries.map((series: any) => ({
      id: series._id,
      name: series.name,
      slug: series.slug,
    })),
    cableTypes: cableTypes.map((type: any) => ({
      id: type._id,
      name: type.name,
      slug: type.slug,
      series: type.series?.slug || "",
      seriesName: type.series?.name || "",
      pricePerFoot: type.pricePerFoot || 0,
      image: type.image ? imageBuilder(type.image).url() : null,
    })),
    connectors: connectors.map((connector: any) => ({
      id: connector._id,
      name: connector.name,
      slug: connector.slug,
      image: connector.image ? imageBuilder(connector.image).url() : null,
      pricing: connector.pricing?.map((p: any) => ({
        cableTypeSlug: p.cableType?.slug || "",
        cableTypeName: p.cableType?.name || "",
        price: p.price || 0,
      })) || [],
    })),
  };

  return (
    <main>
      <CableCustomizerClient data={transformedData} />
    </main>
  );
};

export default CableCustomizerPage;

