import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollAnimation from '../components/landingPageComponents/ScrollAnimation'; // Your background component
import AboutUs from '../components/landingPageComponents/AboutUs';
import ImageSlider from '../components/landingPageComponents/ImageSlider';
import FieldWorkGallery from '../components/LandingPageComponents/FieldWorkGallery';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
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
    "At Ishanya, we believe that every individual has the right to live with dignity"
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
        markers: true,
      },
    });

    // Animate each line fade-in
    storySequence.forEach((_, index) => {
      tl.to(textRefs.current[index], {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, index * 0.5);
    });

    // Color change trigger (after third text appears)
    tl.to({}, {
      duration: 0.01,
      onComplete: () => {
        // Change first three lines to black when we reach the 4th text
        for (let i = 0; i < 3; i++) {
          textRefs.current[i].style.color = 'black';
        }
      }
    }, 3 * 0.5); // trigger right after the third text

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative">
      <ScrollAnimation />

      <div
        ref={containerRef}
        className="h-full w-1/3 flex items-center py-5 m-4"
      >
        <div className="flex flex-col space-y-6 text-left">
          {storySequence.map((text, index) => (
            <h1
              key={index}
              ref={addToRefs}
              className={`opacity-0 text-4xl md:text-6xl lg:text-3xl ml-5 font-semibold transition-all duration-700 ease-in-out ${
                index < 3 ? 'text-white' : 'text-black'
              }`}
            >
              {text}
            </h1>
          ))}
        </div>
      </div>
      {/* <div>
        <FieldWorkGallery/>
      </div> */}
      <AboutUs/>
      <ImageSlider/>
      <FieldWorkGallery/>
      {/* Optional content after scroll */}
      <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-[var(--color-bg-accent)] rounded-2xl shadow-lg border border-[var(--color-border-secondary)] transition-all">
  <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)] mb-6">
    Welcome! Choose Your Role
  </h2>
  
  <div className="flex flex-col gap-4">
    <a
      href="/student/register"
      className="w-full px-5 py-3 text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] focus:ring-offset-2"
    >
      Student Register
    </a>

    <a
      href="/student/login"
      className="w-full px-5 py-3 text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] focus:ring-offset-2"
    >
      Student Login
    </a>

    <a
      href="/employee/register"
      className="w-full px-5 py-3 text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] focus:ring-offset-2"
    >
      Employee Register
    </a>

    <a
      href="/employee/login"
      className="w-full px-5 py-3 text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] focus:ring-offset-2"
    >
      Employee Login
    </a>
  </div>
</div>

    </div>
  );
};

export default LandingPage;
