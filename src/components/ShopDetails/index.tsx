"use client";

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import {
  FullScreenIcon,
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

import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useShoppingCart } from "use-shopping-cart";
import toast from "react-hot-toast";
import { useAutoOpenCart } from "../Providers/AutoOpenCartProvider";
import Breadcrumb from "../Common/Breadcrumb";
import Newsletter from "../Common/Newsletter";
import Description from "./Description";
import RequestAQuote from "../RequestAQuote";
import FaqSection from "../Home/Faq";
import { useRouter } from "next/navigation";

type SelectedAttributesType = {
  [key: number]: string | undefined;
};
const productDetailsHeroData = [
  {
    img: "/images/icons/shield-check.svg",
    title: "1 Year Warranty",
  },
  {
    img: "/images/icons/truck.svg",
    title: "Free Shipping on Orders $250+ (Lower 48)"
  },
  {
    img: "/images/icons/Vector.svg",
    title: "Complete Technical Support",
  },
];
const ShopDetails = ({ product }: { product: Product }) => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  const { cartDetails } = useShoppingCart();
  const { addItemWithAutoOpen } = useAutoOpenCart();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();


  useEffect(() => {
    setMounted(true);
  }, []);

  const isProductInCart = useMemo(
    () => Object.values(cartDetails ?? {}).some((cartItem) => cartItem.id === product._id),
    [cartDetails, product._id]
  );

  const isProductInWishlist = useMemo(
    () =>
      Object.values(wishlistItems ?? {}).some(
        (wishlistItem) => wishlistItem._id?.toString() === product._id?.toString()
      ),
    [wishlistItems, product._id]
  );

  // ---------- SAFE IMAGE HELPERS ----------

  const getImageUrl = (img: any | undefined | null): string | null => {
    if (!img) return null;
    try {
      const url = imageBuilder(img).url();
      return url && url.length > 0 ? url : null;
    } catch {
      return null;
    }
  };

  // main hero image: previewImages[previewImg] OR fallback to first thumbnail
  const mainImageUrl = useMemo(() => {
    const candidate =
      product.previewImages?.[previewImg]?.image ??
      product.previewImages?.[0]?.image ??
      product.thumbnails?.[0]?.image;

    return getImageUrl(candidate);
  }, [product.previewImages, product.thumbnails, previewImg]);

  // cart image: just reuse main hero image
  const cartImageUrl = mainImageUrl;
  const [gainIndex, setGainIndex] = useState(0);
  const currentGain = product.gainOptions?.[gainIndex] ?? "";
  const cartItem = {
    id: product._id,
    name: product.name,
    // if you removed discountedPrice from schema, change this to product.price
    price: (product.discountedPrice ?? product.price) * 100,
    currency: "usd",
    image: cartImageUrl ?? undefined,
    price_id: product?.price_id,
    slug: product?.slug?.current,
    gain: currentGain,
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
        <div className="w-full px-4 mx-auto max-w-[1340px] sm:px-6 xl:px-0 ">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-16">
            {/* LEFT: GALLERY */}
            <div className="w-full lg:w-1/2">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                <div>
                  <button
                    onClick={handlePreviewSlider}
                    aria-label="button for zoom"
                    className="gallery__Image w-11 h-11 rounded-full bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-[#2958A4] absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                  >
                    <FullScreenIcon className="w-6 h-6" />
                  </button>

                  {mainImageUrl && (
                    <Image
                      src={mainImageUrl}
                      alt={product.name}
                      width={400}
                      height={400}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {product.thumbnails
                  ?.filter((thumb: any) => !!thumb?.image)
                  .map((item: any, key: number) => {
                    const thumbUrl = getImageUrl(item.image);
                    if (!thumbUrl) return null;

                    return (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-[#2958A4] ${key === previewImg ? "border-[#2958A4]" : "border-transparent"
                          }`}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={thumbUrl}
                          alt="thumbnail"
                        />
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* RIGHT: PRODUCT CONTENT */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#2958A4] text-[48px] font-medium leading-[58px] tracking-[-1.92px]">
                  {product.name}
                </h2>
              </div>

              <h3 className="font-medium text-custom-1">
                <span className="mr-2 text-black">
                  <span className="text-black text-[36px] font-medium leading-9 tracking-[-1.08px] uppercase">${product.price}</span>
                </span>
              </h3>

              {/* <ul className="flex flex-col gap-2">
                {product.offers?.map((offer, key) => (
                  <li key={key} className="flex items-center gap-2.5">
                    <CircleCheckIcon className="fill-[#2958A4]" />
                    {offer}
                  </li>
                ))}
              </ul> */}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4.5 mt-3 py-2">
                  <span className="text-black font-satoshi text-[24px] font-bold leading-[26px]">{product.featureTitle}</span>
                  <ul className="flex flex-col gap-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-black text-[16px] leading-6">•</span>
                        <span className="text-black text-[16px] font-medium leading-[26px]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2 w-full px-6 space-y-4">
                    {/* Gain row */}
                    {product.gainOptions && product.gainOptions.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-black text-[20px] font-medium leading-[30px]">
                          Gain
                        </label>

                        <div className="flex items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-[#F6F7F7] px-3 py-2">
                          <button
                            type="button"
                            aria-label="Decrease gain"
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40"
                            onClick={() =>
                              setGainIndex((idx) => Math.max(0, idx - 1))
                            }
                            disabled={gainIndex <= 0}
                          >
                            <MinusIcon />
                          </button>

                          <span className="flex-1 text-[#383838] text-center text-[16px] leading-[26px] text-black">
                            {currentGain} dBi
                          </span>

                          <button
                            type="button"
                            aria-label="Increase gain"
                            className="flex h-10 w-10 text-[#383838] items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40"
                            onClick={() =>
                              setGainIndex((idx) =>
                                Math.min(product.gainOptions.length - 1, idx + 1)
                              )
                            }
                            disabled={gainIndex >= product.gainOptions.length - 1}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quantity row */}
                    <div className="space-y-2">
                      <label className="text-black text-[20px] font-medium leading-[30px]">
                        Quantity
                      </label>

                      <div className="flex items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-[#F6F7F7] px-3 py-2">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                          <MinusIcon />
                        </button>

                        <span className="flex-1 text-center text-[#383838] text-[16px] leading-[26px] text-black">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                          onClick={() => setQuantity((q) => q + 1)}
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isProductInCart}
                        className={`flex w-full items-center justify-center rounded-full bg-[#2958A4] px-6 py-3 text-[16px] font-medium leading-[26px] text-white transition-colors ${isProductInCart
                          ? "cursor-not-allowed opacity-70"
                          : "hover:bg-[#1F4480]"
                          }`}
                      >
                        {isProductInCart ? "Added to Cart" : "Add to Cart"}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push("/request-a-quote")}
                        className="flex w-full items-center justify-center rounded-full bg-[#2958A4] px-6 py-3 text-[16px] font-medium leading-[26px] text-white transition-colors hover:bg-[#1F4480]"
                      >
                        Request a Quote
                      </button>
                    </div>
                  </div>

                </div>


                {/* QUANTITY + ACTIONS */}
                {/* <div className="flex flex-wrap items-center gap-4.5">
                  <div className="flex items-center border rounded-full border-gray-3">
                    <button
                      aria-label="button for remove product"
                      className="flex items-center justify-center w-12 h-12 duration-200 ease-out hover:text-[#2958A4]"
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
                      className="flex items-center justify-center w-12 h-12 duration-200 ease-out hover:text-[#2958A4]"
                    >
                      <PlusIcon />
                    </button>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="inline-flex py-3 font-medium text-white duration-200 ease-out rounded-full bg-[#2958A4] px-7 hover:bg-[#1F4480]"
                  >
                    Purchase Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isProductInCart}
                    className={`inline-flex font-medium text-white bg-dark py-3 px-7 rounded-full ease-out duration-200 hover:bg-dark-2 ${isProductInCart && "cursor-not-allowed bg-dark-2"
                      }`}
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
                        <HeartSolid className="w-5 h-5 text-[#2958A4]" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full">
        <div className="w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mt-10">
            {productDetailsHeroData.map((item, index) => {
              const desktopAlign =
                index === 0
                  ? "sm:justify-end"      // first item right
                  : index === 1
                    ? "sm:justify-center"   // second item center
                    : "sm:justify-start";   // third item left

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 bg-[#F6F7F7] py-6 px-3 justify-center ${desktopAlign}`}
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Image 
                      src={item.img} 
                      alt="icon" 
                      width={40} 
                      height={40} 
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <h3 className="text-[#2958A4] text-[20px] font-medium leading-[30px]">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Description product={product} />
      <RequestAQuote />
      <FaqSection />
      <Newsletter />
    </>
  );
};

export default ShopDetails;
