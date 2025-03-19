import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import CameraView from "./CameraView";
import Colors from "./Colors";
import PhotoStrip from "./PhotoStrip";
import ActionButtons from "./ActionButtons";

const PhotoBooth = () => {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [showPrintView, setShowPrintView] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [photoCount, setPhotoCount] = useState(5);
  const [customText, setCustomText] = useState("Your Text");
  const [textColor, setTextColor] = useState("#fef9c3");
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
      const photoWidth = 250; // Increased width for the downloaded image
      const photoHeight = (photoWidth * 3) / 4;
      const padding = 20;
      const headerHeight = 40; // Height for the top
      const footerHeight = 60; // Increased height for the bottom
      const photoGap = 10;

      // Calculate total height based on the number of photos
      const totalHeight =
        headerHeight +
        photoHeight * photos.length +
        photoGap * (photos.length - 1) +
        footerHeight +
        padding * 2;

      canvas.width = photoWidth + padding * 2;
      canvas.height = totalHeight;

      // Fill entire canvas with selected background color
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
            const numberWidth = 30;
            const numberHeight = 15;
            const numberX = canvas.width - padding - numberWidth - 5;
            const numberY = y + photoHeight - numberHeight - 5;

            // Draw rounded rectangle for number background
            ctx.beginPath();
            ctx.roundRect(numberX, numberY, numberWidth, numberHeight, 5);
            ctx.fill();

            // Draw number
            ctx.fillStyle = "#4B5563";
            ctx.font = "10px monospace";
            ctx.textAlign = "center";
            ctx.fillText(
              `${i + 1}/${photos.length}`,
              numberX + numberWidth / 2,
              numberY + 12
            );

            resolve();
          };
          img.src = photos[i];
        });
      }

      // Add custom text at the bottom
      ctx.fillStyle = textColor;
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        customText,
        canvas.width / 2,
        canvas.height - footerHeight + 20 // Positioned below the images
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
      <motion.div className="h-screen flex flex-col sm:flex-row bg-white">
        <div className="flex-1 flex flex-col items-center justify-center order-2 sm:order-1">
          <PhotoStrip
            photos={photos}
            bgColor={bgColor}
            customText={customText}
            textColor={textColor}
          />
          <div className="w-full max-w-md px-8 mt-4 sm:hidden">
            <ActionButtons
              onRetake={() => {
                setShowPrintView(false);
                setPhotos([]);
              }}
              onDownload={handleDownload}
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center border-t sm:border-t-0 sm:border-l order-1 sm:order-2">
          <div className="w-full max-w-md px-8">
            <Colors bgColor={bgColor} setBgColor={setBgColor} />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Custom Text
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                placeholder="Enter your text here"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Text Color
              </label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="w-full max-w-md px-8 mt-4 hidden sm:block">
            <ActionButtons
              onRetake={() => {
                setShowPrintView(false);
                setPhotos([]);
              }}
              onDownload={handleDownload}
            />
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
              <>
                <div className="flex justify-center mb-4">
                  <label className="mr-4">Number of Photos:</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="photoCount"
                        value={3}
                        checked={photoCount === 3}
                        onChange={() => setPhotoCount(3)}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">3</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="photoCount"
                        value={5}
                        checked={photoCount === 5}
                        onChange={() => setPhotoCount(5)}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">5</span>
                    </label>
                  </div>
                </div>
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
              </>
            )
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PhotoBooth;
