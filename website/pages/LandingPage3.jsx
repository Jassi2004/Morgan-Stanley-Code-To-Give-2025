import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage3 = () => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    // Create GSAP timeline for animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        markers: true
      }
    });

    // Animate the image based on scroll position
    // We'll use scale and opacity for a simple effect
    tl.fromTo(imageRef.current, 
      { scale: 1, opacity: 1 },
      { scale: 1.2, opacity: 0.8, ease: 'none' }
    );

    // RAF animation loop for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[300vh] bg-black"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <img
          ref={imageRef}
          className="w-full h-full object-cover absolute inset-0 z-10"
          src="/assets/vids/guf.gif"
          alt="Scroll animation"
          onError={(e) => console.error('Image error:', e)}
        />
      </div>
    </div>
  );
};

export default LandingPage3;