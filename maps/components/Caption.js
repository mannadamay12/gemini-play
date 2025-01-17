import React from "react";

const Caption = ({ caption }) => {
  if (!caption) return null;

  return (
    <div id="caption">
      <p>{caption}</p>
    </div>
  );
};

export default Caption;
