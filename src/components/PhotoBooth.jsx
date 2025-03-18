import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";

const softColors = [
  { name: "Soft Pink", value: "#fce7f3" },
  { name: "Soft Blue", value: "#e0f2fe" },
  { name: "Soft Green", value: "#dcfce7" },
  { name: "Soft Purple", value: "#f3e8ff" },
  { name: "Soft Yellow", value: "#fef9c3" },
  { name: "Choose", value: "custom", isCustom: true },
];

const PhotoBooth = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [showPrintView, setShowPrintView] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [borderColor, setBorderColor] = useState("#000000");
  const webcamRef = useRef(null);

  const capturePhotos = async () => {
    setIsCapturing(true);
    const newPhotos = [];

    for (let i = 0; i < 5; i++) {
      setCountdown(3);
      for (let j = 3; j > 0; j--) {
        setCountdown(j);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      const photo = webcamRef.current?.getScreenshot();
      if (photo) {
        newPhotos.push(photo);
      }
    }

    setPhotos(newPhotos);
    setIsCapturing(false);
    setShowPrintView(true);
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Adjust dimensions and padding
      const photoWidth = 300;
      const photoHeight = (photoWidth * 3) / 4;
      const padding = 20;
      const headerHeight = 30;
      const footerHeight = 30;
      const photoGap = 15;

      // Calculate total height including all spaces
      const totalHeight =
        headerHeight +
        photoHeight * 5 +
        photoGap * 4 +
        footerHeight +
        padding * 2;

      canvas.width = photoWidth + padding * 2;
      canvas.height = totalHeight;

      // Fill entire canvas with selected background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add date at top
      ctx.fillStyle = "#4B5563";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        new Date().toLocaleDateString(),
        canvas.width / 2,
        padding + 18
      );

      // Load and draw each photo
      for (let i = 0; i < photos.length; i++) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const y = headerHeight + (photoHeight + photoGap) * i + padding;

            // Draw photo directly without white frame
            ctx.drawImage(img, padding, y, photoWidth, photoHeight);

            // Draw frame number with semi-transparent background
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            const numberWidth = 35;
            const numberHeight = 20;
            const numberX = canvas.width - padding - numberWidth - 5;
            const numberY = y + photoHeight - numberHeight - 5;

            // Draw rounded rectangle for number background
            ctx.beginPath();
            ctx.roundRect(numberX, numberY, numberWidth, numberHeight, 10);
            ctx.fill();

            // Draw number
            ctx.fillStyle = "#4B5563";
            ctx.font = "12px monospace";
            ctx.textAlign = "center";
            ctx.fillText(
              `${i + 1}/5`,
              canvas.width - padding - numberWidth / 2 - 5,
              y + photoHeight - 10
            );

            resolve();
          };
          img.src = photos[i];
        });
      }

      // Add PhotoBooth text at bottom
      ctx.fillStyle = "#4B5563";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PhotoBooth", canvas.width / 2, canvas.height - padding - 8);

      // Download the canvas
      const link = document.createElement("a");
      link.download = `photobooth-${new Date().getTime()}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 1.0);
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (showPrintView) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-screen flex bg-white"
      >
        {/* Left side - Photos (50% width) */}
        <div className="w-1/2 flex items-center justify-center">
          <div
            id="photo-strip"
            className="p-4 h-[90vh] flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex flex-col gap-1 max-w-[200px] scale-[0.8]">
              <div className="text-center font-mono mb-0.5 text-gray-600 text-sm">
                {new Date().toLocaleDateString()}
              </div>

              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg text-[10px] font-mono bg-white/80 text-gray-600">
                    {index + 1}/5
                  </div>
                </div>
              ))}

              <div className="text-center text-[10px] font-mono mt-0.5 text-gray-600">
                PhotoBooth
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Controls (50% width) */}
        <div className="w-1/2 h-full flex items-center justify-center border-l">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-8"
          >
            <div className="bg-white p-8">
              {/* Color Selection */}
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
                          // Trigger color input click when "Choose" is selected
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
                        backgroundColor: color.isCustom
                          ? "#ffffff"
                          : color.value,
                        border: color.isCustom
                          ? "2px dashed #9CA3AF"
                          : undefined,
                      }}
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
                {/* Hidden color input for custom color */}
                <input
                  type="color"
                  id="custom-color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="hidden"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => {
                    setShowPrintView(false);
                    setPhotos([]);
                    setIsCameraOpen(false);
                  }}
                  className="w-full bg-blue-500 text-white py-4 rounded-lg font-bold shadow-md"
                >
                  Take New Photos
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={handleDownload}
                  className="w-full bg-purple-500 text-white py-4 rounded-lg font-bold shadow-md"
                >
                  Download Photos
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-lg"
      >
        <AnimatePresence mode="wait">
          {!isCameraOpen ? (
            <motion.button
              key="open-camera"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => setIsCameraOpen(true)}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg"
            >
              Open Camera
            </motion.button>
          ) : (
            <motion.div
              key="camera-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative"
            >
              <div className="w-[400px] h-[400px] mx-auto overflow-hidden rounded-lg shadow-xl">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              </div>

              {!isCapturing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={capturePhotos}
                  className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-bold shadow-lg"
                >
                  Take Photos
                </motion.button>
              )}

              {isCapturing && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-white font-bold"
                >
                  {countdown}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PhotoBooth;
