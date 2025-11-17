"use client";

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import {
  CheckMarkIcon,
  CircleCheckIcon,
  FullScreenIcon,
  HeartIcon,
  HeartSolid,
  MinusIcon,
  PlusIcon,
} from "@/assets/icons";
import { updateproductDetails } from "@/redux/features/product-details";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "@/redux/features/wishlist-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { imageBuilder } from "@/sanity/sanity-shop-utils";
import { Product } from "@/types/product";
import Image from "next/image";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useShoppingCart } from "use-shopping-cart";
import toast from "react-hot-toast";
import { useAutoOpenCart } from "../Providers/AutoOpenCartProvider";
import Breadcrumb from "../Common/Breadcrumb";
import Newsletter from "../Common/Newsletter";
import ReviewStar from "../Shop/ReviewStar";
import DetailsTabs from "./DetailsTabs";
import RecentlyViewedItems from "./RecentlyViewed";

type SelectedAttributesType = {
  [key: number]: string | undefined;
};

const ShopDetails = ({ product }: { product: Product }) => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeColor, setActiveColor] = useState("");
  const [mounted, setMounted] = useState(false);

  const { cartDetails } = useShoppingCart();
  const { addItemWithAutoOpen } = useAutoOpenCart();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);

  const isProductInCart = Object.values(cartDetails ?? {}).some(
    (cartItem) => cartItem.id === product._id
  );

  const isProductInWishlist = Object.values(wishlistItems ?? {}).some(
    (wishlistItem) => wishlistItem._id?.toString() === product._id?.toString()
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  const cartItem = {
    id: product._id,
    name: product.name,
    price: product.discountedPrice * 100,
    currency: "usd",
    image: product?.previewImages
      ? imageBuilder(product?.previewImages[0]?.image).url()
      : "",
    price_id: product?.price_id,
    slug: product?.slug?.current,
  };

  // pass the product here when you get the real data.
  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  const handleCheckout = async () => {
    // @ts-ignore
    addItemWithAutoOpen(cartItem, quantity);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify([
          {
            ...cartItem,
            quantity,
          },
        ]),
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
  };

  const handleAddToCart = async () => {
    // @ts-ignore
    addItemWithAutoOpen(cartItem, quantity);
  };

  const handleToggleWishlist = () => {
    if (isProductInWishlist) {
      dispatch(removeItemFromWishlist(product._id));
      toast.success("Product removed from wishlist!");
    } else {
      dispatch(
        addItemToWishlist({
          _id: product._id,
          name: product.name,
          price: product.price,
          discountedPrice: product.discountedPrice,
          thumbnails: product.thumbnails,
          status: product.status,
          quantity: 1,
          reviews: product.reviews || [],
          slug: product.slug,
        })
      );
      toast.success("Product added to wishlist!");
    }
  };

  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributesType>({});

  // Function to toggle the selected attribute for a specific item
  const toggleSelectedAttribute = (itemIndex: number, attributeId: string) => {
    setSelectedAttributes((prevSelected) => ({
      ...prevSelected,
      [itemIndex]: attributeId,
    }));
  };

  return (
    <>
      <Breadcrumb title={"Product Details"} pages={["product details"]} />

      <section className="relative pt-1 pb-20 overflow-hidden lg:pt-2 xl:pt-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0 ">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-16">
            <div className="w-full lg:w-1/2">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                <div>
                  <button
                    onClick={handlePreviewSlider}
                    aria-label="button for zoom"
                    className="gallery__Image w-11 h-11 rounded-full bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                  >
                    <FullScreenIcon className="w-6 h-6" />
                  </button>

                  <Image
                    src={
                      imageBuilder(
                        product?.previewImages[previewImg]?.image
                      ).url()!
                    }
                    alt={product.name}
                    width={400}
                    height={400}
                  />
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {product.thumbnails.map((item: any, key: any) => (
                  <button
                    onClick={() => setPreviewImg(key)}
                    key={key}
                    className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                      key === previewImg ? "border-blue" : "border-transparent"
                    }`}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={imageBuilder(item?.image).url()!}
                      alt="thumbnail"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* <!-- product content --> */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold sm:text-2xl xl:text-custom-3 text-dark">
                  {product.name}
                </h2>
              </div>

              

              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="mr-2 text-dark">
                  Price:{" "}
                  <span className="line-through text-gray-6">
                    ${product.price}
                  </span>{" "}
                  {""}
                  <span>${product.discountedPrice}</span>
                </span>
              </h3>

              <ul className="flex flex-col gap-2">
                {product.offers?.map((offer, key) => (
                  <li key={key} className="flex items-center gap-2.5">
                    <CircleCheckIcon className="fill-[#3C50E0]" />
                    {offer}
                  </li>
                ))}
              </ul>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                  {/* <!-- details item --> */}
                  <div className="flex items-center gap-4">
                    <div className="min-w-[65px]">
                      <h4 className="font-medium text-dark capitalize">
                        Color:
                      </h4>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {product?.colors?.map((color, key) => (
                        <label
                          key={key}
                          htmlFor={color}
                          className="flex items-center cursor-pointer select-none"
                        >
                          <div className="relative">
                            <input
                              type="radio"
                              name="color"
                              id={color}
                              className="sr-only"
                              onChange={() => {
                                setActiveColor(color);
                                setPreviewImg(key);
                              }}
                            />
                            <div className="flex items-center justify-center w-5.5 h-5.5 rounded-full">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  color === "white"
                                    ? "border border-gray-4"
                                    : ""
                                }`}
                                style={{ backgroundColor: color }}
                              >
                                {activeColor === color && (
                                  <svg
                                    className="w-2.5 h-2.5"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                  >
                                    <path
                                      d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                                      stroke={
                                        color === "white" ? "black" : "white"
                                      }
                                      strokeWidth="1.94437"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {product?.customAttributes?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-4">
                      <div className="min-w-[65px]">
                        <h4 className="font-medium text-dark capitalize">
                          {item?.attributeName}:
                        </h4>
                      </div>
                      <div className="flex items-center flex-wrap gap-2">
                        {item.attributeValues.map((value, valueIndex) => (
                          <button
                            key={valueIndex}
                            type="button"
                            onClick={() =>
                              toggleSelectedAttribute(itemIndex, value.id)
                            }
                            className={`px-2.5 py-1 h-6 items-center inline-flex justify-center rounded-full text-sm font-medium transition-all duration-200 border ${
                              selectedAttributes[itemIndex] === value.id
                                ? "bg-blue text-white border-blue shadow-sm"
                                : "bg-white text-dark border-gray-3 hover:border-blue hover:text-blue"
                            }`}
                          >
                            {value.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4.5">
                  <div className="flex items-center border rounded-full border-gray-3">
                    <button
                      aria-label="button for remove product"
                      className="flex items-center justify-center w-12 h-12 duration-200 ease-out hover:text-blue"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <MinusIcon />
                    </button>

                    <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="button for add product"
                      className="flex items-center justify-center w-12 h-12 duration-200 ease-out hover:text-blue"
                    >
                      <PlusIcon />
                    </button>
                  </div>

                  <button
                    onClick={() => handleCheckout()}
                    className="inline-flex py-3 font-medium text-white duration-200 ease-out rounded-full bg-blue px-7 hover:bg-blue-dark"
                  >
                    Purchase Now
                  </button>
                  <button
                    onClick={() => handleAddToCart()}
                    disabled={isProductInCart ? true : false}
                    className={`inline-flex font-medium text-white bg-dark py-3 px-7 rounded-full ease-out duration-200 hover:bg-dark-2 ${isProductInCart && "cursor-not-allowed bg-dark-2"}`}
                  >
                    {isProductInCart ? "Added" : "Add to Cart"}
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    aria-label="Add to wishlist"
                    className="flex items-center justify-center w-12 h-12 duration-200 ease-out border rounded-full border-gray-3 hover:text-white hover:bg-dark hover:border-transparent"
                  >
                    {mounted ? (
                      isProductInWishlist ? (
                        <HeartSolid className="w-5 h-5 text-blue" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <DetailsTabs product={product} />

      <RecentlyViewedItems />

      <Newsletter />
    </>
  );
};

export default ShopDetails;
