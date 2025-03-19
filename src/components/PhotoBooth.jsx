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

    for (let i = 0; i < 5; i++) {
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

  if (showPrintView) {
    return (
      <motion.div className="h-screen flex bg-white">
        <div className="w-1/2 flex items-center justify-center">
          <PhotoStrip photos={photos} bgColor={bgColor} />
        </div>
        <div className="w-1/2 h-full flex items-center justify-center border-l">
          <div className="w-full max-w-md px-8">
            <Colors bgColor={bgColor} setBgColor={setBgColor} />
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
