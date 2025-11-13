import { TrashIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useShoppingCart } from "use-shopping-cart";

const SingleItem = ({ item, toggle }: any) => {
  const { removeItem } = useShoppingCart();

  const handleRemoveFromCart = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5">
          <Image src={item.image} alt="product" width={100} height={100} />
        </div>

        <div>
          <h3 className="mb-1 font-medium duration-200 ease-out text-dark hover:text-blue">
            <Link onClick={toggle} href={`/products/${item.slug}`}>
              {" "}
              {item.name} ({item.quantity})
            </Link>
          </h3>
          <p className="text-custom-sm">Price: ${item.price / 100}</p>
        </div>
      </div>

      <button
        onClick={handleRemoveFromCart}
        aria-label="button for remove product from cart"
        className="flex items-center justify-center rounded-full max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SingleItem;
