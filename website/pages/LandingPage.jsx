import React, { useEffect, useState } from "react";
import LandingPageStory from "./LandingPageStory";
import AboutUs from "../components/landingPageComponents/AboutUs";
import FieldWorkGallery from "../components/landingPageComponents/FieldWorkGallery";
import ImageSlider from "../components/landingPageComponents/ImageSlider";
import Header from "../components/layout/Header";
import Navbar from "../components/layout/Navbar";


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
 {showNavbar && <Navbar />}
    {/* Adjust the top margin to account for the navbar */}
    <div className="w-full h-[900vh] mt-16"> {/* mt-16 to prevent content from being hidden behind navbar */}
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
