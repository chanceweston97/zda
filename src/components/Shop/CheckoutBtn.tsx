import React from "react";
import { useRouter } from "next/navigation";

const CheckoutBtn = () => {
  const router = useRouter();

  function handleCheckoutClick(event: any) {
    event.preventDefault();
    router.push("/checkout");
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
