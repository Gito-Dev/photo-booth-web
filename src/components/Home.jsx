import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Github, Code2 } from "lucide-react";
import logo from "../assets/Icon.png";

const Home = () => {
  const navigate = useNavigate();

  const handleTakePhoto = () => {
    navigate("/photo-booth");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center space-y-6 flex-grow flex flex-col items-center justify-center">
        <img src={logo} alt="Capture The Second Logo" className="w-40 h-auto" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Capture The Second
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-2">
          Online Photo Booth
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={handleTakePhoto}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full shadow-lg text-xl transition-colors flex items-center gap-2"
          >
            Take Pics Now
          </button>
        </motion.div>
      </div>

      {/* Additional Information */}
      <div className="text-center text-gray-600 space-y-4 mb-8">
        <p className="text-sm">
          Your images are not stored anywhere. Privacy is paramount.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://gitodevelopment@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 flex items-center gap-1"
          >
            <Code2 className="w-4 h-4" />
            Developer
          </a>
          <a
            href="https://github.com/yourusername/photo-booth"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 flex items-center gap-1"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Made with ❤️ by{" "}
          <a
            href="https://gito.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-blue-600"
          >
            gito.dev
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
