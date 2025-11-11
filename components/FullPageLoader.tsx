import React from "react";

const FullPageLoader = () => {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#37a001] border-solid"></div>
    </div>
  );
};

export default FullPageLoader;
