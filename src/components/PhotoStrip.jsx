const PhotoStrip = ({ photos, bgColor, selectedFilter }) => {
  // Define constants for photo dimensions and spacing
  const photoWidth = 250; // Match the width used in the download
  const photoHeight = (photoWidth * 3) / 4; // Maintain the aspect ratio
  const photoGap = 10; // Gap between photos
  const padding = 20; // Padding used in the download
  const headerHeight = 40; // Height for the top
  const footerHeight = 60; // Height for the bottom

  // Adjust total height based on the number of photos
  const totalHeight =
    headerHeight +
    photos.length * photoHeight +
    (photos.length - 1) * photoGap +
    footerHeight +
    padding * 2;

  // Adjust layout for 4 photos
  const isFourPhotos = photos.length === 4;
  const adjustedPadding = isFourPhotos ? padding * 0.5 : padding; // Reduce padding for 4 photos
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
        margin: "20px 0", // Add margin to create space at the top and bottom
      }}
    >
      <div className="flex flex-col gap-1 max-w-[250px]">
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
            </div>
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg text-[10px] font-mono bg-white/80 text-gray-600">
              {index + 1}/{photos.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoStrip;
