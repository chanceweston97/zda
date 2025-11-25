"use client";
import { CheckMarkIcon2 } from "@/assets/icons";
import { Category } from "@/types/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "../Header/icons";

type PropsType = {
  categories: Category[];
};

const CategoryDropdown = ({ categories }: PropsType) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams() || new URLSearchParams();
  
  // Auto-open categories that have checked subcategories
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const checkedCategories = categoryParam.split(",");
      const newOpenCategories: Record<string, boolean> = {};
      
      categories.forEach(category => {
        if (category.subcategories && category.subcategories.length > 0) {
          // Check if any subcategory is checked
          const hasCheckedSubcategory = category.subcategories.some(
            sub => checkedCategories.includes(sub.slug.current)
          );
          if (hasCheckedSubcategory) {
            newOpenCategories[category.slug.current] = true;
          }
        }
      });
      
      setOpenCategories(prev => ({ ...prev, ...newOpenCategories }));
    }
  }, [searchParams, categories]);

  const router = useRouter();
  const pathname = usePathname();

  const toggleCategory = (categorySlug: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categorySlug]: !prev[categorySlug]
    }));
  };

  const handleCategory = (categoryId: string, isChecked: boolean, includeSubcategories = false, subcategories?: Category[]) => {
    const params = new URLSearchParams(searchParams);
    const categoryParam = params.get("category");

    if (isChecked) {
      let categoriesToAdd = [categoryId];
      
      // If parent category is checked, also add all subcategories
      if (includeSubcategories && subcategories && subcategories.length > 0) {
        categoriesToAdd.push(...subcategories.map(sub => sub.slug.current));
      }
      
      const existingCategories = categoryParam ? categoryParam.split(",") : [];
      const newCategories = [...new Set([...existingCategories, ...categoriesToAdd])];
      params.set("category", newCategories.join(","));
    } else {
      let categoriesToRemove = [categoryId];
      
      // If parent category is unchecked, also remove all subcategories
      if (includeSubcategories && subcategories && subcategories.length > 0) {
        categoriesToRemove.push(...subcategories.map(sub => sub.slug.current));
      }
      
      const existingCategories = categoryParam?.split(",") || [];
      const newCategories = existingCategories.filter(id => !categoriesToRemove.includes(id));

      if (newCategories.length) {
        params.set("category", newCategories.join(","));
      } else {
        params.delete("category");
      }
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isCategoryChecked = (categorySlug: string) => {
    const categoryParam = searchParams.get("category");
    return categoryParam?.split(",").includes(categorySlug) || false;
  };

  const getCategoryProductCount = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      const subcategoryCount = category.subcategories.reduce(
        (sum, sub) => sum + (sub.productCount || 0),
        0
      );
      return (category.productCount || 0) + subcategoryCount;
    }
    return category.productCount || 0;
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
        {categories.map((category) => {
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          // Check if any subcategory is checked - if so, keep parent open
          const hasCheckedSubcategory = hasSubcategories && category.subcategories?.some(
            sub => isCategoryChecked(sub.slug.current)
          );
          const isOpen = openCategories[category.slug.current] ?? hasCheckedSubcategory ?? false;
          const isChecked = isCategoryChecked(category.slug.current);
          const totalProductCount = getCategoryProductCount(category);

          return (
            <div key={category.slug.current} className="flex flex-col gap-2">
              {/* Parent Category */}
              <label
                htmlFor={category.slug.current}
                className="flex items-center justify-start gap-2 cursor-pointer group hover:text-blue"
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isChecked}
                  onChange={(e) => {
                    handleCategory(category.slug.current, e.target.checked, true, category.subcategories);
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

                {hasSubcategories && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCategory(category.slug.current);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Toggle subcategories"
                  >
                    <ChevronDown
                      className={`text-dark text-xs transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                <span className="peer-checked:text-white peer-checked:bg-blue bg-gray-2 inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue">
                  {totalProductCount}
                </span>
              </label>

              {/* Subcategories */}
              {hasSubcategories && (
                <div
                  className={`flex flex-col gap-2 pl-6 transition-all duration-200 ${
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {category.subcategories?.map((subcategory) => {
                    const isSubChecked = isCategoryChecked(subcategory.slug.current);

                    return (
                      <label
                        htmlFor={subcategory.slug.current}
                        key={subcategory.slug.current}
                        className="flex items-center justify-start gap-2 cursor-pointer group hover:text-blue"
                      >
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isSubChecked}
                          onChange={(e) => {
                            // Keep parent category open when checking subcategory
                            if (e.target.checked && !isOpen) {
                              setOpenCategories(prev => ({
                                ...prev,
                                [category.slug.current]: true
                              }));
                            }
                            handleCategory(subcategory.slug.current, e.target.checked);
                          }}
                          id={subcategory.slug.current}
                        />

                        <div
                          aria-hidden
                          className="cursor-pointer flex items-center justify-center rounded-sm w-4 h-4 border peer-checked:border-blue peer-checked:bg-blue bg-white border-gray-3 peer-checked:[&>*]:!block"
                        >
                          <CheckMarkIcon2 className="hidden" />
                        </div>

                        <span className="flex-1 peer-checked:text-blue text-sm">
                          {subcategory.title}
                        </span>

                        <span className="peer-checked:text-white peer-checked:bg-blue bg-gray-2 inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue">
                          {subcategory.productCount || 0}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDropdown;
