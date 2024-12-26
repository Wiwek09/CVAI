// ImageSkeleton.jsx
// import React from "react";

// const GridViewSkeleton = () => {
//   return (
//     <div className="w-[320px] h-[280px] bg-gray-300 animate-pulse rounded-md"></div>
//   );
// };

// export default GridViewSkeleton;

// ImageSkeleton.jsx
import React from "react";

const GridViewSkeleton = () => {
  // Define different heights for skeletons
  const skeletonHeights = ["h-56", "h-36", "h-64", "h-80", "h-56", "h-96"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {skeletonHeights.map((heightClass, index) => (
        <div
          key={index}
          className={`bg-gray-300  animate-pulse rounded-md ${heightClass}`}
        ></div>
      ))}
    </div>
  );
};

export default GridViewSkeleton;
