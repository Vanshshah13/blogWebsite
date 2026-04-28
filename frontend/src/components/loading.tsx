"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50 gap-4">
      
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(250,204,21,0.6)]"></div>

      {/* Text */}
      <p className="text-lg text-gray-300 tracking-wide">
        Loading content...
      </p>
    </div>
  );
};

export default Loading;