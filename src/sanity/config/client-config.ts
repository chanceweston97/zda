import { type ClientConfig } from 'next-sanity';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2023-03-09',
  useCdn: true,
  token: process.env.SANITY_PROJECT_API_TOKEN!,
  perspective: 'published',
} satisfies ClientConfig;

export default config;
