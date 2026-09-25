import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
} from './components.jsx';

gsap.registerPlugin(ScrollTrigger);

function useHeaderState(rootRef) {
  useEffect(() => {
    const update = () => {
      rootRef.current?.classList.toggle('nav-solid', window.scrollY > 20);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });

    return () => window.removeEventListener('scroll', update);
  }, [rootRef]);
}

function useMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      root.classList.add('is-loaded');
      return undefined;
    }

    const ctx = gsap.context(() => {
      const loader = root.querySelector('.page-loader');

      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => root.classList.add('is-loaded'),
        })
        .from('.page-loader span', { y: 18, autoAlpha: 0, duration: 0.45, stagger: 0.08 })
        .to('.page-loader i', { scaleX: 1, duration: 0.45 }, '<0.1')
        .to(loader, { autoAlpha: 0, duration: 0.45, delay: 0.15, pointerEvents: 'none' })
        .from('.site-header', { y: -16, autoAlpha: 0, duration: 0.45 }, '-=0.25')
        .from('.hero-content > *', { y: 20, autoAlpha: 0, duration: 0.65, stagger: 0.08 }, '-=0.2');

      gsap.to('.media-parallax img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      gsap.utils.toArray('[data-animate="section"]').forEach((section) => {
        gsap.from(section, {
          y: 24,
          autoAlpha: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 86%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('[data-animate="image"]').forEach((imageFrame) => {
        gsap.from(imageFrame, {
          y: 18,
          clipPath: 'inset(8% 0 8% 0)',
          autoAlpha: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageFrame,
            start: 'top 88%',
            once: true,
          },
        });
      });

      gsap.from('.state-path', {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.008,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.india-map-shell',
          start: 'top 82%',
          once: true,
        },
      });
    }, root);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [rootRef]);
}

function useCursor(rootRef) {
  useEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia('(pointer: coarse)').matches) {
      return undefined;
    }

    const cursor = root.querySelector('.cursor');
    const label = cursor?.querySelector('span');

    if (!cursor || !label) {
      return undefined;
    }

    const move = (event) => {
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.16, ease: 'power3.out' });
    };
    const enter = (event) => {
      label.textContent = event.currentTarget.getAttribute('data-cursor') || 'VIEW';
      cursor.classList.add('is-active');
    };
    const leave = () => {
      label.textContent = '';
      cursor.classList.remove('is-active');
    };

    window.addEventListener('pointermove', move, { passive: true });
    const targets = root.querySelectorAll('a, button, [data-cursor]');
    targets.forEach((target) => {
      target.addEventListener('pointerenter', enter);
      target.addEventListener('pointerleave', leave);
    });

    return () => {
      window.removeEventListener('pointermove', move);
      targets.forEach((target) => {
        target.removeEventListener('pointerenter', enter);
        target.removeEventListener('pointerleave', leave);
      });
    };
  }, [rootRef]);
}

export default function App() {
  const rootRef = useRef(null);

  useHeaderState(rootRef);
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
        <FeaturedJourney />
        <FilmArchive />
        <About />
        <InstagramSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
