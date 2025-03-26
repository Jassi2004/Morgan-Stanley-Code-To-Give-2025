import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Optional: Lazy load the 3D model if you have a separate component
const BeeModel = lazy(() => import('/public/assets/animation/HappyIdle.glb'));

const BeeScrollAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const beeRef = useRef(null);
  const mixerRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized position configurations to prevent unnecessary re-renders
  const arrPositionModel = React.useMemo(() => [
    {
      id: 'section1',
      position: { x: 0, y: -1, z: 0 },
      rotation: { x: 0, y: 1.5, z: 0 }
    },
    {
      id: 'section2',
      position: { x: 1, y: -1, z: -5 },
      rotation: { x: 0.5, y: -0.5, z: 0 },
    },
    {
      id: 'section3',
      position: { x: -1, y: -1, z: -5 },
      rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
      id: 'section4',
      position: { x: 0.8, y: -1, z: 0 },
      rotation: { x: 0.3, y: -0.5, z: 0 },
    },
  ], []);

  // Optimize model movement with GSAP ScrollTrigger
  const modelMove = React.useCallback(() => {
    if (!beeRef.current) return;

    arrPositionModel.forEach((sectionConfig, index) => {
      ScrollTrigger.create({
        trigger: `#${sectionConfig.id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(beeRef.current.position, {
            x: sectionConfig.position.x,
            y: sectionConfig.position.y,
            z: sectionConfig.position.z,
            duration: 1.5,
            ease: "power2.inOut"
          });
          gsap.to(beeRef.current.rotation, {
            x: sectionConfig.rotation.x,
            y: sectionConfig.rotation.y,
            z: sectionConfig.rotation.z,
            duration: 1.5,
            ease: "power2.inOut"
          });
        },
        onLeaveBack: () => {
          if (index > 0) {
            const prevConfig = arrPositionModel[index - 1];
            gsap.to(beeRef.current.position, {
              x: prevConfig.position.x,
              y: prevConfig.position.y,
              z: prevConfig.position.z,
              duration: 1.5,
              ease: "power2.inOut"
            });
            gsap.to(beeRef.current.rotation, {
              x: prevConfig.rotation.x,
              y: prevConfig.rotation.y,
              z: prevConfig.rotation.z,
              duration: 1.5,
              ease: "power2.inOut"
            });
          }
        }
      });
    });
  }, [arrPositionModel]);
  useEffect(() => {
    let animationFrameId;
    const clock = new THREE.Clock();
  
    const animate = () => {
      const delta = clock.getDelta();
      
      // Ensure mixer exists before updating
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      // Only render if scene and camera exist
      if (sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Use requestAnimationFrame for smooth animation
      animationFrameId = requestAnimationFrame(animate);
    };
  
    animate();
  
    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Dispose of resources
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  useEffect(() => {
    // Throttle resize events
    const handleResize = throttle(() => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    }, 200);
  
    // Add resize listener
    window.addEventListener('resize', handleResize);
  
    // Improved error logging
    window.addEventListener('error', (event) => {
      console.error('Unhandled error:', event.error);
    });
  
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('error', handleResize);
    };
  }, []);
  
  // Throttle utility function
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
  useEffect(() => {
    // Scene setup with performance optimizations
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 13;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    // Optimized lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Model Loading with better error handling
    const loader = new GLTFLoader();
    loader.load(
      '/assets/animation/HappyIdle.glb',
      (gltf) => {
        const bee = gltf.scene;
        bee.traverse((child) => {
          if (child.isMesh) {
            console.log('Mesh material:', child.material);
            if (child.material) {
              child.material.color = new THREE.Color(0xffffff); // Set to white
              child.material.metalness = 0; // Reduce metalness
              child.material.roughness = 1; // Increase roughness
              child.material.emissive = new THREE.Color(0x000000); // No self-emission
              child.material.transparent = false; // Ensure not transparent
              child.material.opacity = 1; // Full opacity
              child.material.side = THREE.DoubleSide; // Render both sides
              child.material.needsUpdate = true;
            }
    

            child.castShadow = true;
            child.receiveShadow = true;
            // if (child.material) {
            //   child.material.side = THREE.DoubleSide; // Render both sides of the mesh
            //   child.material.needsUpdate = true;
            // }
          }
          
        });
        const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Increased intensity
        scene.add(ambientLight);
    
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        scene.add(bee);
        beeRef.current = bee;

        const mixer = new THREE.AnimationMixer(bee);
        mixerRef.current = mixer;
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();

        setIsLoaded(true);
        modelMove();
      },
      (progress) => {
        console.log('Loading model:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading 3D model:', error);
      }
    );

    // Optimized render loop
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      requestAnimationFrame(animate);
      
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Responsive handling
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [modelMove]);

  // Performance-optimized sections
  const renderSection = (id, bgColor, content) => (
    <div 
      id={id} 
      className={`section-for-bee h-screen flex items-center justify-center ${bgColor} scroll-smooth`}
      aria-label={`Section ${id}`}
    >
      {content}
    </div>
  );

  return (
    <div 
      className="relative w-full min-h-screen overflow-x-hidden" 
      aria-live="polite"
    >
      {/* 3D Canvas */}
      <div 
        ref={containerRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" 
        aria-hidden="true"
      />
      
      {/* Sections */}
      {renderSection('section1', '', 'Section 1')}
      {renderSection('section2', '', 'Section 2')}
      {renderSection('section3', '', 'Section 3')}
      {renderSection('section4', '', 'Section 4')}

      {/* Loading Indicator */}
      {!isLoaded && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-[100]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
        </div>
      )}
    </div>
  );
};

export default React.memo(BeeScrollAnimation);