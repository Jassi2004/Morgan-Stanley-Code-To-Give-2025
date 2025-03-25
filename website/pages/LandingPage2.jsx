import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollVideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    gsap.to(video, {
      scrollTrigger: {
        trigger: video,
        start: 'top center', // Start when the video enters the center of the viewport
        end: 'bottom center', // End when it leaves the center
        scrub: 1, // Smooth scrubbing effect
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration; // Set video time based on scroll progress
          }
        },
      },
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  return (
    <div style={{ height: '200vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <video ref={videoRef} width="500" muted playsInline>
        <source src="/assets/vids/vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default ScrollVideoPlayer;
