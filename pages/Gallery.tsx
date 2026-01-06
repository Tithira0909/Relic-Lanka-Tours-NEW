import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useData } from '../context/DataContext';

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const config = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};

export const Gallery: React.FC = () => {
  const { gallery, heroImages } = useData();
  const spotlightItems = gallery.map(item => ({
      name: item.caption || "Gallery Image",
      img: item.url
  }));

  // Fallback if gallery is empty
  if (spotlightItems.length === 0) {
      spotlightItems.push({ name: "No Images", img: "https://picsum.photos/800/600" });
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const titlesContainerRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const introTextRef1 = useRef<HTMLDivElement>(null);
  const introTextRef2 = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Setup Lenis (Smooth Scroll)
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      // Sync GSAP ticker with Lenis
      const update = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      // 2. Setup Elements
      const titles = titlesContainerRef.current?.querySelectorAll('h1');
      const images = imagesContainerRef.current?.querySelectorAll('.spotlight-img');
      const introTexts = [introTextRef1.current, introTextRef2.current];
      
      if (!titles || !images || !introTexts[0]) return;

      // Initial States
      gsap.set(images, { opacity: 0 });
      if(titles[0]) gsap.set(titles[0], { opacity: 1 });

      // Arc Calculation
      const containerWidth = window.innerWidth * 0.3;
      const containerHeight = window.innerHeight;
      const arcStartX = containerWidth - 220;
      const arcStartY = -200;
      const arcEndY = containerHeight + 200;
      const arcControlPointX = arcStartX + config.arcRadius;
      const arcControlPointY = containerHeight / 2;

      function getBezierPosition(t: number) {
        const x = (1 - t) * (1 - t) * arcStartX + 2 * (1 - t) * t * arcControlPointX + t * t * arcStartX;
        const y = (1 - t) * (1 - t) * arcStartY + 2 * (1 - t) * t * arcControlPointY + t * t * arcEndY;
        return { x, y };
      }

      function getImgProgressState(index: number, overallProgress: number) {
        const startTime = index * config.gap;
        const endTime = startTime + config.speed;

        if (overallProgress < startTime) return -1;
        if (overallProgress > endTime) return 2;

        return (overallProgress - startTime) / config.speed;
      }

      let currentActiveIndex = 0;

      // 3. Main ScrollTrigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 10}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Phase 1: Intro (0 - 0.2)
          if (progress <= 0.2) {
            const animationProgress = progress / 0.2;
            const moveDistance = window.innerWidth * 0.6;
            
            gsap.set(introTexts[0], { x: -animationProgress * moveDistance, opacity: 1 });
            gsap.set(introTexts[1], { x: animationProgress * moveDistance, opacity: 1 });
            
            gsap.set(".spotlight-bg-img", { transform: `scale(${animationProgress})` });
            gsap.set(".spotlight-bg-img img", { transform: `scale(${1.5 - animationProgress * 0.5})` });
            
            gsap.set(images, { opacity: 0 });
            gsap.set(headerRef.current, { opacity: 0 });
            
            if (titlesContainerRef.current) {
                titlesContainerRef.current.style.setProperty("--before-opacity", "0");
                titlesContainerRef.current.style.setProperty("--after-opacity", "0");
            }
          } 
          // Phase 2: Transition (0.2 - 0.25)
          else if (progress > 0.2 && progress <= 0.25) {
            gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
            gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });
            
            gsap.set(introTexts, { opacity: 0 });
            gsap.set(images, { opacity: 0 });
            gsap.set(headerRef.current, { opacity: 1 });

            if (titlesContainerRef.current) {
                titlesContainerRef.current.style.setProperty("--before-opacity", "1");
                titlesContainerRef.current.style.setProperty("--after-opacity", "1");
            }
          }
          // Phase 3: Gallery Scroll (0.25 - 0.95)
          else if (progress > 0.25 && progress <= 0.95) {
            gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
            gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });
            gsap.set(introTexts, { opacity: 0 });
            gsap.set(headerRef.current, { opacity: 1 });
            
            if (titlesContainerRef.current) {
                titlesContainerRef.current.style.setProperty("--before-opacity", "1");
                titlesContainerRef.current.style.setProperty("--after-opacity", "1");
            }

            // Move Titles
            const switchProgress = (progress - 0.25) / 0.7;
            const viewportHeight = window.innerHeight;
            const titlesContainerHeight = titlesContainerRef.current?.scrollHeight || 0;
            const startPosition = viewportHeight;
            const targetPosition = -titlesContainerHeight;
            const totalDistance = startPosition - targetPosition;
            const currentY = startPosition - switchProgress * totalDistance;
            
            gsap.set(titlesContainerRef.current, { translateY: currentY });

            // Move Images
            images.forEach((img, index) => {
              const imageProgress = getImgProgressState(index, switchProgress);
              if (imageProgress < 0 || imageProgress > 1) {
                gsap.set(img, { opacity: 0 });
              } else {
                const pos = getBezierPosition(imageProgress);
                gsap.set(img, {
                  x: pos.x - 100, // Center offset
                  y: pos.y - 75,
                  opacity: 1
                });
              }
            });

            // Active Title Detection
            const viewportMiddle = viewportHeight / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;

            titles.forEach((title, index) => {
               const rect = title.getBoundingClientRect();
               const center = rect.top + rect.height / 2;
               const dist = Math.abs(center - viewportMiddle);
               if (dist < closestDistance) {
                   closestDistance = dist;
                   closestIndex = index;
               }
            });

            if (closestIndex !== currentActiveIndex) {
                if (titles[currentActiveIndex]) gsap.to(titles[currentActiveIndex], { opacity: 0.25, duration: 0.2 });
                if (titles[closestIndex]) gsap.to(titles[closestIndex], { opacity: 1, duration: 0.2 });
                
                // Change BG Image
                if (bgImgRef.current) {
                   bgImgRef.current.src = spotlightItems[closestIndex].img;
                }
                currentActiveIndex = closestIndex;
            }

          } 
          // Phase 4: Exit (0.95+)
          else {
            gsap.set(headerRef.current, { opacity: 0 });
            if (titlesContainerRef.current) {
                titlesContainerRef.current.style.setProperty("--before-opacity", "0");
                titlesContainerRef.current.style.setProperty("--after-opacity", "0");
            }
          }
        }
      });

      // Cleanup function for Lenis
      return () => {
        lenis.destroy();
        gsap.ticker.remove(update);
      };
    }, containerRef); // Scope GSAP to container

    return () => ctx.revert();
  }, [spotlightItems]);

  return (
    <div ref={containerRef} className="spotlight relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Global Hero Background */}
      <div className="absolute inset-0 z-0">
          <img
            src={heroImages.length > 0 ? heroImages[0] : "https://picsum.photos/1920/1080"}
            className="w-full h-full object-cover opacity-40"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      <style>{`
        .spotlight-titles-container::before,
        .spotlight-titles-container::after {
          content: "";
          position: fixed;
          left: 0;
          width: 100%;
          height: 35vh;
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.5s;
        }
        .spotlight-titles-container::before {
          top: 0;
          background: linear-gradient(to bottom, #ffffff 10%, transparent);
          opacity: var(--before-opacity, 0);
        }
        .spotlight-titles-container::after {
          bottom: 0;
          background: linear-gradient(to top, #ffffff 10%, transparent);
          opacity: var(--after-opacity, 0);
        }
        .spotlight-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 300px;
            height: 200px;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            pointer-events: none;
            z-index: 10;
        }
        .spotlight-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
      `}</style>

      {/* Dynamic Gallery Image Card */}
      <div className="spotlight-bg-img absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[70%] z-[1] overflow-hidden rounded-3xl scale-0 origin-center pointer-events-none shadow-2xl border border-white/10">
        <img 
          ref={bgImgRef}
          src={spotlightItems[0]?.img || ''}
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out filter brightness-90"
          alt="Gallery Spotlight"
        />
      </div>

      {/* Header */}
      <div ref={headerRef} className="spotlight-header absolute top-8 left-8 right-8 flex justify-between items-center z-50 opacity-0 transition-opacity duration-500">
         <div className="text-sm font-medium tracking-widest uppercase text-ceylon-700">Visual Journey</div>
         <div className="text-sm font-medium text-gray-400">Scroll to explore</div>
      </div>

      {/* Intro Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-20 mix-blend-difference text-white">
        <h1 ref={introTextRef1} className="spotlight-intro-text text-[12vw] font-serif leading-none whitespace-nowrap">
          RELIC LANKA
        </h1>
        <h1 ref={introTextRef2} className="spotlight-intro-text text-[12vw] font-serif leading-none italic whitespace-nowrap text-ceylon-300">
          GALLERY
        </h1>
      </div>

      {/* Moving Titles */}
      <div className="absolute top-0 right-[15%] h-full w-[30%] z-20 pointer-events-none flex justify-center">
         <div ref={titlesContainerRef} className="spotlight-titles-container w-full text-right relative">
             {spotlightItems.map((item, i) => (
               <h1 
                key={i} 
                className="text-[6vw] font-serif leading-[1.2] opacity-25 transition-opacity duration-300 text-primary whitespace-nowrap"
                style={{ opacity: i === 0 ? 1 : 0.25 }}
               >
                 {item.name}
               </h1>
             ))}
         </div>
      </div>

      {/* Moving Images Container */}
      <div ref={imagesContainerRef} className="spotlight-images absolute inset-0 pointer-events-none z-10">
         {spotlightItems.map((item, i) => (
             <div key={i} className="spotlight-img">
                 <img src={item.img} alt={item.name} />
             </div>
         ))}
      </div>

    </div>
  );
};
