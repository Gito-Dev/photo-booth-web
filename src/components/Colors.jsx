import React from "react";
import { motion } from "framer-motion";

const Colors = ({ bgColor, setBgColor }) => {
  const softColors = [
    { name: "Soft Pink", value: "#fce7f3" },
    { name: "Soft Blue", value: "#e0f2fe" },
    { name: "Soft Green", value: "#dcfce7" },
    { name: "Soft Purple", value: "#f3e8ff" },
    { name: "Soft Yellow", value: "#fef9c3" },
    { name: "Choose", value: "custom", isCustom: true },
  ];

  return (
    <motion.div className="w-full max-w-md px-8">
      <div className="bg-white p-8">
        <div className="flex flex-col gap-4 mb-8">
          <label className="text-sm text-gray-600 font-medium">
            Background Color
          </label>
          <div className="grid grid-cols-2 gap-3">
            {softColors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  if (color.isCustom) {
                    document.getElementById("custom-color").click();
                  } else {
                    setBgColor(color.value);
                  }
                }}
                className={`h-14 rounded-lg transition-all duration-200 flex items-center justify-center border-2 ${
                  bgColor === color.value
                    ? "border-blue-500 scale-95"
                    : "border-transparent hover:scale-95"
                }`}
                style={{
                  backgroundColor: color.isCustom ? "#ffffff" : color.value,
                  border: color.isCustom ? "2px dashed #9CA3AF" : undefined,
                }}
              >
                <span className="text-sm font-medium text-gray-600">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
          <input
            type="color"
            id="custom-color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="hidden"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Colors;
