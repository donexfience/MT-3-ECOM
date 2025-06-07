import React from "react";

const Loading = () => {
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="text-gray-700 font-medium">
              Loading product...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
