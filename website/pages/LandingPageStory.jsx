import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LandingPageStory = () => {
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  textRefs.current = [];

  const storySequence = [
    "Meet Timmy...",
    "Timmy has autism...",
    "He often feels misunderstood...",
    "And sometimes lonely...",
    "The world can seem overwhelming...",
    "But all Timmy needed was understanding...",
    "And the right support...",
    "That's where Ishanya Foundation comes in...",
    "Creating a society built on Diversity, Equity & Inclusion",
    "For Persons with Disabilities",
    "At Ishanya, we believe that every individual has the right to live with dignity",
  ];

  const addToRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${storySequence.length * 500}`,
        scrub: true,
        pin: true,
        // markers: true,
      },
    });

    // Animate each line fade-in
    storySequence.forEach((_, index) => {
      tl.to(
        textRefs.current[index],
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        index * 0.5
      );
    });

    // Color change trigger (after third text appears)
    tl.to(
      {},
      {
        duration: 0.01,
      },
      3 * 0.5
    ); // trigger right after the third text

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* <div className="flex h-full"> */}
        <div ref={containerRef} className="w-full flex items-center py-5 mt-10 m-5">
          <div className="flex flex-col space-y-10 text-left">
            {storySequence.map((text, index) => (
              <h1
                key={index}
                ref={addToRefs}
                className="opacity-0 text-4xl md:text-6xl lg:text-3xl  ml-5 font-semibold transition-all duration-700 ease-in-out text-white"
              >
                {text}
              </h1>
            ))}
          </div>
        </div>

      {/* </div> */}
    </>
  );
};

export default LandingPageStory;
