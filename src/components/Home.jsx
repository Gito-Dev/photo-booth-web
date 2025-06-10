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
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: "linear-gradient(135deg, #54877F 0%, #f6d69f 100%)",
      }}
    >
      <div className="text-center space-y-6 flex-grow flex flex-col items-center justify-center">
        <img src={logo} alt="Capture The Second Logo" className="w-40 h-auto" />
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(90deg, #54877F 0%, #da5d38 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Capture The Second
        </h1>
        <p className="text-lg sm:text-xl mt-2" style={{ color: "#54877F" }}>
          Online Photo Booth
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={handleTakePhoto}
            className="px-8 py-3 rounded-full shadow-lg text-xl transition-colors flex items-center gap-2"
            style={{ backgroundColor: "#da5d38", color: "#fff" }}
          >
            Take Pics Now
          </button>
        </motion.div>
      </div>

      {/* Additional Information */}
      <div className="text-center space-y-4 mb-8" style={{ color: "#54877F" }}>
        <p className="text-sm">
          Your images are not stored anywhere. Privacy is paramount.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:gitodevelopment@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
            style={{ color: "#54877F" }}
          >
            <Code2 className="w-4 h-4" />
            Developer
          </a>
          <a
            href="https://github.com/Gito-Dev/photo-booth-web"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
            style={{ color: "#da5d38" }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
        <p className="text-xs mt-4" style={{ color: "#f6d69f" }}>
          Made with ❤️ by{" "}
          <a
            href="https://gito.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: "#54877F" }}
          >
            gito.dev
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
