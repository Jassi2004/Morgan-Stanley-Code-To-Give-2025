import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {

  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const leftElementsRef = useRef(null);
  const rightElementsRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [isColorMode, setIsColorMode] = useState(false);

  // Animation configuration
  const frameCount = 850;
  const imagesRef = useRef([]);
  const imageStatusRef = useRef([]);
  const currentFrameRef = useRef(0);
  const loadedImagesRef = useRef(0);
  const requestIdRef = useRef(null);
  const isScrollingRef = useRef(false);
  const storyTextRef = useRef(null);


  // Color transition point (40-45% of the scroll)
  const colorTransitionPoint = 0.4; // 42.5%

  // Constants for image loading strategy
  const CHUNK_SIZE = 20;
  const INITIAL_LOAD = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const storySequence = [];
    
    // Story text elements ref
    if (!storyTextRef.current) {
      // Create container for story text if it doesn't exist
      storyTextRef.current = document.createElement('div');
      storyTextRef.current.className = 'story-text-container absolute inset-0 flex items-center justify-center z-20 pointer-events-none';
      containerRef.current.appendChild(storyTextRef.current);
    }

    // Initialize canvas dimensions
    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight + 200;
    };

    // Get image path
    const getImagePath = (index) => {
      const formattedIndex = String(index + 1).padStart(4, "0");
      return `/assets/characterPngPics/0016.png${formattedIndex}.png`;
    };

    // Check if image is valid and not broken
    const isImageValid = (img) => {
      return (
        img && img.complete && img.naturalWidth !== 0 && img.naturalHeight !== 0
      );
    };

    // Setup story text animations
