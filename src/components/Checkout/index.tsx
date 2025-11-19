"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { CheckoutFormProvider, CheckoutInput } from "./form";
import { useShoppingCart } from "use-shopping-cart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { EmptyCartIcon } from "@/assets/icons";
import CheckoutPaymentArea from "./CheckoutPaymentArea";
import CheckoutAreaWithoutStripe from "./CheckoutAreaWithoutStripe";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutMain() {
  const session = useSession();
  const { register, formState, watch, control, handleSubmit, setValue } =
    useForm<CheckoutInput>({
      defaultValues: {
        shippingMethod: {
          name: "free",
          price: 0,
        },
        paymentMethod: "bank",
        couponDiscount: 0,
        couponCode: "",
        billing: {
          address: {
            street: "",
            apartment: "",
          },
          companyName: "",
          country: "",
          email: session.data?.user?.email || "",
          firstName: session.data?.user?.name || "",
          lastName: "",
          phone: "",
          regionName: "",
          town: "",
          createAccount: false,
        },
        shipping: {
          address: {
            street: "",
            apartment: "",
          },
          country: "",
          email: "",
          phone: "",
          town: "",
          countryName: "",
        },
        notes: "",
        shipToDifferentAddress: false,
      },
    });

  const { totalPrice = 0, cartDetails } = useShoppingCart();
  const cartIsEmpty = !cartDetails || Object.keys(cartDetails).length === 0;

  const shippingFee = watch("shippingMethod");
  const couponDiscount = ((watch("couponDiscount") || 0) * totalPrice) / 100;
  const amount = Math.max(0, ((totalPrice - couponDiscount) / 100) + (shippingFee?.price || 0));
  
  // Validate amount
  if (amount <= 0 && !cartIsEmpty) {
    console.error("Invalid checkout amount:", {
      totalPrice,
      couponDiscount,
      shippingFee: shippingFee?.price,
      amount,
      cartDetails
    });
  }

  if (cartIsEmpty) {
    return (
      <div className="py-20 mt-40">
        <div className="flex items-center justify-center mb-5">
          <EmptyCartIcon className="mx-auto text-blue" />
        </div>
        <h2 className="pb-5 text-2xl font-medium text-center text-dark">
          No items found in your cart to checkout.
        </h2>
        <Link
          href="/shop"
          className="w-96 mx-auto inline-flex items-center justify-center rounded-full border border-transparent bg-[#2958A4] text-white text-sm font-medium px-6 py-3 transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Check if amount is valid
  if (amount <= 0) {
    return (
      <div className="py-20 mt-40">
        <div className="flex items-center justify-center mb-5">
          <EmptyCartIcon className="mx-auto text-red" />
        </div>
        <h2 className="pb-5 text-2xl font-medium text-center text-dark">
          Invalid cart total. Please check your cart items.
        </h2>
        <p className="text-center text-gray-600 mb-5">
          Some products may not have prices set. Please remove items without prices or contact support.
        </p>
        <Link
          href="/shop"
          className="w-96 mx-auto inline-flex items-center justify-center rounded-full border border-transparent bg-[#2958A4] text-white text-sm font-medium px-6 py-3 transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return amount > 0 ? (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(amount),
        currency: "usd",
      }}
    >
      <CheckoutFormProvider
        value={{
          register,
          watch,
          control,
          setValue,
          errors: formState.errors,
          handleSubmit,
        }}
      >
        <CheckoutPaymentArea amount={amount} />
      </CheckoutFormProvider>
    </Elements>
  ) : (
    <CheckoutFormProvider
      value={{
        register,
        watch,
        control,
        setValue,
        errors: formState.errors,
        handleSubmit,
      }}
    >
      <CheckoutAreaWithoutStripe amount={amount} />
    </CheckoutFormProvider>
  );
}
