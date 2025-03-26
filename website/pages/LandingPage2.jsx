import React, { useRef } from 'react';
import ScrollReveal from '../src/blocks/TextAnimations/ScrollReveal/ScrollReveal'; // Assuming the component you provided is in this file
// D:\Morgan Stanley Code To Give 2025\website\src\blocks\TextAnimations\ScrollReveal\ScrollReveal.jsx
const ScrollRevealWithGif = () => {
  // const scrollContainerRef = useRef(null);

  return (
    <div className='bg-red-500 w-[200px]'>
    {Array.from({ length: 10 }).map((_, index) => (
      <ScrollReveal
        key={index}
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
      >
        ScrollReveal Component {index + 1}
      </ScrollReveal>
    ))}
  </div>
  );
};

export default ScrollRevealWithGif;