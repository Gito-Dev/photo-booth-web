import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import camera from "../assets/camera.svg";

const softColors = [
  { name: "Soft Pink", value: "#fce7f3" },
  { name: "Soft Blue", value: "#e0f2fe" },
  { name: "Soft Green", value: "#dcfce7" },
  { name: "Soft Purple", value: "#f3e8ff" },
  { name: "Soft Yellow", value: "#fef9c3" },
  { name: "Choose", value: "custom", isCustom: true },
];

const cameraIcon = (
  <svg
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
    className="w-8 h-8" // Adjust size as needed
  >
    <g>
      <path d="M26,20c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S30.4,20,26,20z" />
      <path
        d="M46,14h-5.2c-1.4,0-2.6-0.7-3.4-1.8l-2.3-3.5C34.4,7,32.7,6,30.9,6h-9.8c-1.8,0-3.5,1-4.3,2.7l-2.3,3.5
        c-0.7,1.1-2,1.8-3.4,1.8H6c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h40c2.2,0,4-1.8,4-4V18C50,15.8,48.2,14,46,14z M26,40
        c-6.6,0-12-5.4-12-12s5.4-12,12-12s12,5.4,12,12S32.6,40,26,40z"
      />
    </g>
  </svg>
);

const PhotoBooth = () => {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [showPrintView, setShowPrintView] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [borderColor, setBorderColor] = useState("#000000");
  const [cameraPermission, setCameraPermission] = useState(false);
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

            // Save the current canvas state
            ctx.save();

            // Translate and scale to mirror the image
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            // Draw mirrored photo
            ctx.drawImage(img, padding, y, photoWidth, photoHeight);

            // Restore canvas state
            ctx.restore();

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

  const handleCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
    } catch (error) {
      console.error("Camera access denied:", error);
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
                      className="w-full h-full object-cover scale-x-[-1]"
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
              <div className="flex justify-center gap-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => {
                    setShowPrintView(false);
                    setPhotos([]);
                  }}
                  className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600"
                >
                  {cameraIcon}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={handleDownload}
                  className="w-20 h-20 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg hover:bg-purple-600"
                >
                  <svg
                    fill="currentColor"
                    width="32"
                    height="32"
                    viewBox="-5 -5 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMinYMin"
                    className="jam jam-download"
                  >
                    <path d="M8 6.641l1.121-1.12a1 1 0 0 1 1.415 1.413L7.707 9.763a.997.997 0 0 1-1.414 0L3.464 6.934A1 1 0 1 1 4.88 5.52L6 6.641V1a1 1 0 1 1 2 0v5.641zM1 12h12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2z" />
                  </svg>
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
        <motion.div
          key="camera-view"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Camera Canvas - Always visible */}
          <div className="w-[400px] h-[400px] overflow-hidden rounded-lg shadow-xl bg-gray-100">
            <div className="relative w-full h-full">
              {/* Camera Feed - Only shown after permission */}
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className={`w-full h-full object-cover transition-opacity duration-300 scale-x-[-1] ${
                  !cameraPermission ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Camera Icon Overlay - Only visible before permission granted */}
              {!cameraPermission && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <img
                    src={camera}
                    alt="Camera"
                    className="w-16 h-16 opacity-30"
                  />
                  <p className="text-gray-500 text-sm text-center">
                    Camera access is required <br /> for taking photos
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Button - Always below canvas */}
          {!cameraPermission ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={handleCameraAccess}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg"
            >
              Allow Access
            </motion.button>
          ) : (
            !isCapturing && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={capturePhotos}
                className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600"
              >
                {cameraIcon}
              </motion.button>
            )
          )}

          {/* Countdown Overlay */}
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
      </motion.div>
    </div>
  );
};

export default PhotoBooth;
