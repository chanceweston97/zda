import PreLoader from "@/components/Common/PreLoader";
import ScrollToTop from "@/components/Common/ScrollToTop";
import CacheRefreshButton from "@/components/Common/CacheRefreshButton";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
// import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Providers from "./Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-inter" suppressHydrationWarning>
      <body>
        <PreLoader />

        <Providers>
          <NextTopLoader
            color="#3C50E0"
            crawlSpeed={300}
            showSpinner={false}
            shadow="none"
          />

          <Header />

          <Toaster position="top-center" reverseOrder={false} />

          {children}
        </Providers>

        <ScrollToTop />
        <CacheRefreshButton />
        <Footer />
      </body>
    </html>
  );
}
