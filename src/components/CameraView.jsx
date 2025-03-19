import Webcam from "react-webcam";
import camera from "../assets/camera.svg";

const CameraView = ({
  webcamRef,
  cameraPermission,
  isFlashing,
  countdown,
  isCapturing,
}) => {
  return (
    <div className="w-full max-w-xs sm:max-w-md h-[300px] sm:h-[400px] overflow-hidden rounded-lg shadow-xl bg-gray-100">
      <div className="relative w-full h-full">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className={`w-full h-full object-cover transition-opacity duration-300 scale-x-[-1] ${
            !cameraPermission ? "opacity-0" : "opacity-100"
          }`}
        />

        {isFlashing && (
          <div
            className="absolute inset-0 bg-white"
            style={{ animation: "flash 200ms ease-out" }}
          />
        )}

        {!cameraPermission && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <img src={camera} alt="Camera" className="w-16 h-16 opacity-30" />
            <p className="text-gray-500 text-sm text-center">
              Camera access is required <br /> for taking photos
            </p>
          </div>
        )}

        {isCapturing && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-white font-bold">
            {countdown}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;
