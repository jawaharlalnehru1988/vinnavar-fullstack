import React from "react";

// Product Card Skeleton Loader (Matches exact size & height of organic product cards)
export const ProductSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-pulse flex flex-col justify-between h-[440px]"
        >
          <div className="space-y-4">
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center relative">
              <div className="w-12 h-12 rounded-full bg-slate-200/60"></div>
            </div>

            {/* Category Tag */}
            <div className="w-24 h-3 bg-slate-200 rounded-full"></div>

            {/* Product Title */}
            <div className="space-y-1.5">
              <div className="w-5/6 h-4 bg-slate-200 rounded-full"></div>
              <div className="w-2/3 h-4 bg-slate-200 rounded-full"></div>
            </div>

            {/* Short Description */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-slate-150 bg-slate-200/50 rounded-full"></div>
              <div className="w-4/5 h-2.5 bg-slate-150 bg-slate-200/50 rounded-full"></div>
            </div>

            {/* Variant Selector Box */}
            <div className="space-y-1 pt-1">
              <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
              <div className="w-full h-8 bg-slate-100 rounded-xl border border-slate-200/60"></div>
            </div>
          </div>

          {/* Footer Price & Add Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
            <div className="w-20 h-8 bg-emerald-100 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Offer Product Slider Skeleton Loader (Matches slider cards in Offers section)
export const OfferProductSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-3 h-[360px] flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-full h-36 bg-slate-100 rounded-xl flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-200/60"></div>
            </div>
            <div className="w-20 h-3 bg-slate-200 rounded-full"></div>
            <div className="w-4/5 h-4 bg-slate-200 rounded-full"></div>
            <div className="flex items-center justify-between">
              <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
              <div className="w-16 h-3 bg-slate-200 rounded-full"></div>
            </div>
          </div>
          <div className="w-full h-9 bg-emerald-100 rounded-xl mt-auto"></div>
        </div>
      ))}
    </div>
  );
};

// Category Card Skeleton Loader (Matches category grid cards)
export const CategorySkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse overflow-hidden h-[340px] flex flex-col justify-between"
        >
          <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-200/60"></div>
          </div>
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-3/4 h-5 bg-slate-200 rounded-full"></div>
              <div className="w-full h-3 bg-slate-200/60 rounded-full"></div>
              <div className="w-2/3 h-3 bg-slate-200/60 rounded-full"></div>
            </div>
            <div className="w-full h-9 bg-emerald-100 rounded-full mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Blog Post Skeleton Loader
export const BlogSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-4 h-[380px] flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-full h-48 bg-slate-100 rounded-2xl"></div>
            <div className="w-20 h-3 bg-emerald-200 rounded-full"></div>
            <div className="w-5/6 h-5 bg-slate-200 rounded-full"></div>
            <div className="w-full h-3 bg-slate-200/60 rounded-full"></div>
            <div className="w-3/4 h-3 bg-slate-200/60 rounded-full"></div>
          </div>
          <div className="w-28 h-4 bg-emerald-200 rounded-full pt-2"></div>
        </div>
      ))}
    </div>
  );
};

// Cart Item Skeleton Loader
export const CartSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="w-40 h-4 bg-slate-200 rounded-full"></div>
              <div className="w-24 h-3 bg-slate-200/70 rounded-full"></div>
            </div>
          </div>
          <div className="w-24 h-8 bg-slate-100 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
