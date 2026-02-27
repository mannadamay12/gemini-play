import React, { useState } from "react";
import MapEmbed from "../components/MapEmbed";
import Presets from "../components/Presets";
import Caption from "../components/Caption";
import { presets } from "../utils/constants";

const Home = () => {
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommendation = async (message) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get recommendation');
      }

      if (data.location && data.caption) {
        setLocation(data.location);
        setCaption(data.caption);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <main className="relative w-full h-screen">
        <MapEmbed location={location} />
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-lg">
            {error}
          </div>
        )}
        <Caption caption={caption} />
        <Presets 
          presets={presets} 
          onClick={handleRecommendation} 
          disabled={isLoading}
        />
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-neutral-900 p-4 rounded-lg">
              Loading recommendation...
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

