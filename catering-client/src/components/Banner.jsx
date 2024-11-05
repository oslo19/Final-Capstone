import React from "react";
import bannerImg from "/images/home/bannerlogo.png";

const Banner = () => {
  return (
    
    <div className="max-w-screen-2xl container mx-auto xl:px-24 ">
      
      <div className="py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8">

        {/* img */}
        <div className="md:w-1/1">
          <img src={bannerImg} alt="" />
        </div>

        {/* texts */}
        <div className="text-white md:w-1/2 px-4 space-y-2 ">
        <h2 className="md:text-7xl text-4xl font-bold md:leading-snug leading-snug">
          Make Your <span className="text-prime">Dream</span> <br/>Food With Us
          </h2>

        </div>
        
      </div>
    </div>
  );
};

export default Banner;
