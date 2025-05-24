import React from 'react';

const LogoS = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-transparent">
      <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] bg-transparent backdrop-blur-sm shadow-md rounded-md flex items-center justify-center">
        <img
          src="./images/signup.png"
          alt="Loading"
          className="w-24 sm:w-32 md:w-40 animate-spin"
        />
      </div>
    </div>
  );
};

export default LogoS;
