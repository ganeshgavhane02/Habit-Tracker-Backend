import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useThree } from '@react-three/fiber';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ScrollManager = () => {
  const lenisRef = useRef(null);
  const { camera, scene } = useThree();

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Update ScrollTrigger on each Lenis scroll
    function updateScroll() {
      ScrollTrigger.update();
    }

    lenis.on('scroll', updateScroll);

    // RAF loop for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Enhanced 3D parallax scrolling effects
    const parallaxSections = gsap.utils.toArray('.parallax-section');
    
    parallaxSections.forEach((section, index) => {
      // Create depth-based parallax
      const depth = -8 - (index * 3);
      const rotationY = index * 0.05;
      const rotationX = index * 0.02;
      
      // Camera movement
      gsap.to(camera.position, {
        z: depth,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          markers: false,
        },
      });

      // Camera rotation
      gsap.to(camera.rotation, {
        y: rotationY,
        x: rotationX,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      });

      // Section-specific 3D effects
      const layerElements = section.querySelectorAll('.parallax-layer');
      layerElements.forEach((layer, layerIndex) => {
        const speed = layer.dataset.speed || 0.5;
        const yOffset = 100 * (1 - speed);
        
        gsap.to(layer, {
          y: -yOffset,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    });

    // Global 3D scene rotation based on scroll
    gsap.to(scene.rotation, {
      y: Math.PI * 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // Floating elements animation
    const floatingElements = gsap.utils.toArray('.float-element');
    floatingElements.forEach((el) => {
      gsap.to(el, {
        y: '+=20',
        rotation: '+=5',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Racing stripe effect (horizontal movement)
    const stripeElements = gsap.utils.toArray('.racing-stripe');
    stripeElements.forEach((stripe) => {
      gsap.to(stripe, {
        x: '100%',
        duration: 2,
        repeat: -1,
        ease: 'none',
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % 100),
        },
      });
    });

    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [camera, scene]);

  return null;
};

export default ScrollManager;