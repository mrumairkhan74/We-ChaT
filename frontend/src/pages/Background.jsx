import React from "react";

const Background = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 backdrop-blur-sm bg-cover bg-center opacity-50"
      style={{
        backgroundImage: "url('./images/bg-main.png')"
      }}
    ></div>
  );
};

export default Background;
