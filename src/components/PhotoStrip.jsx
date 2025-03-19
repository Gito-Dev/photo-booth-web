const PhotoStrip = ({ photos, bgColor }) => {
  return (
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
  );
};

export default PhotoStrip;
