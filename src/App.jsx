import React, { useEffect, useMemo, useRef, useState } from 'react';
import indiaMap from '@svg-maps/india';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from './content/siteContent.js';
import { getYouTubeThumbnailSet } from './utils/youtube.js';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Explore India', href: '#explore-india' },
  { label: 'Journeys', href: '#journeys' },
  { label: 'Films', href: '#films' },
  { label: 'About', href: '#about' },
];

function usePageMotion(rootRef) {
  useEffect(() => {
    if (!rootRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.hero-visual', {
        clipPath: 'inset(12% 0% 12% 0%)',
        autoAlpha: 0,
        scale: 1.03,
        duration: 1.25,
        ease: 'power3.out',
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 34,
          autoAlpha: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
          },
        });
      });

      gsap.utils.toArray('.image-frame').forEach((frame) => {
        const image = frame.querySelector('img');

        gsap.from(frame, {
          clipPath: 'inset(10% 0% 10% 0%)',
          autoAlpha: 0.85,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: frame,
            start: 'top 84%',
          },
        });

        if (image) {
          gsap.to(image, {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          });
        }
      });

      gsap.from('.map-state', {
        autoAlpha: 0,
        scale: 0.98,
        duration: 0.75,
        stagger: 0.012,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.india-map-wrap',
          start: 'top 78%',
        },
      });

      gsap.from('.film-row', {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.film-list',
          start: 'top 82%',
        },
      });
    }, rootRef);

    return () => context.revert();
  }, [rootRef]);
}

function VideoImage({ video }) {
  const thumbnail = getYouTubeThumbnailSet(video.url);

  return (
    <img
      src={thumbnail.maxres}
      alt=""
      loading="lazy"
      onError={(event) => {
        event.currentTarget.src = thumbnail.hq;
      }}
    />
  );
}

function Navbar() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Explore with Me home">
        Explore with Me
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="nav-social" href={siteContent.social.youtube} target="_blank" rel="noreferrer">
        YouTube
      </a>
    </header>
  );
}

function Hero() {
  const heroVideo = siteContent.videos[0];

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <a className="hero-visual image-frame" href={heroVideo.url} target="_blank" rel="noreferrer">
        <VideoImage video={heroVideo} />
      </a>
      <div className="hero-copy">
        <p className="eyebrow">Travel films from India and beyond</p>
        <h1 id="hero-title">Explore with Me</h1>
        <p className="hero-tags">Travel · Food · Culture · Adventure · Hidden Gems</p>
        <p className="hero-text">
          Discover incredible destinations, hidden gems, local culture and unforgettable travel experiences.
        </p>
        <div className="actions">
          <a className="button primary" href="#films">
            Watch Films
          </a>
          <a className="button secondary" href="#explore-india">
            Explore India
          </a>
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const featuredVideo = siteContent.videos[0];

  return (
    <section className="featured warm-section" id="featured" aria-labelledby="featured-title">
      <div className="featured-copy reveal">
        <p className="eyebrow">Featured journey</p>
        <h2 id="featured-title">A journey worth watching.</h2>
        <a className="text-button" href={featuredVideo.url} target="_blank" rel="noreferrer">
          Watch Film
        </a>
      </div>
      <a className="featured-image image-frame" href={featuredVideo.url} target="_blank" rel="noreferrer">
        <VideoImage video={featuredVideo} />
      </a>
    </section>
  );
}

