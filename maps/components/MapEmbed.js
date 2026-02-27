import React from "react";

const MapEmbed = ({ location }) => {
  // Check for API key
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-lg">
        <p>Please add GOOGLE_MAPS_API_KEY to your environment variables</p>
      </div>
    );
  }

//   if (!location) {
//     return (
//       <div className="w-full h-[450px] flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-lg">
//         <p>Select a destination to see the map</p>
//       </div>
//     );
//   }

//   const encodedLocation = encodeURIComponent(location);

  return (
    <div className="w-full h-[450px] rounded-lg overflow-hidden">
      <iframe
        id="embed-map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    &q=${location}`}
        // src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`}
      />
    </div>
  );
};

export default MapEmbed;

