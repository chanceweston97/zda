import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Products",
    newTab: false,
    path: "/shop-with-sidebar",
    submenu: [
      {
        id: 61,
        title: "Antennas",
        newTab: false,
        path: "/antennas",
      },
      {
        id: 62,
        title: "Custom Cables",
        newTab: false,
        path: "/custom-cables",
      },
      {
        id: 64,
        title: "Connectors",
        newTab: false,
        path: "/connectors",
      },
    
    
    ]
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
    id: 3,
    title: "Our Story",
    newTab: false,
    path: "/our-story",
  },
  {
    id: 3,
    title: "Account",
    newTab: false,
    path: "/account",
  },
 
];
