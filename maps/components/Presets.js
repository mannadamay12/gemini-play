import React from "react";

const Presets = ({ presets, onClick }) => (
  <div id="presets-container">
    <span id="take-me-somewhere">Take me somewhere...</span>
    <div id="presets">
      {presets.map(([name, message]) => (
        <button key={name} onClick={() => onClick(message)} className="preset">
          {name}
        </button>
      ))}
    </div>
  </div>
);

export default Presets;
