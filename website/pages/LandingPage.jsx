import React from "react";
import LandingPageStory from "./LandingPageStory";
import AboutUs from "../components/landingPageComponents/AboutUs";
import FieldWorkGallery from "../components/landingPageComponents/FieldWorkGallery";
import ImageSlider from "../components/landingPageComponents/ImageSlider";


const LandingPage = () => {

  return (
    <>
    {/* <div className="w-full bg-red-500"> */}
    <div className="w-full h-[900vh]" >

    <LandingPageStory/>
    </div>
    <AboutUs/>
    <FieldWorkGallery/>
    <ImageSlider/>
    
      
    {/* </div> */}
    </>
  );
};

export default LandingPage;
