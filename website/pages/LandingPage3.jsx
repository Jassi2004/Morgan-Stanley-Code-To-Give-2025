import React, { Suspense, useRef, useState, useEffect } from 'react';
// import { Canvas, useLoader } from '@react-three/fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';
// import { gsap } from 'gsap';

// function Bee() {
//   const group = useRef();
  
//   // Try using useLoader instead of useGLTF
//   const gltf = useLoader(GLTFLoader, '/assets/animation/cartoon_bopy.glb');
  
//   console.log('Loaded GLTF:', gltf);

//   const mixer = useRef(new THREE.AnimationMixer(gltf.scene));

//   const sectionPositions = [
//     { position: [0, -1, 0], rotation: [0, 1.5, 0] },
//     { position: [1, -1, -5], rotation: [0.5, -0.5, 0] },
//     { position: [-1, -1, -5], rotation: [0, 0.5, 0] },
//     { position: [0.8, -1, 0], rotation: [0.3, -0.5, 0] },
//   ];

//   useEffect(() => {
//     if (gltf.animations && gltf.animations.length > 0) {
//       const action = mixer.current.clipAction(gltf.animations[0]);
//       action.play();

//       return () => {
//         action.stop();
//         mixer.current.stopAllAction();
//       };
//     }
//   }, [gltf]);

//   useFrame((state, delta) => {
//     mixer.current.update(delta);
//   });

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!group.current) return;

//       const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
//       const sectionIndex = Math.min(
//         Math.floor(scrollPercentage * sectionPositions.length), 
//         sectionPositions.length - 1
//       );
      
//       const targetSection = sectionPositions[sectionIndex];
      
//       gsap.to(group.current.position, {
//         x: targetSection.position[0],
//         y: targetSection.position[1],
//         z: targetSection.position[2],
//         duration: 1,
//         ease: "power1.out"
//       });

//       gsap.to(group.current.rotation, {
//         x: targetSection.rotation[0],
//         y: targetSection.rotation[1],
//         z: targetSection.rotation[2],
//         duration: 1,
//         ease: "power1.out"
//       });
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return <primitive ref={group} object={gltf.scene} />;
// }

export default function BeeScrollExperience() {
  return (
    <div></div>
    // <div className="h-[400vh] bg-black">
    //   <Canvas 
    //     className="fixed top-0 left-0 w-full h-full pointer-events-none"
    //     camera={{ 
    //       fov: 10, 
    //       position: [0, 0, 13],
    //       near: 0.1,
    //       far: 1000 
    //     }}
    //   >
    //     <ambientLight intensity={1.3} />
    //     <directionalLight position={[500, 500, 500]} intensity={1} />
    //     <Suspense fallback={<div>Loading...</div>}>
    //       <Bee />
    //     </Suspense>
    //     <OrbitControls enabled={false} />
    //   </Canvas>

    //   <div className="absolute top-0 left-0 w-full">
    //     {[1, 2, 3, 4].map((section) => (
    //       <div 
    //         key={section} 
    //         className="h-screen flex items-center justify-center text-white text-9xl"
    //         style={{ backgroundColor: `rgba(${section * 50}, ${section * 30}, ${section * 20}, 0.5)` }}
    //       >
    //         Section {section}
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}