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

  // Handle parent category click - toggle all subcategories at once
  const handleParentCategory = (subcategories: Category[], isChecked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const categoryParam = params.get("category");

    if (isChecked) {
      // Add all subcategories
      const subcategorySlugs = subcategories.map(sub => sub.slug.current);
      const existingCategories = categoryParam ? categoryParam.split(",") : [];
      const newCategories = [...new Set([...existingCategories, ...subcategorySlugs])];
      params.set("category", newCategories.join(","));
    } else {
      // Remove all subcategories
      const subcategorySlugs = subcategories.map(sub => sub.slug.current);
      const existingCategories = categoryParam?.split(",") || [];
      const newCategories = existingCategories.filter(id => !subcategorySlugs.includes(id));

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

  // Check if all subcategories are selected for a parent category
  const areAllSubcategoriesChecked = (category: Category) => {
    if (!category.subcategories || category.subcategories.length === 0) {
      return false;
    }
    
    const categoryParam = searchParams.get("category");
    if (!categoryParam) {
      return false;
    }
    
    const checkedCategories = categoryParam.split(",");
    const allSubcategorySlugs = category.subcategories.map(sub => sub.slug.current);
    
    // Check if ALL subcategories are in the checked categories list
    return allSubcategorySlugs.every(subSlug => checkedCategories.includes(subSlug));
  };

  const getCategoryProductCount = (category: Category) => {
    const parentCount = typeof category.productCount === 'number' ? category.productCount : 0;
    
    if (category.subcategories && category.subcategories.length > 0) {
      const subcategoryCount = category.subcategories.reduce(
        (sum, sub) => {
          const count = typeof sub.productCount === 'number' ? sub.productCount : 0;
          return sum + count;
        },
        0
      );
      return parentCount + subcategoryCount;
    }
    return parentCount;
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
          className={`text-dark ease-in-out duration-300 transition-transform ${isOpen && "rotate-180"}`}
        />
      </button>

      <div 
        className={`flex flex-col gap-3 pl-6 pr-5.5 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
        }`}
      >
        {categories.map((category) => {
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          // Check if any subcategory is checked - if so, keep parent open
          const hasCheckedSubcategory = hasSubcategories && category.subcategories?.some(
            sub => isCategoryChecked(sub.slug.current)
          );
          const isOpen = openCategories[category.slug.current] ?? hasCheckedSubcategory ?? false;
          // For parent categories with subcategories, check if ALL subcategories are selected
          // For categories without subcategories, use the normal check
          const isChecked = hasSubcategories 
            ? areAllSubcategoriesChecked(category)
            : isCategoryChecked(category.slug.current);
          const totalProductCount = getCategoryProductCount(category);

          return (
            <div key={category.slug.current} className="flex flex-col gap-2">
              {/* Parent Category */}
              <div className="flex items-center justify-start gap-2">
                <label
                  htmlFor={category.slug.current}
                  className="flex items-center justify-start gap-2 cursor-pointer group hover:text-blue flex-1"
                  onClick={(e) => {
                    // Prevent label clicks from affecting dropdown state
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      // When parent is clicked, only toggle all subcategories, not the parent itself
                      if (category.subcategories && category.subcategories.length > 0) {
                        handleParentCategory(category.subcategories, e.target.checked);
                      } else {
                        handleCategory(category.slug.current, e.target.checked);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    id={category.slug.current}
                  />

                  <div
                    aria-hidden
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="cursor-pointer flex items-center justify-center rounded-sm w-4 h-4 border peer-checked:border-blue peer-checked:bg-blue bg-white border-gray-3 peer-checked:[&>*]:!block"
                  >
                    <CheckMarkIcon2 className="hidden" />
                  </div>

                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="peer-checked:text-blue"
                  >
                    {category.title} ({totalProductCount})
                  </span>
                </label>

                {hasSubcategories && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCategory(category.slug.current);
                    }}
                    className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                    aria-label="Toggle subcategories"
                  >
                    <ChevronDown
                      className={`text-dark text-xs transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {hasSubcategories && (
                <div
                  className={`flex flex-col gap-2 pl-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen 
                      ? "max-h-[1000px] opacity-100" 
                      : "max-h-0 opacity-0"
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
                          {subcategory.title} ({typeof subcategory.productCount === 'number' ? subcategory.productCount : 0})
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
