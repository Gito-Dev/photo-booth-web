import { motion } from "framer-motion";

const Filters = ({ selectedFilter, setSelectedFilter }) => {
  const filters = [
    { name: "Invert", value: "invert" },
    { name: "Sepia", value: "sepia" },
    { name: "Grayscale", value: "grayscale" },
    { name: "None", value: "none", isCustom: true },
  ];

  return (
    <motion.div className="w-full max-w-md px-8 mt-2">
      <div className="bg-white p-8">
        <div className="flex flex-col gap-4 mb-8">
          <label className="text-sm text-gray-600 font-medium">
            Select Filter
          </label>
          <div className="grid grid-cols-2 gap-3">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`h-14 rounded-lg transition-all duration-200 flex items-center justify-center border-2 ${
                  selectedFilter === filter.value
                    ? "border-blue-500 scale-95"
                    : filter.isCustom
                    ? "border-dotted border-gray-300 hover:scale-95"
                    : "border-gray-300 hover:scale-95"
                }`}
                style={{
                  border: filter.isCustom ? "2px dashed #9CA3AF" : undefined,
                }}
              >
                <span className="text-sm font-medium text-gray-600">
                  {filter.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Filters;
