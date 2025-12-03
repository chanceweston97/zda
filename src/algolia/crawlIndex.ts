import algoliasearch from "algoliasearch";
import { load } from "cheerio";

const appID = process.env.NEXT_PUBLIC_ALGOLIA_PROJECT_ID ?? "";
const apiKEY = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? "";
const INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? "";

// Check if Algolia is properly configured
const isAlgoliaConfigured = appID && apiKEY && INDEX;

// Only initialize client if configured
const client = isAlgoliaConfigured ? algoliasearch(appID, apiKEY) : null;
const index = client && isAlgoliaConfigured ? client.initIndex(INDEX) : null;

// Check if we're in a build context (static generation)
// During build, we should skip Algolia indexing to avoid permission errors
// We'll skip if:
// 1. We're in a build phase
// 2. Or if we're in production without runtime (static generation)
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  (typeof process !== 'undefined' && process.env.NEXT_PHASE) ||
  (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.VERCEL);

export const structuredAlgoliaHtmlData = async ({
  pageUrl = "",
  htmlString = "",
  title = "",
  type = "",
  imageURL = "",
  price = 0,
  discountedPrice = 0,
  reviews = 0,
  category = "",
  colors = [],
  sizes = [],
  _id = "",
  tags = [],
  description = [],
  thumbnails = [],
  previewImages = [],
  additionalInformation = {},
  customAttributes = {},
  status = true,
  offers = [],
}) => {
  // Skip Algolia indexing during build time or if not configured
  if (isBuildTime || !isAlgoliaConfigured || !index) {
    if (isBuildTime) {
      console.log('Skipping Algolia indexing during build time');
    }
    return null;
  }

  try {
    const c$ = load(htmlString).text();
    const data = {
      objectID: pageUrl,
      name: title,
      url: pageUrl,
      shortDescription: c$.slice(0, 7000),
      type: type,
      imageURL: imageURL,
      updatedAt: new Date().toISOString(),
      price: price,
      discountedPrice: discountedPrice,
      reviews: reviews,
      category: category,
      colors: colors,
      sizes: sizes,
      tags: tags,
      _id: _id,
      thumbnails: thumbnails,
      previewImages: previewImages,
      additionalInformation: additionalInformation,
      customAttributes: customAttributes,
      status: status,
      offers: offers,
      description: description,
    };

    await addToAlgolia(data);
    return data;
  } catch (error) {
    // Log error but don't throw - we don't want to break the build
    console.error("error in structuredAlgoliaHtmlData", error);
    // Return null instead of throwing to prevent build failures
    return null;
  }
};

async function addToAlgolia(record: any) {
  // Skip if not configured or during build
  if (!index || !isAlgoliaConfigured || isBuildTime) {
    return;
  }

  try {
    await index.saveObject(record, {
      autoGenerateObjectIDIfNotExist: true,
    });
  } catch (error: any) {
    // Log error but don't throw - check for permission errors specifically
    if (error?.message?.includes('rights') || error?.message?.includes('permission')) {
      console.warn('Algolia API key may not have write permissions. Skipping indexing.');
    } else {
      console.error("error in addToAlgolia", error);
    }
    // Don't throw - we don't want to break the build
  }
}

export const updateIndex = async (data: any) => {
  // Skip if not configured or during build
  if (!index || !isAlgoliaConfigured || isBuildTime) {
    return;
  }

  try {
    await index.partialUpdateObject(data);
  } catch (error: any) {
    // Log error but don't throw
    if (error?.message?.includes('rights') || error?.message?.includes('permission')) {
      console.warn('Algolia API key may not have write permissions. Skipping update.');
    } else {
      console.error("error in updateIndex", error);
    }
    // Don't throw - we don't want to break the build
  }
};
