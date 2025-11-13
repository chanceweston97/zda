import React from "react";
import Checkout from "@/components/Checkout";

import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
export const metadata: Metadata = {
  title: "Checkout Page | NextMerce | Next.js E-commerce Boilerplate",
  description: "This is Checkout Page for NextMerce Template",
  // other metadata
};

const CheckoutPage = () => {
  return (
    <main>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
