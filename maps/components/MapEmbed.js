import React from "react";

const MapEmbed = ({ location }) => {
  if (!location) return null;

  const encodedLocation = encodeURIComponent(location);

  return (
    <iframe
      id="embed-map"
      width="600"
      height="450"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`}
    ></iframe>
  );
};

export default MapEmbed;
