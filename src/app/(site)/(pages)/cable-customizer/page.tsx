import CableCustomizer from "@/components/CableCustomizer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cable Customizer | ZDAComm | Store",
  description: "Build your perfect custom cable. Select connectors, length, and specifications.",
};

const CableCustomizerPage = () => {
  return (
    <main>
      <CableCustomizer />
    </main>
  );
};

export default CableCustomizerPage;

