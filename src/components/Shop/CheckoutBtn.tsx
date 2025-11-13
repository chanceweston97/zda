import React from "react";
import { useShoppingCart } from "use-shopping-cart";

const CheckoutBtn = () => {
  const { cartDetails } = useShoppingCart();

  async function handleCheckoutClick(event: any) {
    event.preventDefault();

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify(cartDetails),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data?.url) {
        window.location.href = data?.url;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <button
      onClick={(e) => handleCheckoutClick(e)}
      className="bg-dark hover:bg-opacity-95  inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-full text-white ease-out duration-200 "
    >
      Checkout
    </button>
  );
};

export default CheckoutBtn;