function ExploreIndia() {
  const [hoveredState, setHoveredState] = useState(null);
  const activeState = useMemo(
    () => siteContent.exploreIndia.states.find((state) => state.id === hoveredState?.id),
    [hoveredState],
  );

  return (
    <section className="explore-india" id="explore-india" aria-labelledby="india-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Explore India</p>
        <h2 id="india-title">A visual map for future verified journeys.</h2>
        <p>
          State-level film connections will appear here only when they are verified in the content file. The existing
          videos remain available below.
        </p>
      </div>

      <div className="india-map-layout">
        <div className="india-map-wrap reveal">
          <svg viewBox={indiaMap.viewBox} role="img" aria-label={indiaMap.label}>
            {indiaMap.locations.map((location) => {
              const hasContent = siteContent.exploreIndia.states.some((state) => state.id === location.id);
              const isHovered = hoveredState?.id === location.id;

              return (
                <path
                  className={['map-state', hasContent ? 'has-content' : 'is-quiet', isHovered ? 'is-hovered' : '']
                    .filter(Boolean)
                    .join(' ')}
                  d={location.path}
                  key={location.id}
                  onMouseEnter={() => setHoveredState(location)}
                  onFocus={() => setHoveredState(location)}
                  onMouseLeave={() => setHoveredState(null)}
                  tabIndex={0}
                  aria-label={location.name}
                />
              );
            })}
          </svg>
        </div>

        <aside className="map-note reveal" aria-live="polite">
          <p className="eyebrow">{hoveredState ? hoveredState.name : 'India'}</p>
          {activeState ? (
            <>
              <h3>{activeState.name}</h3>
              <p>{activeState.note}</p>
            </>
          ) : (
            <>
              <h3>{hoveredState ? 'No verified film connected yet.' : 'Hover the map.'}</h3>
              <p>
                Unsupported states stay quiet until a real Explore with Me journey is connected. No destinations are
                invented here.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function Journeys() {
  const journeyVideos = siteContent.videos.slice(0, 4);

  return (
    <section className="journeys warm-section" id="journeys" aria-labelledby="journeys-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Journeys</p>
        <h2 id="journeys-title">Real frames from the road.</h2>
      </div>
      <div className="journey-gallery">
        {journeyVideos.map((video, index) => (
          <a className={`journey-photo image-frame item-${index + 1}`} href={video.url} target="_blank" rel="noreferrer" key={video.url}>
            <VideoImage video={video} />
            <span>{String(index + 1).padStart(2, '0')}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Films() {
  return (
    <section className="films" id="films" aria-labelledby="films-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Films</p>
        <h2 id="films-title">Watch the archive.</h2>
      </div>
      <div className="film-list">
        {siteContent.videos.map((video, index) => (
          <a className="film-row" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
            <span className="film-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="film-name">Explore with Me film</span>
            <span className="film-thumb image-frame">
              <VideoImage video={video} />
            </span>
            <span className="play-mark">Play</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function About() {
  const aboutVideo = siteContent.videos[4] ?? siteContent.videos[0];

  return (
    <section className="about warm-section" id="about" aria-labelledby="about-title">
      <a className="about-photo image-frame" href={aboutVideo.url} target="_blank" rel="noreferrer">
        <VideoImage video={aboutVideo} />
      </a>
      <div className="about-copy reveal">
        <p className="eyebrow">About</p>
        <h2 id="about-title">A travel creator story.</h2>
        <p>
          Explore with Me is all about discovering incredible destinations, hidden gems, local culture, and unforgettable
          travel experiences across India and beyond.
        </p>
        <p>
          From travel guides and scenic road trips to food, adventure, and budget-friendly itineraries, every video is
          created to inspire and help you plan your next journey.
        </p>
        <p className="about-tags">Travel • Culture • Food • Adventure • Hidden Gems</p>
      </div>
    </section>
  );
}

function Instagram() {
  const instagramVideos = siteContent.videos.slice(5, 8);

  return (
    <section className="instagram" id="instagram" aria-labelledby="instagram-title">
      <div className="instagram-gallery">
        {instagramVideos.map((video) => (
          <span className="image-frame" key={video.url}>
            <VideoImage video={video} />
          </span>
        ))}
      </div>
      <div className="instagram-copy reveal">
        <p className="eyebrow">Follow the journey</p>
        <h2 id="instagram-title">@explore_with_me_vlogs</h2>
        <a className="button primary" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>{siteContent.name}</p>
      <div>
        <a href={siteContent.social.youtube} target="_blank" rel="noreferrer">
          YouTube
        </a>
        <a href={siteContent.social.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const rootRef = useRef(null);
  usePageMotion(rootRef);

  return (
    <div className="site-shell" ref={rootRef}>
      <Navbar />
      <main>
        <Hero />
        <Featured />
        <ExploreIndia />
        <Journeys />
        <Films />
        <About />
        <Instagram />
      </main>
      <Footer />
    </div>
  );
}
