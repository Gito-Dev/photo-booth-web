import { motion } from "framer-motion";
import heart from "../assets/heart.svg";
import rose from "../assets/rose.svg";

const Themes = ({ selectedTheme, setSelectedTheme }) => {
  const themes = [
    {
      name: "Hearts",
      value: "hearts",
      icon: heart,
      decorations: {
        topRight: heart,
        bottomLeft: heart,
      },
    },
    {
      name: "Roses",
      value: "roses",
      icon: rose,
      decorations: {
        topRight: rose,
        bottomLeft: rose,
      },
    },
    { name: "None", value: "none", isCustom: true },
  ];

  return (
    <motion.div className="w-full max-w-md px-8 mt-2">
      <div className="bg-white p-8">
        <div className="flex flex-col gap-4 mb-8">
          <label className="text-sm text-gray-600 font-medium">Themes</label>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => setSelectedTheme(theme)}
                className={`h-14 rounded-lg transition-all duration-200 flex items-center justify-center border-2 ${
                  selectedTheme?.value === theme.value
                    ? "border-blue-500 scale-95"
                    : theme.isCustom
                    ? "border-dotted border-gray-300 hover:scale-95"
                    : "border-gray-300 hover:scale-95"
                }`}
              >
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  {theme.icon && (
                    <img src={theme.icon} alt="" className="w-4 h-4" />
                  )}
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Themes;
