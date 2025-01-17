import React, { useState } from "react";
import MapEmbed from "../components/MapEmbed";
import Presets from "../components/Presets";
import Caption from "../components/Caption";
import { presets, systemInstructions } from "../utils/constants";

const Home = () => {
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");

  const handleRecommendation = async (message) => {
    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    setLocation(data.location);
    setCaption(data.caption);
  };

  return (
    <div>
      <MapEmbed location={location} />
      <Caption caption={caption} />
      <Presets presets={presets} onClick={handleRecommendation} />
    </div>
  );
};

export default Home;
