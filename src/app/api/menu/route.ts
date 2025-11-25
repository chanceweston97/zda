import { getCategoriesWithSubcategories } from "@/sanity/sanity-shop-utils";
import { Menu } from "@/types/Menu";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await getCategoriesWithSubcategories();
    
    // Build Products submenu from Sanity categories
    const productsSubmenu: Menu[] = categories.map((category, index) => {
      const categoryMenu: Menu = {
        id: 60 + index + 1,
        title: category.title,
        newTab: false,
        path: `/categories/${category.slug.current}`,
      };

      // Add subcategories if they exist
      if (category.subcategories && category.subcategories.length > 0) {
        categoryMenu.submenu = category.subcategories.map((sub, subIndex) => ({
          id: (60 + index + 1) * 10 + subIndex + 1,
          title: sub.title,
          newTab: false,
          path: `/categories/${sub.slug.current}`,
        }));
      }

      return categoryMenu;
    });

    const menuData: Menu[] = [
      {
        id: 1,
        title: "Products",
        newTab: false,
        path: "/shop",
        submenu: productsSubmenu,
      },
      {
        id: 2,
        title: "Cable Customizer",
        newTab: false,
        path: "/cable-customizer",
      },
      {
        id: 3,
        title: "Request a Quote",
        newTab: false,
        path: "/request-a-quote",
      },
      {
        id: 4,
        title: "Our Story",
        newTab: false,
        path: "/our-story",
      },
      {
        id: 5,
        title: "Contact Us",
        newTab: false,
        path: "/contact",
      },
    ];

    return NextResponse.json(menuData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return NextResponse.json([], { status: 500 });
  }
}
