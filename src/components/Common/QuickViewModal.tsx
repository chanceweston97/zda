"use client";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import {
  CircleCheckIcon,
  FullScreenIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
  XIcon,
} from "@/assets/icons";
import { updateproductDetails } from "@/redux/features/product-details";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { imageBuilder } from "@/sanity/sanity-shop-utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAutoOpenCart } from "../Providers/AutoOpenCartProvider";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const { addItemWithAutoOpen } = useAutoOpenCart();

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);
  const [activePreview, setActivePreview] = useState(0);

  // preview modal
  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  // add to cart
  const handleAddToCart = () => {
    const cartItem = {
      id: product.price_id,
      name: product.name,
      price: product.discountedPrice * 100,
      currency: "usd",
      image: product?.previewImages
        ? imageBuilder(product?.previewImages[0]?.image)?.url()
        : "",
      price_id: product?.price_id,
      slug: product?.slug?.current,
    };

    // @ts-ignore
    addItemWithAutoOpen(cartItem);
    toast.success("Product added to cart!");
    closeModal();
  };

  const handleAddToWishlist = () => {
    dispatch(
      addItemToWishlist({
        ...product,
        quantity: 1,
      })
    );
    toast.success("Product added to wishlist!");
    closeModal();
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: any) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      setQuantity(1);
    };
  }, [isModalOpen, closeModal]);

  return (
    <>
      {product?.name && (
        <div
          className={`${
            isModalOpen ? "z-99999" : "hidden"
          } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 backdrop-blur-sm transition-opacity duration-300 sm:px-8 px-4 py-5`}
        >
          <div className="flex items-center justify-center ">
            <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
              <button
                onClick={() => closeModal()}
                className="absolute top-0 right-0 flex items-center justify-center w-10 h-10 duration-150 ease-in rounded-full sm:top-6 sm:right-6 bg-meta text-body hover:text-dark"
              >
                <span className="sr-only">Close modal</span>

                <XIcon />
              </button>

              <div className="flex flex-wrap items-center gap-12.5">
                <div className="max-w-[526px] w-full">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-5">
                      {product?.thumbnails?.map((img: any, key: number) => (
                        <button
                          onClick={() => setActivePreview(key)}
                          key={key}
                          className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${
                            activePreview === key && "border-2 border-blue"
                          }`}
                        >
                          <Image
                            src={imageBuilder(img?.image).url()!}
                            alt="thumbnail"
                            width={61}
                            height={61}
                            className="aspect-square"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                      <div>
                        <button
                          onClick={handlePreviewSlider}
                          className="gallery__Image w-10 h-10 rounded-full bg-white shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-8 right-4 lg:right-8 z-50"
                        >
                          <span className="sr-only">Fullscreen</span>
                          <FullScreenIcon />
                        </button>

                        <Image
                          src={
                            imageBuilder(
                              product?.previewImages?.[activePreview]?.image
                            ).url() || ""
                          }
                          alt="products-details"
                          width={400}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-[445px] w-full">
                  <span className="inline-block text-custom-xs rounded-full font-medium text-white py-1 px-3 bg-green mb-6.5">
                    SALE 20% OFF
                  </span>

                  <h3 className="mb-4 text-xl font-semibold xl:text-heading-5 text-dark">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-5 mb-6">
                    <div className="flex items-center gap-1.5">
                      {/* <!-- stars --> */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={
                              product.reviews.length
                                ? "fill-[#FFA645]"
                                : "fill-gray-4"
                            }
                          />
                        ))}
                      </div>

                      <span>
                        <span className="font-medium text-dark">0 Rating </span>
                        <span className="text-dark-2">
                          {" "}
                          ( {product.reviews.length} reviews )
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.status ? (
                        <>
                          <CircleCheckIcon className="fill-green" />
                          <span className="text-green"> In Stock </span>
                        </>
                      ) : (
                        <>
                          <span className="text-body"> Out Of Stock </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="line-clamp-3">{product.shortDescription}</p>

                  <div className="flex flex-wrap justify-between gap-5 mt-6 mb-7.5">
                    <div>
                      <h4 className="font-semibold text-lg text-dark mb-3.5">
                        Price
                      </h4>

                      <span className="flex items-center gap-2">
                        <span className="text-lg font-medium line-through text-dark-4 xl:text-2xl">
                          ${product.price}
                        </span>
                        <span className="text-xl font-semibold text-dark xl:text-heading-4">
                          ${product.discountedPrice}
                        </span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg text-dark mb-3.5">
                        Quantity
                      </h4>

                      <div className="flex items-center  divide-x divide-gray-4 border border-gray-4 rounded-full">
                        <button
                          onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                          }
                          className="flex items-center justify-center w-10 h-10   text-dark ease-out duration-200 hover:text-blue"
                          disabled={quantity <= 1}
                        >
                          <span className="sr-only">Decrease quantity</span>
                          <MinusIcon className="w-4 text-gray-7 h-4" />
                        </button>

                        <span
                          className="flex items-center justify-center w-16 h-10    font-medium text-dark"
                          x-text="quantity"
                        >
                          {quantity}
                        </span>

                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="flex items-center justify-center w-10 h-10   text-dark ease-out duration-200 hover:text-blue"
                        >
                          <span className="sr-only">Increase quantity</span>
                          <PlusIcon className="w-4 text-gray-7 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      disabled={quantity < 1}
                      onClick={() => handleAddToCart()}
                      className="inline-flex py-3 font-medium text-white duration-200 ease-out rounded-full bg-blue px-7 hover:bg-blue-dark"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleAddToWishlist()}
                      className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white duration-200 ease-out rounded-full bg-dark hover:bg-opacity-95"
                    >
                      <HeartIcon />
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickViewModal;
