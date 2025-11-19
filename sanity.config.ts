import schemas from "@/sanity/schemas";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { newsletterSubscribersPlugin } from "@/sanity/plugins/newsletter-subscribers";
import { quoteRequestsPlugin } from "@/sanity/plugins/quote-requests";

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE!,
  apiVersion: "2023-03-09",
  basePath: "/admin",
  plugins: [structureTool(), newsletterSubscribersPlugin(), quoteRequestsPlugin()],
  schema: { types: schemas },
});

export default config;
