import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-black gap-4">
      
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>

      {/* Text */}
      <p className="text-lg text-gray-300 tracking-wide">
        Loading content...
      </p>
    </div>
  );
};

export default Loading;