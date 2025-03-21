import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import CameraView from "./CameraView";
import Colors from "./Colors";
import PhotoStrip from "./PhotoStrip";
import ActionButtons from "./ActionButtons";
import Filters from "./Filters";
import Themes from "./Themes";

const PhotoBooth = () => {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [showPrintView, setShowPrintView] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const photoCount = 3; // Fixed number of photos
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [customMessage, setCustomMessage] = useState("Your Message");
  const [messageColor, setMessageColor] = useState("#FFFFFF");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraPermission(true);
        return () => {
          stream.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        console.error("Camera access denied:", error);
        setCameraPermission(false);
      }
    };

    checkCameraPermission();
  }, []);

  const capturePhotos = async () => {
    setIsCapturing(true);
    const newPhotos = [];

    for (let i = 0; i < photoCount; i++) {
      setCountdown(3);
      for (let j = 3; j > 0; j--) {
        setCountdown(j);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setIsFlashing(true);
      const photo = webcamRef.current?.getScreenshot();
      if (photo) {
        newPhotos.push(photo);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsFlashing(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setPhotos(newPhotos);
    setIsCapturing(false);
    setShowPrintView(true);
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set dimensions for the downloaded image
      const photoWidth = 250;
      const photoHeight = (photoWidth * 3) / 4;
      const padding = 20;
      const headerHeight = 40;
      const footerHeight = 60;
      const photoGap = 10;

      const totalHeight =
        headerHeight +
        photoHeight * photos.length +
        photoGap * (photos.length - 1) +
        footerHeight +
        padding * 2;

      canvas.width = photoWidth + padding * 2;
      canvas.height = totalHeight;

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add date at top
      ctx.fillStyle = "#4B5563";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        new Date().toLocaleDateString(),
        canvas.width / 2,
        padding + 24
      );

      // First draw all photos
      for (let i = 0; i < photos.length; i++) {
        const y = headerHeight + (photoHeight + photoGap) * i + padding;

        // Draw photo
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.filter = selectedFilter !== "none" ? selectedFilter : "none";
            ctx.drawImage(img, padding, y, photoWidth, photoHeight);
            ctx.restore();
            resolve();
          };
          img.src = photos[i];
        });

        // Draw frame number
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        const numberWidth = 30;
        const numberHeight = 15;
        const numberX = canvas.width - padding - numberWidth - 5;
        const numberY = y + photoHeight - numberHeight - 5;
        ctx.beginPath();
        ctx.roundRect(numberX, numberY, numberWidth, numberHeight, 5);
        ctx.fill();
        ctx.fillStyle = "#4B5563";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          `${i + 1}/${photos.length}`,
          numberX + numberWidth / 2,
          numberY + 12
        );
      }

      // Then draw all decorations on top
      if (selectedTheme?.decorations) {
        await new Promise((resolve) => {
          const decorImg = new Image();
          decorImg.onload = () => {
            const decorSize = 48;

            for (let i = 0; i < photos.length; i++) {
              const y = headerHeight + (photoHeight + photoGap) * i + padding;

              // Top right decoration
              ctx.save();
              ctx.translate(canvas.width - padding + 8, y - 8);
              ctx.rotate(Math.PI / 4);
              ctx.drawImage(
                decorImg,
                -decorSize / 2,
                -decorSize / 2,
                decorSize,
                decorSize
              );
              ctx.restore();

              // Bottom left decoration
              ctx.save();
              ctx.translate(padding - 8, y + photoHeight + 8);
              ctx.rotate(-Math.PI / 4);
              ctx.drawImage(
                decorImg,
                -decorSize / 2,
                -decorSize / 2,
                decorSize,
                decorSize
              );
              ctx.restore();
            }
            resolve();
          };
          decorImg.src = selectedTheme.icon;
        });
      }

      // Add custom message at bottom
      ctx.fillStyle = messageColor;
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        customMessage || "Your Message",
        canvas.width / 2,
        canvas.height - padding
      );

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
      <motion.div className="h-screen flex flex-row bg-white">
        {/* Left side - PhotoStrip (30%) */}
        <div className="w-[30%] flex flex-col items-center justify-center">
          <PhotoStrip
            photos={photos}
            bgColor={bgColor}
            selectedFilter={selectedFilter}
            customMessage={customMessage}
            messageColor={messageColor}
            selectedTheme={selectedTheme}
          />
        </div>

        {/* Right side - Controls (70%) */}
        <div className="w-[70%] flex flex-col items-start justify-start pt-4 h-screen overflow-y-auto px-8">
          <div className="w-full max-w-4xl">
            {/* Grid container for Colors and Filters */}
            <div className="grid grid-cols-2 gap-4">
              <Colors bgColor={bgColor} setBgColor={setBgColor} />
              <Filters
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
              {/* Custom Message section with matching styling */}
              <motion.div className="w-full max-w-md px-8 mt-2">
                <div className="bg-white p-8">
                  <div className="flex flex-col gap-4 mb-8">
                    <label className="text-sm text-gray-600 font-medium">
                      Custom Message
                    </label>
                    <input
                      type="text"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter your message"
                    />
                    <input
                      type="color"
                      value={messageColor}
                      onChange={(e) => setMessageColor(e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
              <Themes
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            </div>

            <div className="mt-4">
              <ActionButtons
                onRetake={() => {
                  setShowPrintView(false);
                  setPhotos([]);
                }}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <motion.div className="w-full max-w-lg">
        <motion.div className="flex flex-col items-center gap-4">
          <CameraView
            webcamRef={webcamRef}
            cameraPermission={cameraPermission}
            isFlashing={isFlashing}
            countdown={countdown}
            isCapturing={isCapturing}
          />

          {!cameraPermission ? (
            <div className="text-center text-gray-600">
              <p>Please allow camera access in your browser</p>
              <p className="text-sm mt-2">
                Refresh the page if you denied access
              </p>
            </div>
          ) : (
            !isCapturing && (
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={capturePhotos}
                  className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600"
                >
                  <svg
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    className="w-8 h-8"
                  >
                    <g>
                      <path d="M26,20c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S30.4,20,26,20z" />
                      <path d="M46,14h-5.2c-1.4,0-2.6-0.7-3.4-1.8l-2.3-3.5C34.4,7,32.7,6,30.9,6h-9.8c-1.8,0-3.5,1-4.3,2.7l-2.3,3.5c-0.7,1.1-2,1.8-3.4,1.8H6c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h40c2.2,0,4-1.8,4-4V18C50,15.8,48.2,14,46,14z M26,40c-6.6,0-12-5.4-12-12s5.4-12,12-12s12,5.4,12,12S32.6,40,26,40z" />
                    </g>
                  </svg>
                </motion.button>
              </div>
            )
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PhotoBooth;
