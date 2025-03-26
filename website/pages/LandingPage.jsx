import React, { useEffect, useState } from "react";
import LandingPageStory from "./LandingPageStory";
import AboutUs from "../components/landingPageComponents/AboutUs";
import FieldWorkGallery from "../components/landingPageComponents/FieldWorkGallery";
import ImageSlider from "../components/landingPageComponents/ImageSlider";
import Navbar from "../components/layout/Navbar";
import Awards from "../components/landingPageComponents/Awards";
import { ChevronDown } from "lucide-react";
<<<<<<< HEAD
import OurProduct from "../components/landingPageComponents/OurProduct";
import Team from "./Team";
import LandingPage3 from "./LandingPage3";
=======
import OurProduct from "../components/ui/RollingGallery";
import Developers from "../components/landingPageComponents/Developers";
import Footer from "../components/landingPageComponents/Footer";
>>>>>>> 5c542d18011978061745525f1df056daf0eea1f1

const LandingPage = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledButton, setIsScrolledButton] = useState(false);
  const scrollThreshold = window.innerHeight * 7.8;

  const handleAutoScroll = () => {
    window.scrollTo({
      top: scrollThreshold + 80,
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > scrollThreshold) {
  //       setShowNavbar(true);
  //       setIsScrolledButton(true);
  //     } else {
  //       setShowNavbar(false);
  //       setIsScrolledButton(false);
  //     }
  //     if (window.scrollY > 100) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <>
      <div className="overflow-x-hidden relative">
        <LandingPage3/>
        {/* Scroll Prompt */}
        {/* {!isScrolled && (
          <div className="fixed top-10 left-0 w-full z-50 text-center transition-opacity duration-300">
          <p className="text-white text-3xl font-light tracking-widest opacity-70 animate-fade-in ">
            Scroll to Uncover the Journey
          </p>
        </div>
        )} */}

        {/* {showNavbar && <Navbar />} */}
        {/* Main Content */}
        {/* <div className="w-full h-[900vh] mt-16">
          <LandingPageStory/>
          </div> */}

        {/* Auto Scroll Button */}
        {/* {!isScrolledButton && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
          <button 
          onClick={handleAutoScroll}
          className="group relative w-24 h-24 border-2 border-white/50 rounded-full bg-transparent backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:border-white hover:scale-105"
          >
          <span className="absolute text-white text-xs font-light tracking-wider opacity-80 group-hover:opacity-100">
          Skip Story
          </span>
          <ChevronDown
          className="text-white/70 absolute animate-bounce group-hover:text-white" 
          size={24} 
          />
          </button>
          </div>
          )} */}

          <Navbar />
        <div className="bg-[#f3e9dc]">
<<<<<<< HEAD
          <ImageSlider/>
          <FieldWorkGallery/>

        </div>
          <OurProduct autoplay={true} />
        <div className="bg-red-500 h-500px w-500px">
=======
        <AboutUs />
          <ImageSlider />
          <FieldWorkGallery />
          <OurProduct autoplay={true} pauseOnHover={true} />
<Developers />
<Footer/>
>>>>>>> 5c542d18011978061745525f1df056daf0eea1f1
        </div>

          <Team />
      </div>
      {/* {isScrolled && (
        <div className="fixed top-10 left-0 w-full z-50 text-center transition-opacity duration-300">
          <p className="text-white text-3xl font-light tracking-widest opacity-70 animate-fade-in ">
            Scroll to Uncover the Journey
          </p>
        </div>
      )}
      <div className="w-full h-[900vh] mt-16">
        <LandingPageStory />
      </div> */}
    </>
  );
};

export default LandingPage;
