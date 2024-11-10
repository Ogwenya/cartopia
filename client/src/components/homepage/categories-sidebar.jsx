"use client";

import Link from "next/link";
import Sticky from "react-stickynode";

const CategoriesSidebar = ({ categories }) => {
  return (
    <Sticky enabled={true} top={80}>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.id}>
              <div
                class="text-center rounded bg-white py-4 flex flex-col items-center justify-start relative overflow-hidden cursor-pointer border-2 xl:border-transparent"
                role="button"
              >
                <div class="w-full h-20 flex items-center justify-center">
                  <span class="w-20 h-20 inline-block">
                    <img src={category.image_url} />
                  </span>
                </div>
                <span class="text-sm font-semibold text-heading text-center px-2.5 block">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Sticky>
  );
};

export default CategoriesSidebar;
