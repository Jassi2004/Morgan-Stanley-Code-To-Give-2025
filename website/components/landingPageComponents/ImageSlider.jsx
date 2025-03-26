import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const images = [
  { id: "01", url: "/assets/imagesLanding/Awareness/1.jpeg" },
  { id: "02", url: "/assets/imagesLanding/Awareness/2.jpeg" },
  { id: "03", url: "/assets/imagesLanding/Awareness/3.jpeg" },
  { id: "04", url: "/assets/imagesLanding/Awareness/4.jpeg" },
  { id: "05", url: "/assets/imagesLanding/Awareness/5.jpeg" },
  { id: "06", url: "/assets/imagesLanding/Awareness/6.jpeg" },
  { id: "07", url: "/assets/imagesLanding/Awareness/7.jpeg" },
  { id: "08", url: "/assets/imagesLanding/Awareness/8.jpeg" },
  { id: "09", url: "/assets/imagesLanding/Awareness/9.jpeg" },
  { id: "10", url: "/assets/imagesLanding/Awareness/10.jpeg" },
  { id: "11", url: "/assets/imagesLanding/Awareness/11.jpeg" }
];

function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [springProps, api] = useSpring(() => ({ x: 0 }));

  const handleNext = () => {
    if (index < images.length - 5) {
      setIndex(index + 1);
      api.start({ x: -(index + 1) * 200 });
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      api.start({ x: -(index - 1) * 200 });
    }
  };

  return (
    <div className=" relative overflow-hidden w-full h-[500px] max-w-4xl mx-auto ">
       <h2 className="text-5xl font-bold text-gray-700 mt-20 my-12 text-center animate-fade-down">
          Awareness
        </h2>
      <div className="flex items-center justify-between absolute inset-0 z-10">
        <button onClick={handlePrev} className="text-3xl text-gray-700 hover:text-black">
          <FiChevronLeft />
        </button>
        <button onClick={handleNext} className="text-3xl text-gray-700 hover:text-black">
          <FiChevronRight />
        </button>
      </div>
      <div className="overflow-hidden">
        <animated.div
          style={springProps}
          className="flex space-x-4 transition-transform duration-300"
        >
          {images.map((image) => (
            <div key={image.id} className="flex-shrink-0 w-56">
              <img
                src={image.url}
                alt={`Awareness ${image.id}`}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          ))}
        </animated.div>
      </div>
    </div>
  );
}

export default ImageSlider;
