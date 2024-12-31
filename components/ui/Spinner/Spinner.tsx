"Use client";
import React, { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { SpinnerContext } from "@/app/dashboard/context/SpinnerContext";

function Spinner() {
  const context = useContext(SpinnerContext);

  const uploading = context?.uploading;

  if (!uploading) return null;
  return (
    <div>
      <div
        className="flex-col gap-4
        fixed inset-0 z-[9999] 
        flex items-center justify-center 
        bg-black/50 backdrop-blur-sm
      "
      >
        <div>
          <RotatingLines
            visible={true}
            // height="96"
            width="96"
            strokeColor="black"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            // wrapperStyle={{}}
            // wrapperClass=""
          />
        </div>
        <div>
          <span className="text-xl text-black">Uploading .....</span>
        </div>
      </div>
    </div>
  );
}

export default Spinner;
