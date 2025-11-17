import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }: { title: string; pages: string[] }) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[100px]">
      <div>
        <div className="w-full px-4 py-2 mx-auto max-w-7xl sm:px-6 xl:px-0 xl:py-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h1 className="text-xl font-semibold capitalize text-dark sm:text-2xl xl:text-custom-2">
              {title}
            </h1>

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li
                    className="capitalize text-custom-sm last:text-blue"
                    key={key}
                  >
                    {page}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
