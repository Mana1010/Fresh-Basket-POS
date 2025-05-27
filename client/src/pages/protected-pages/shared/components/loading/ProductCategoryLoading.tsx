import React from "react";

function ProductCategoryLoading() {
  return (
    <div className="grid grid-cols-5 gap-1.5 overflow-x-auto">
      {new Array(3).fill(null).map((_, i) => (
        <div
          key={i}
          className={`custom-border rounded-md p-3 bg-zinc-400 min-h-12 basis-[20%] flex-shrink-0  animate-pulse
         `}
        ></div>
      ))}
    </div>
  );
}

export default ProductCategoryLoading;
