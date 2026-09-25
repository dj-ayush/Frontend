import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  About,
  Cursor,
  ExploredPlaces,
  FeaturedJourney,
  FilmArchive,
  FinalCTA,
  Footer,
  Header,
  Hero,
  IndiaExplorer,
  InstagramSection,
  Manifesto,
  PageLoader,
  StoryGrid,
} from './components.jsx';

gsap.registerPlugin(ScrollTrigger);

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}

function useMotion(rootRef) {
  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headerTrigger = ScrollTrigger.create({
      start: 10,
      end: 99999,
      onUpdate: (self) => {
        rootRef.current?.classList.toggle('nav-solid', self.scroll() > 16);
      },
    });

    if (reduceMotion) {
      rootRef.current.classList.add('loaded');
      return () => headerTrigger.kill();
    }

    const context = gsap.context(() => {
      const loaderTimeline = gsap.timeline();

      loaderTimeline
        .to('.page-loader span', { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' })
        .to('.page-loader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut', delay: 0.28 })
        .set('.page-loader', { display: 'none' })
        .add(() => rootRef.current?.classList.add('loaded'), '<0.3')
        .from('.site-header', { y: -18, autoAlpha: 0, duration: 0.75, ease: 'power3.out' }, '<')
        .from('.hero-copy > *', { y: 30, duration: 1, stagger: 0.1, ease: 'power3.out' }, '<0.08')
        .from('.hero-media img', { scale: 1.08, duration: 1.4, ease: 'power3.out' }, '<');

      gsap.to('.hero-media img', {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 34,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 84%',
          },
        });
      });

      gsap.utils.toArray('.image-reveal').forEach((frame) => {
        const image = frame.querySelector('img');

        gsap.from(frame, {
          clipPath: 'inset(10% 0 10% 0)',
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: frame,
            start: 'top 86%',
          },
        });

        if (image) {
          gsap.to(image, {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.3,
            },
          });
        }
      });

      gsap.from('.map-state', {
        autoAlpha: 0,
        scale: 0.985,
        duration: 0.75,
        stagger: 0.01,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.map-wrap',
          start: 'top 78%',
        },
      });
    }, rootRef);

    return () => {
      context.revert();
      headerTrigger.kill();
    };
  }, [rootRef]);
}

function useCursor(rootRef) {
  useEffect(() => {
    if (!rootRef.current || window.matchMedia('(pointer: coarse)').matches) {
      return undefined;
    }

    const cursor = rootRef.current.querySelector('.cursor');
    const label = cursor?.querySelector('span');

    if (!cursor || !label) {
      return undefined;
    }

    const setCursor = (event) => {
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.18, ease: 'power3.out' });
    };

    const enter = (event) => {
      const text = event.currentTarget.getAttribute('data-cursor') || '';
      label.textContent = text;
      cursor.classList.add('is-active');
    };

    const leave = () => {
      label.textContent = '';
      cursor.classList.remove('is-active');
    };

    window.addEventListener('mousemove', setCursor);
    const targets = rootRef.current.querySelectorAll('a, button, [data-cursor]');
    targets.forEach((target) => {
      target.addEventListener('mouseenter', enter);
      target.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', setCursor);
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', enter);
        target.removeEventListener('mouseleave', leave);
      });
    };
  }, [rootRef]);
}

export default function App() {
  const rootRef = useRef(null);

  useSmoothScroll();
  useMotion(rootRef);
  useCursor(rootRef);

  return (
    <div className="site-shell" ref={rootRef}>
      <PageLoader />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <IndiaExplorer />
        <ExploredPlaces />
        <FilmArchive />
        <FeaturedJourney />
        <StoryGrid />
        <About />
        <InstagramSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