// Setup story text animations
const setupStorySequence = () => {
  // console.log("Setting up story sequence...");

  // Ensure storyTextRef exists and is properly set
  if (!storyTextRef.current) {
    storyTextRef.current = document.querySelector('.story-text-container');
    if (!storyTextRef.current) {
      console.error("Story text container not found");
      return;
    }
  }
  
  // Clear any existing text elements
  while (storyTextRef.current.firstChild) {
    storyTextRef.current.removeChild(storyTextRef.current.firstChild);
  }
  
  // Create text elements for each story line
  storySequence.forEach((text, index) => {
    const textEl = document.createElement('div');
    textEl.className = 'text-4xl font-light text-center max-w-2xl px-8 absolute opacity-0 transition-all duration-500';
    textEl.textContent = text;
    // console.log(`Appending text: ${text}`); 
    textEl.style.fontFamily = "'Montserrat', 'Helvetica', sans-serif";
    textEl.style.width = '100%';
    textEl.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
    storyTextRef.current.appendChild(textEl);
    
    // Set initial state
    gsap.set(textEl, { 
      opacity: 1, 
      y: 30 
    });
    
    // Calculate at what scroll progress this text should appear
    const segmentSize = 1 / storySequence.length;
    const startProgress = segmentSize * index;
    const midProgress = startProgress + (segmentSize * 0.5);
    const endProgress = segmentSize * (index + 0.9); // End slightly before next begins
    
    // Create animation for this text tied to scroll progress
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "600% top", // Match your existing animation end
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // If we're in this text's segment
        if (progress >= startProgress && progress <= endProgress) {
          // Calculate opacity - fade in then fade out within segment
          let opacity = 1;
          if (progress < midProgress) {
            opacity = gsap.utils.normalize(startProgress, midProgress, progress);
          } else {
            opacity = gsap.utils.normalize(endProgress, midProgress, progress);
          }
          
          // Apply styles directly for guaranteed visibility
          textEl.style.opacity = opacity;
          
          // Apply color based on the colorTransitionPoint
          const isColor = index >= Math.floor(colorTransitionPoint * storySequence.length);
          // textEl.style.color = isColor ? '#3b82f6' : '#ffffff';
          textEl.style.color = "red";
          textEl.style.filter = isColor ? 'none' : 'grayscale(1)';
          textEl.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
          // Reveal with slight movement
          const y = 30 * (1 - opacity);
          textEl.style.transform = `translateY(${y}px)`;
        } else {
          textEl.style.opacity = 1;
        }
      }
    });
  });
};

    // Preload critical frames to ensure animation can start
    const preloadCriticalFrames = async () => {
      const criticalIndices = [
        0,
        Math.floor(frameCount * colorTransitionPoint), // Add transition point as critical
        Math.floor(frameCount / 3),
        Math.floor((frameCount * 2) / 3),
        frameCount - 1,
      ];

      const preloadPromises = criticalIndices.map((idx) => {
        return new Promise((resolve) => {
          if (idx >= frameCount) {
            resolve();
            return;
          }

          const img = new Image();

          img.onload = () => {
            loadedImagesRef.current++;
            imageStatusRef.current[idx] = 2; // Mark as loaded
            imagesRef.current[idx] = img;
            resolve(true);
          };

          img.onerror = () => {
            console.warn(
              `Failed to load critical image at index ${idx}: ${getImagePath(
                idx
              )}`
            );
            imageStatusRef.current[idx] = 3; // Mark as error
            resolve(false);
          };

          img.src = getImagePath(idx);
        });
      });

      const results = await Promise.all(preloadPromises);
      return results.some((result) => result === true);
    };

    // Load images in chunks with better error handling
    const loadImagesInChunks = async (startIndex, endIndex) => {
      // Same as your original implementation
      return new Promise((resolve) => {
        let loadedInChunk = 0;
        const chunkSize = endIndex - startIndex;

        for (let i = startIndex; i < endIndex; i++) {
          if (i >= frameCount) {
            resolve();
            return;
          }

          if (!imagesRef.current[i] && imageStatusRef.current[i] !== 1) {
            imageStatusRef.current[i] = 1; // Mark as loading
            const img = new Image();

            img.onload = () => {
              loadedInChunk++;
              loadedImagesRef.current++;
              imageStatusRef.current[i] = 2; // Mark as loaded
              setProgress(
                Math.floor((loadedImagesRef.current / frameCount) * 100)
              );

              if (
                loadedInChunk === chunkSize ||
                loadedImagesRef.current === frameCount
              ) {
                resolve();
              }

              // Render the first image as soon as it loads
              if (loadedImagesRef.current === 1) {
                currentFrameRef.current = 0;
                render();
              }

              if (loadedImagesRef.current >= frameCount * 0.9) {
                setIsLoading(false);
              }
            };

            img.onerror = () => {
              loadedInChunk++;
              console.warn(
                `Failed to load image at index ${i}: ${getImagePath(i)}`
              );
              imageStatusRef.current[i] = 3; // Mark as error

              if (loadedInChunk === chunkSize) {
                resolve();
              }

              // If too many errors, show error state
              const errorCount = imageStatusRef.current.filter(
                (status) => status === 3
              ).length;
              if (errorCount > frameCount * 0.3) {
                // If more than 30% of images fail
                setLoadingError(true);
              }
            };

            img.src = getImagePath(i);
            imagesRef.current[i] = img;
          } else if (
            imageStatusRef.current[i] === 2 ||
            imageStatusRef.current[i] === 3
          ) {
            // Already loaded or errored
            loadedInChunk++;
            if (loadedInChunk === chunkSize) {
              resolve();
            }
          }
        }

        // Handle case where all images in this chunk are already being loaded
        if (loadedInChunk === 0 && chunkSize > 0) {
          resolve();
        }
      });
    };

    // Render the current frame with improved error handling and grayscale effect
    const render = () => {
      requestIdRef.current = null;

      const renderFrame = (frameIndex) => {
        const img = imagesRef.current[frameIndex];
        if (isImageValid(img)) {
          try {
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate progress percentage based on current frame
            const progress = frameIndex / frameCount;
            
            // Update color mode state for other components
            setIsColorMode(progress > colorTransitionPoint);
            
            // Apply grayscale filter for the first 40-45% of frames
            if (progress <= colorTransitionPoint) {
              // Save the current context state
              context.save();
              
              // Draw the image
              scaleImage(img, context);
              
              // Apply grayscale filter
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue
              }
              
              context.putImageData(imageData, 0, 0);
              
              // Restore the context state
              context.restore();
            } else {
              // Regular colored rendering
              scaleImage(img, context);
              
              // Optionally add color enhancement for the "popping" effect
              if (progress > colorTransitionPoint && progress < colorTransitionPoint + 0.1) {
                // For frames right after the transition, enhance saturation
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                  // Simple saturation boost
                  const r = data[i];
                  const g = data[i + 1];
                  const b = data[i + 2];
                  
                  const max = Math.max(r, g, b);
                  const min = Math.min(r, g, b);
                  const saturationBoost = 1.3; // Boost saturation by 30%
                  
                  if (max !== min) {
                    const d = (max - min) * saturationBoost;
                    const avg = (max + min) / 2;
                    
                    data[i] = r > avg ? Math.min(255, r + (r - avg) * 0.3) : r;
                    data[i + 1] = g > avg ? Math.min(255, g + (g - avg) * 0.3) : g;
                    data[i + 2] = b > avg ? Math.min(255, b + (b - avg) * 0.3) : b;
                  }
                }
                
                context.putImageData(imageData, 0, 0);
              }
            }
            
            return true;
          } catch (err) {
            console.error("Error drawing image:", err);
            imageStatusRef.current[frameIndex] = 3; // Mark as error
            return false;
          }
        }
        return false;
      };

      // Try to render the current frame
      if (!renderFrame(currentFrameRef.current)) {
        // If current frame fails, find nearest valid frame
        let nearestLoaded = findNearestValidImage(currentFrameRef.current);
        if (nearestLoaded !== null) {
          renderFrame(nearestLoaded);
        } else {
          // If no valid images found, clear canvas and show blank
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Optional: draw placeholder or message
          context.fillStyle = "#f0f0f0";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = "#666";
          context.font = "20px Arial";
          context.textAlign = "center";
          context.fillText(
            "Loading frames...",
            canvas.width / 2,
            canvas.height / 2
          );
        }
      }
    };

    // Find the nearest loaded and valid image frame
    const findNearestValidImage = (frame) => {
      const maxDistance = Math.min(30, frameCount); // Limit search distance

      // Try forward and backward simultaneously
      for (let i = 1; i <= maxDistance; i++) {
        // Try forward
        const forwardFrame = (frame + i) % frameCount;
        if (isImageValid(imagesRef.current[forwardFrame])) {
          return forwardFrame;
        }

        // Try backward
        const backwardFrame = frame - i;
        if (
          backwardFrame >= 0 &&
          isImageValid(imagesRef.current[backwardFrame])
        ) {
          return backwardFrame;
        }
      }

      // As a last resort, try ANY valid frame
      for (let i = 0; i < frameCount; i++) {
        if (isImageValid(imagesRef.current[i])) {
          return i;
        }
      }

      return null; // No valid images found
    };

    // Safe image drawing with error handling
    const scaleImage = (img, ctx) => {
      if (!isImageValid(img)) {
        throw new Error("Invalid image in scaleImage");
      }

      const canvas = ctx.canvas;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    };
    
    // Load more images while scrolling with error handling
    const loadMoreImagesWhileScrolling = () => {
      // Calculate which chunks to prioritize based on current frame
      const currentChunk = Math.floor(currentFrameRef.current / CHUNK_SIZE);
      const chunksToLoad = [];
      
      // Prioritize loading chunks ahead of current position
      for (let i = 0; i < 5; i++) {
        const chunkIndex = currentChunk + i;
        if (chunkIndex * CHUNK_SIZE < frameCount && !isChunkLoaded(chunkIndex)) {
          chunksToLoad.push(chunkIndex);
        }
      }
      
      // Then load chunks behind current position
      for (let i = 1; i <= 2; i++) {
        const chunkIndex = currentChunk - i;
        if (chunkIndex >= 0 && !isChunkLoaded(chunkIndex)) {
          chunksToLoad.push(chunkIndex);
        }
      }
      
      // Load the prioritized chunks
      chunksToLoad.forEach(chunkIndex => {
        const startIndex = chunkIndex * CHUNK_SIZE;
        const endIndex = Math.min(startIndex + CHUNK_SIZE, frameCount);
        loadImagesInChunks(startIndex, endIndex);
      });
    };
    
    // Check if a chunk is fully loaded
    const isChunkLoaded = (chunkIndex) => {
      const startIndex = chunkIndex * CHUNK_SIZE;
      const endIndex = Math.min(startIndex + CHUNK_SIZE, frameCount);
      
      for (let i = startIndex; i < endIndex; i++) {
        // Check if image is neither loaded nor errored
        if (imageStatusRef.current[i] !== 2 && imageStatusRef.current[i] !== 3) {
          return false;
        }
      }
      
      return true;
    };
    
    // Memory management - purge distant frames when memory usage is high
    const manageMemory = () => {
      // Only run if we have more than half the frames loaded
      if (loadedImagesRef.current < frameCount / 2) return;
      
      // Check if we need to free up memory
      const MEMORY_THRESHOLD = 300; // Reduced number of frames to keep at once
      
      if (loadedImagesRef.current > MEMORY_THRESHOLD) {
        const framesToKeep = new Set();
        
        // Keep frames around current position
        const rangeToKeep = MEMORY_THRESHOLD / 2;
        for (let i = currentFrameRef.current - rangeToKeep; i <= currentFrameRef.current + rangeToKeep; i++) {
          if (i >= 0 && i < frameCount) {
            framesToKeep.add(i);
          }
        }
        
        // Keep some regularly spaced frames for quick navigation
        const skipInterval = Math.floor(frameCount / 30);
        for (let i = 0; i < frameCount; i += skipInterval) {
          framesToKeep.add(i);
        }
        
        // Free memory for frames we don't need right now
        for (let i = 0; i < frameCount; i++) {
          if (!framesToKeep.has(i) && imagesRef.current[i]) {
            imagesRef.current[i] = null; // Allow garbage collection
            // Keep track that it was loaded but unloaded for memory
            if (imageStatusRef.current[i] === 2) {
              imageStatusRef.current[i] = 0; 
              loadedImagesRef.current--;
            }
          }
        }
      }
    };
    
    // Load remaining images in background with retry mechanism
    const loadRemainingImagesInBackground = async () => {
      // Initialize status array
      for (let i = 0; i < frameCount; i++) {
        if (!imageStatusRef.current[i]) {
          imageStatusRef.current[i] = 0; // Not loaded
        }
      }
      
      // ADDED: Aggressive loading at the beginning to get more frames ready
      const initialChunks = [
        [0, INITIAL_LOAD], 
        [Math.floor(frameCount / 2) - CHUNK_SIZE, Math.floor(frameCount / 2) + CHUNK_SIZE],
        [frameCount - INITIAL_LOAD, frameCount]
      ];
      
      for (const [start, end] of initialChunks) {
        await loadImagesInChunks(start, end);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Load the rest in chunks
      for (let i = INITIAL_LOAD; i < frameCount; i += CHUNK_SIZE) {
        if (initialChunks.some(([start, end]) => i >= start && i < end)) {
          continue; // Skip if already loaded in initial chunks
        }
        const endIndex = Math.min(i + CHUNK_SIZE, frameCount);
        await loadImagesInChunks(i, endIndex);
        
        // Small delay to prevent browser from hanging
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Try to reload failed images (up to 3 attempts)
      for (let attempt = 0; attempt < 3; attempt++) {
        const failedIndices = [];
        
        // Find failed images
        for (let i = 0; i < frameCount; i++) {
          if (imageStatusRef.current[i] === 3) {
            failedIndices.push(i);
            imageStatusRef.current[i] = 0; // Reset status to try again
          }
        }
        
        if (failedIndices.length === 0) break;
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to load failed images in smaller chunks
        for (let i = 0; i < failedIndices.length; i += 10) { // Smaller chunks for retries
          const chunkEnd = Math.min(i + 10, failedIndices.length);
          const indicesToLoad = failedIndices.slice(i, chunkEnd);
          
          await Promise.all(indicesToLoad.map(idx => {
            return new Promise(resolve => {
              if (!imagesRef.current[idx] || imageStatusRef.current[idx] === 3) {
                imageStatusRef.current[idx] = 1; // Mark as loading
                const img = new Image();
                
                img.onload = () => {
                  loadedImagesRef.current++;
                  imageStatusRef.current[idx] = 2; // Mark as loaded
                  setProgress(Math.floor((loadedImagesRef.current / frameCount) * 100));
                  resolve();
                };
                
                img.onerror = () => {
                  imageStatusRef.current[idx] = 3; // Mark as error again
                  resolve();
                };
                
                img.src = getImagePath(idx);
                imagesRef.current[idx] = img;
              } else {
                resolve();
              }
            });
          }));
          
          // Small delay between chunks
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };
    

  // Handle window resize
  const handleResize = () => {
    initCanvas();
    if (!requestIdRef.current) {
      requestIdRef.current = requestAnimationFrame(render);
    }
  };
   
    // Initialize everything
  const init = async () => {
    // Initialize status array
    imageStatusRef.current = new Array(frameCount).fill(0);

    initCanvas();

    try {
      // First, try to preload at least one critical frame to show something
      const hasAtLeastOneFrame = await preloadCriticalFrames();

      if (!hasAtLeastOneFrame) {
        console.error(
          "Could not load any critical frames - check image paths"
        );
        setLoadingError(true);
        return;
      }

      // Continue with loading initial batch
      await loadImagesInChunks(0, Math.min(INITIAL_LOAD, frameCount));

      // Check if we have enough images to start
      const validInitialImages = imagesRef.current
        .slice(0, INITIAL_LOAD)
        .filter((img) => isImageValid(img)).length;

      if (validInitialImages < INITIAL_LOAD * 0.25) {
        console.warn(
          `Not enough valid images loaded initially (${validInitialImages}/${INITIAL_LOAD})`
        );
        // Continue anyway if we have at least one frame
        if (validInitialImages === 0) {
          setLoadingError(true);
          return;
        }
      }

      // Set up scroll trigger
      const imageSequence = { frame: 0 };

      // Create animation for the main scroll sequence
      gsap.to(imageSequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          scrub: 0.15,
          trigger: containerRef.current,
          start: "top top",
          end: "600% top",
          pin: true,
          onUpdate: (self) => {
            currentFrameRef.current = Math.round(imageSequence.frame);
            
            // Update color transition based on progress
            const progress = self.progress;
            // console.log(`Scroll progress: ${progress}`); 
            setIsColorMode(progress > colorTransitionPoint);
            
            if (!requestIdRef.current) {
              requestIdRef.current = requestAnimationFrame(render);
            }

            // Animate side elements based on scroll progress
            // animateSideElements(self.progress);

            // Start loading more images when user begins scrolling
            if (!isScrollingRef.current) {
              isScrollingRef.current = true;
              loadMoreImagesWhileScrolling();
            }

            // Reset the scrolling timeout
            clearTimeout(isScrollingRef.current);
            isScrollingRef.current = setTimeout(() => {
              isScrollingRef.current = false;
            }, 200);
          },
        },
        onUpdate: () => {
          currentFrameRef.current = Math.round(imageSequence.frame);
          if (!requestIdRef.current) {
            requestIdRef.current = requestAnimationFrame(render);
          }
        },
      });

      // Set up the story sequence animations
      setupStorySequence();

      // Load the rest of the images in the background
      loadRemainingImagesInBackground();
      
      // Initialize side elements animation
      // initSideElements();
    } catch (err) {
      console.error("Error initializing scroll animation:", err);
      setLoadingError(true);
    }
  };

  window.addEventListener("resize", handleResize);

  // Start everything
  init();

  // Add custom styles for story text
  const style = document.createElement('style');
  style.textContent = `
    .story-text-container {
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(style);

  // Memory management interval
  const memoryInterval = setInterval(manageMemory, 30000);

  // Cleanup
  return () => {
    window.removeEventListener("resize", handleResize);
    clearInterval(memoryInterval);
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
    }
    document.head.removeChild(style);
    if (storyTextRef.current && containerRef.current && containerRef.current.contains(storyTextRef.current)) {
      containerRef.current.removeChild(storyTextRef.current);
    }
  };
}, []);

// Modify your return statement to add a dedicated story text container
return (
  <div
    ref={containerRef}
    className={`relative w-full h-full scroll-animation-container transition-colors duration-1000 ease-in-out ${
      isColorMode ? 'bg-white' : 'bg-black'
    }`}
  >
    {/* Main canvas for the animation */}
    <canvas ref={canvasRef} className={`w-full h-full block transform scale-[0.5]`} />

    {/* Dedicated story text container with proper styling */}
    {/* <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
    </div> */}

    {/* Page transition overlay */}
    {/* <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
      isColorMode ? "opacity-0" : "opacity-20"
    } bg-black`}></div> */}

    {/* Loading/error elements */}
    {isLoading && !loadingError && (
      <div className="fixed inset-0 w-full h-full bg-white flex justify-center items-center z-[2000]">
        <div className="font-sans text-6xl font-bold">{progress}%</div>
      </div>
    )}

    {loadingError && (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-5 rounded z-[1000] text-center max-w-[80%]">
        <h3>Error Loading Images</h3>
        <p>There was a problem loading the image sequence.</p>
        <p>Please check your image paths and try refreshing the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#4a90e2] border-none text-white py-2 px-4 rounded cursor-pointer mt-4"
        >
          Refresh Page
        </button>

        <button
          onClick={() => {
            setLoadingError(false);
            window.location.reload();
          }}
          className="bg-[#e24a4a] border-none text-white py-2 px-4 rounded cursor-pointer mt-4 ml-2"
        >
          Force Reload
        </button>
      </div>
    )}
  </div>
);
};

export default ScrollAnimation;