const PhotoStrip = ({ photos, bgColor }) => {
  // Define constants for photo dimensions and spacing
  const photoHeight = 150; // Adjusted height for each photo
  const photoGap = 10; // Gap between photos
  const totalHeight =
    photos.length * photoHeight + (photos.length - 1) * photoGap;

  return (
    <div
      id="photo-strip"
      className="p-4 flex items-center justify-center"
      style={{ backgroundColor: bgColor, height: `${totalHeight}px` }}
    >
      <div className="flex flex-col gap-1 max-w-[200px] scale-[0.8] sm:scale-100">
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
              />
            </div>
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg text-[10px] font-mono bg-white/80 text-gray-600">
              {index + 1}/{photos.length}
            </div>
          </div>
        ))}

        <div className="text-center text-[10px] font-mono mt-0.5 text-gray-600">
          PhotoBooth
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
