import React, { useEffect, useState } from "react";
import LandingPageStory from "./LandingPageStory";
import AboutUs from "../components/landingPageComponents/AboutUs";
import FieldWorkGallery from "../components/landingPageComponents/FieldWorkGallery";
import ImageSlider from "../components/landingPageComponents/ImageSlider";
import Navbar from "../components/layout/Navbar";
import Awards from "../components/landingPageComponents/Awards";


const LandingPage = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust this value based on the height of your LandingPageStory component
      const scrollThreshold = window.innerHeight * 7.8; 
      
      if (window.scrollY > scrollThreshold) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <> 
    <div className="overflow-x-hidden">

 {showNavbar && <Navbar />}
    {/* Adjust the top margin to account for the navbar */}
    <div className=" w-full h-[900vh] mt-16"> {/* mt-16 to prevent content from being hidden behind navbar */}
      <LandingPageStory/>
    </div>


    <AboutUs/>
    <div className="bg-[#f3e9dc]">

    <ImageSlider/>
    <FieldWorkGallery/>
    </div>
    <div className="bg-red-500 h-500px w-500px">
    {/* <Awards/> */}
      
      </div>
    </div>
    </>
  );
};

export default LandingPage;
