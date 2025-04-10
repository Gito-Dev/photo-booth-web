import React from "react";

const PhotoStrip = ({
  photos,
  bgColor,
  selectedFilter,
  customMessage,
  messageColor,
  selectedTheme,
}) => {
  const photoWidth = 250;
  const photoHeight = (photoWidth * 3) / 4;
  const photoGap = 10;
  const padding = 20;
  const headerHeight = 40;
  const footerHeight = 60;

  const totalHeight =
    headerHeight +
    photos.length * photoHeight +
    (photos.length - 1) * photoGap +
    footerHeight +
    padding * 2;

  const isFourPhotos = photos.length === 4;
  const adjustedPadding = isFourPhotos ? padding * 0.5 : padding;
  const adjustedTotalHeight = isFourPhotos
    ? totalHeight - (padding - adjustedPadding) * 2
    : totalHeight;

  return (
    <div
      id="photo-strip"
      className="p-4 flex items-center justify-center"
      style={{
        backgroundColor: bgColor,
        height: `${adjustedTotalHeight}px`,
        margin: "20px 0",
        width: "300px",
      }}
    >
      <div className="flex flex-col gap-1 max-w-[300px]">
        <div className="text-center font-mono mb-0.5 text-gray-600 text-sm">
          {new Date().toLocaleDateString()}
        </div>

        {photos.map((photo, index) => (
          <div key={index} className="relative">
            <div
              className="aspect-[4/3] overflow-hidden"
              style={{ height: `${photoHeight}px` }}
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover scale-x-[-1]"
                style={{ filter: selectedFilter }}
              />
              {selectedTheme?.decorations && (
                <>
                  <img
                    src={selectedTheme.icon}
                    alt=""
                    className="absolute -top-2 -right-2 w-12 h-12 transform rotate-45"
                    style={{ zIndex: 10 }}
                  />
                  <img
                    src={selectedTheme.icon}
                    alt=""
                    className="absolute -bottom-2 -left-2 w-12 h-12 transform -rotate-45"
                    style={{ zIndex: 10 }}
                  />
                </>
              )}
            </div>
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg text-[10px] font-mono bg-white/80 text-gray-600">
              {index + 1}/{photos.length}
            </div>
          </div>
        ))}

        <div
          className="text-center font-mono mt-2 text-sm"
          style={{ color: messageColor }}
        >
          {customMessage || "Your Message"}
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
