import React, { useEffect, useState } from "react";
import LandingPageStory from "./LandingPageStory";
import AboutUs from "../components/landingPageComponents/AboutUs";
import FieldWorkGallery from "../components/landingPageComponents/FieldWorkGallery";
import ImageSlider from "../components/landingPageComponents/ImageSlider";
import Navbar from "../components/layout/Navbar";
import Awards from "../components/landingPageComponents/Awards";
import { ChevronDown } from "lucide-react";


import Team from "./Team";
import LandingPage3 from "./LandingPage3";

import OurProduct from "../components/ui/RollingGallery";
import Developers from "../components/landingPageComponents/Developers";
import Footer from "../components/landingPageComponents/Footer";
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Add custom styles for the scrollbar
const customStyles = `
  .slick-slider {
    background: white;
  }
  .slick-slide {
    background: white;
  }
  .slick-track {
    background: white;
  }
  .slick-list {
    background: white;
  }
`;

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const images = [
    "https://res.cloudinary.com/dh2gwea4g/image/upload/v1742981609/yannis-h-uaPaEM7MiQQ-unsplash_xc9qoh.jpg",
    "https://res.cloudinary.com/dh2gwea4g/image/upload/v1742981965/nikhita-s-NsPDiPFTp4c-unsplash_nafumc.jpg",
    "https://res.cloudinary.com/dh2gwea4g/image/upload/v1742982105/church-of-the-king-j9jZSqfH5YI-unsplash_z0oa6e.jpg"
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, right: '20px', zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, left: '20px', zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="overflow-x-hidden relative bg-white">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative h-screen">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={`${index}-${currentSlide}`} className="relative h-screen">
                <div className="absolute inset-0">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative h-full flex items-center justify-center">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center text-white"
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-3xl md:text-5xl font-normal tracking-normal mb-6 leading-tight"
                    >
                      Making Society More Inclusive
                    </motion.h1>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="bg-[#E4B124] text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-[#f5c13c] transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                      Join Our Movement
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <div className="bg-[#f3e9dc]">
          <AboutUs />
          <ImageSlider />
          <FieldWorkGallery />
          <OurProduct autoplay={true} pauseOnHover={true} />
          <Developers />
          <Footer/>
        </div>

          <Team />
      </div>
    </>
  );
};

export default LandingPage;
