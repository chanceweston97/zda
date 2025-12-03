import CableCustomizerClient from "@/components/CableCustomizer/CableCustomizerClient";
import { Metadata } from "next";
import { getCableSeries, getCableTypes, getConnectors, imageBuilder } from "@/sanity/sanity-shop-utils";

export const metadata: Metadata = {
  title: "Cable Customizer | ZDAComm | Store",
  description: "Build your perfect custom cable. Select connectors, length, and specifications.",
};

// Disable static generation since this page depends on dynamic Sanity data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CableCustomizerPage = async () => {
  // Fetch cable customizer data from Sanity with error handling
  let cableSeries: any[] = [];
  let cableTypes: any[] = [];
  let connectors: any[] = [];

  try {
    const results = await Promise.allSettled([
      getCableSeries(),
      getCableTypes(),
      getConnectors(),
    ]);

    cableSeries = results[0].status === 'fulfilled' ? (results[0].value || []) : [];
    cableTypes = results[1].status === 'fulfilled' ? (results[1].value || []) : [];
    connectors = results[2].status === 'fulfilled' ? (results[2].value || []) : [];
  } catch (error) {
    console.error('Error fetching cable customizer data:', error);
  }

  // Ensure arrays are always arrays
  if (!Array.isArray(cableSeries)) cableSeries = [];
  if (!Array.isArray(cableTypes)) cableTypes = [];
  if (!Array.isArray(connectors)) connectors = [];

  // Transform data for the component with defensive coding
  const transformedData = {
    cableSeries: (Array.isArray(cableSeries) ? cableSeries : []).map((series: any) => ({
      id: series?._id || "",
      name: series?.name || "",
      slug: series?.slug || "",
    })),
    cableTypes: (Array.isArray(cableTypes) ? cableTypes : []).map((type: any) => {
      let imageUrl = null;
      try {
        if (type?.image && imageBuilder && typeof imageBuilder === 'function') {
          const builder = imageBuilder(type.image);
          if (builder && typeof builder.url === 'function') {
            imageUrl = builder.url() || null;
          }
        }
      } catch (error) {
        console.error('Error building image URL:', error);
      }
      
      return {
        id: type?._id || "",
        name: type?.name || "",
        slug: type?.slug || "",
        series: type?.series?.slug || "",
        seriesName: type?.series?.name || "",
        pricePerFoot: typeof type?.pricePerFoot === 'number' ? type.pricePerFoot : 0,
        image: imageUrl,
      };
    }),
    connectors: (Array.isArray(connectors) ? connectors : []).map((connector: any) => {
      let imageUrl = null;
      try {
        if (connector?.image && imageBuilder && typeof imageBuilder === 'function') {
          const builder = imageBuilder(connector.image);
          if (builder && typeof builder.url === 'function') {
            imageUrl = builder.url() || null;
          }
        }
      } catch (error) {
        console.error('Error building connector image URL:', error);
      }
      
      const pricing = Array.isArray(connector?.pricing) 
        ? connector.pricing.map((p: any) => ({
            cableTypeSlug: p?.cableType?.slug || "",
            cableTypeName: p?.cableType?.name || "",
            price: typeof p?.price === 'number' ? p.price : 0,
          }))
        : [];
      
      return {
        id: connector?._id || "",
        name: connector?.name || "",
        slug: connector?.slug || "",
        image: imageUrl,
        pricing,
      };
    }),
  };

  return (
    <main>
      <CableCustomizerClient data={transformedData} />
    </main>
  );
};

export default CableCustomizerPage;

