"use client";
import { CheckMarkIcon2 } from "@/assets/icons";
import { Category } from "@/types/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "../Header/icons";

type PropsType = {
  categories: Category[];
};

const CategoryDropdown = ({ categories }: PropsType) => {
  const [isOpen, setIsOpen] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams() || new URLSearchParams();
  const pathname = usePathname();

  const handleCategory = (categoryId: string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const categoryParam = params.get("category");

    if (isChecked) {
      params.set(
        "category",
        categoryParam ? `${categoryParam},${categoryId}` : categoryId
      );
    } else {
      const newParam = categoryParam
        ?.split(",")
        .filter((id) => id !== categoryId);

      if (newParam?.length) {
        params.set("category", newParam.join(","));
      } else {
        params.delete("category");
      }
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!categories.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 w-full ${
          isOpen && "shadow-filter"
        }`}
      >
        <span className="text-dark">Category</span>

        <ChevronDown
          className={`text-dark ease-out duration-200 ${isOpen && "rotate-180"}`}
        />
      </button>

      <div className="flex flex-col gap-3 py-6 pl-6 pr-5.5" hidden={!isOpen}>
        {categories.map((category) => (
          <label
            htmlFor={category.slug.current}
            key={category.slug.current}
            className="flex items-center justify-start gap-2 cursor-pointer group hover:text-blue"
          >
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={searchParams
                .get("category")
                ?.split(",")
                .includes(category.slug.current)}
              onChange={(e) => {
                handleCategory(category.slug.current, e.target.checked);
              }}
              id={category.slug.current}
            />

            <div
              aria-hidden
              className="cursor-pointer flex items-center justify-center rounded-sm w-4 h-4 border peer-checked:border-blue peer-checked:bg-blue bg-white border-gray-3 peer-checked:[&>*]:!block"
            >
              <CheckMarkIcon2 className="hidden" />
            </div>

            <span className="flex-1 peer-checked:text-blue">
              {category.title}
            </span>

            <span className="peer-checked:text-white peer-checked:bg-blue bg-gray-2 inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue">
              {category.productCount}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
