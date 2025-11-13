"use client";
import { useSession } from "next-auth/react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import Coupon from "./Coupon";
import Login from "./Login";
import Notes from "./Notes";
import PaymentMethod from "./PaymentMethod";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import { CheckoutInput, useCheckoutForm } from "./form";
import Orders from "./orders";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useShoppingCart } from "use-shopping-cart";

const CheckoutPaymentArea = ({ amount }: { amount: number }) => {
  const { handleSubmit } = useCheckoutForm();

  const { data: session } = useSession();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const { cartDetails } = useShoppingCart();

  // Create a PaymentIntent as soon as the page loads
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  // Handle checkout
  const handleCheckout = async (data: CheckoutInput) => {
    setLoading(true);
    setErrorMessage("");

    if (data.billing.createAccount) {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.billing.email,
          name: data.billing.firstName,
          password: "12345678",
        }),
      });
      const result = await response.json();
      if (!result?.success) {
        toast.error(
          `${result?.message} for creating account` || "Failed to register user"
        );
        setLoading(false);
        return;
      }
    }

    // Helper function to create order
    const createOrder = async (paymentStatus: "pending" | "paid") => {
      // Generate a unique orderId (could also be done on backend)
      const orderId = `ORD-${Date.now()}`;
    
      const orderData = {
        orderId, // unique order identifier
        status: paymentStatus, // e.g., "pending" or "paid"
        totalPrice: amount, // total order price (integer)
        userId: session?.user?.id || "", // user ID (string)
        userEmail: session?.user?.email || data.billing?.email, // user email
        productQuantity: Object.values(cartDetails ?? {}).reduce((sum, item) => sum + item.quantity, 0).toString(),
        orderTitle: "Order from NextMerce", // or generate from cart/products
        country: data.billing?.country,
        city: data.billing?.town,
        line1: data.billing?.address?.street,
        line2: data.billing?.address?.apartment || "",
        products: Object.values(cartDetails ?? {}).map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item?.color || "",
          size: item?.size || "",
          attribute: item?.attribute || "",
        })),
      };

      console.log('orderData',orderData)
    
      try {
        const orderResponse = await fetch("/api/order/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        const result = await orderResponse.json();
    
        if (!result?.success) {
          toast.error(result?.message || "Failed to create order");
          return false;
        }
    
        toast.success("Order created successfully");
        router.push(`/success?amount=${amount}`);
        return true;
      } catch (err: any) {
        console.error("Order creation error:", err);
        toast.error(err?.message || "Failed to create order");
        return false;
      }
    };

    if (data.paymentMethod === "cod") {
      const success = await createOrder("pending");
      setLoading(false); // Stop loading regardless of success or failure
      if (!success) return; // Exit if order creation failed
      return;
    }

    if (!stripe || !elements) return;
    // Continue with Stripe Payment if NOT COD
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const siteUrl = process.env.SITE_URL || "http://www.localhost:3000";
    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${siteUrl}/success?amount=${amount}`, // Empty to prevent Stripe redirect
        },
        redirect: "if_required",
      });

      if (error) {
        console.log(error, "error in payment");
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const orderSuccess = await createOrder("paid");
        if (!orderSuccess) {
          toast.error(
            "Payment was successful, but order creation failed. Please contact support."
          );
          console.error(
            "Payment succeeded but order failed. PaymentIntent:",
            paymentIntent
          );
        }
      }
    } catch (err) {
      console.log(err, "err in payment");
      setErrorMessage("Order processing failed. Please try again.");
    }

    setLoading(false);
  };

  // Check if Stripe is loaded
  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="mt-48 text-center">
        <div className="flex items-center justify-center h-80">
          <div className="relative flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue border-t-transparent rounded-full animate-spin mb-3.5 text-center"></div>
            <p className="mt-4 text-lg font-semibold text-blue">
              Processing to checkout...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0 lg:columns-2 gap-7.5 xl:gap-8">
          {!Boolean(session?.user) && (
            <div className="mb-6">
              <Login />
            </div>
          )}
          <form onSubmit={handleSubmit(handleCheckout)}>
                <Billing />
                <Shipping />
                <Notes />
                
                <Orders />

                <Coupon />

                <ShippingMethod />

                <PaymentMethod amount={amount} />

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-full ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  {!loading ? `Pay $${amount}` : "Processing..."}
                </button>
            {errorMessage && (
              <p className="mt-2 text-center text-red">{errorMessage}</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default CheckoutPaymentArea;
