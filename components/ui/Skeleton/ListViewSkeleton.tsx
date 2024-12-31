import React from "react";
import { Card } from "../card";

const ListViewSkeleton = ({ variant }) => {
  if (variant === "listView") {
    return (
      <Card
        key="skeleton"
        className="px-5 py-6 flex justify-between w-full shadow-lg transform mb-3 bg-gray-100 animate-pulse"
      >
        {/* Basic Information Skeleton */}
        <div className="flex flex-col gap-2 w-[25%]">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
          <div className="flex gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Previous Experience Skeleton */}
        <div className="flex flex-col gap-4 w-[40%]">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
        </div>

        {/* Education, Certifications, Skills Skeleton */}
        <div className="flex flex-col gap-2 w-[25%]">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>

          <div className="h-4 bg-gray-300 rounded w-1/3 mt-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-1"></div>

          <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
          <div className="flex space-x-2">
            <div className="h-6 w-16 bg-gray-300 rounded-lg"></div>
            <div className="h-6 w-16 bg-gray-300 rounded-lg"></div>
            <div className="h-6 w-16 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </Card>
    );
  } else if (variant === "hover") {
    return (
      <>
        <div className="h-6 bg-gray-300 rounded w-3/4 my-5"></div>

        {/* Phone Section Skeleton */}
        <div className="flex space-x-4 items-center mb-4">
          <div className="bg-gray-300 rounded-full p-4 w-10 h-10"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* LinkedIn/GitHub Section Skeleton */}
        <div className="flex space-x-4 items-center mb-4">
          <div className="bg-gray-300 rounded-full p-4 w-10 h-10"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Experience Section Skeleton */}
        <div className="mb-4">
          <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="h-3 bg-gray-300 rounded w-3/4 my-2 ml-3"
            ></div>
          ))}
        </div>

        {/* Skills Section Skeleton */}
        <div className="mb-4">
          <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-3 bg-gray-300 rounded w-1/2 my-2 ml-3"
            ></div>
          ))}
        </div>

        {/* Education Section Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-3 bg-gray-300 rounded w-3/4 my-2 ml-3"
            ></div>
          ))}
        </div>
      </>
    );
  } else if (variant === "archive") {
    return (
      <div>
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="flex justify-between mt-5 animate-pulse"
            >
              {/* Folder Name Skeleton */}
              <div className="w-1/3 h-5 bg-gray-300 rounded"></div>

              {/* Button Skeleton */}
              <div className="w-20 h-5 bg-gray-300 rounded"></div>
            </div>
          ))}
      </div>
    );
  }
};

export default ListViewSkeleton;
