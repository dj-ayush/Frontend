import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from './content/siteContent.js';
import { getYouTubeThumbnailSet } from './utils/youtube.js';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Featured', href: '#featured' },
  { label: 'Explore India', href: '#explore-india' },
  { label: 'Films', href: '#films' },
  { label: 'About', href: '#about' },
];

function useCinematicMotion(rootRef) {
  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.from('.site-header', {
        y: -22,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-copy > *', {
        y: 34,
        autoAlpha: 0,
        duration: 1.15,
        ease: 'power3.out',
        stagger: 0.13,
        delay: 0.12,
      });

      gsap.from('.hero-frame, .hero-strip a', {
        clipPath: 'inset(12% 0% 12% 0%)',
        autoAlpha: 0,
        y: 28,
        duration: 1.35,
        ease: 'power3.out',
        stagger: 0.12,
      });

      gsap.utils.toArray('.section-band, .final-cta').forEach((section) => {
        gsap.from(section.querySelectorAll('.section-intro, .about-copy, .text-link, .final-cta > *'), {
          y: 34,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
          },
        });
      });

      gsap.utils.toArray('.image-reveal').forEach((frame) => {
        const image = frame.querySelector('img');

        gsap.fromTo(
          frame,
          { clipPath: 'inset(10% 0% 10% 0%)', autoAlpha: 0.78 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            autoAlpha: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: frame,
              start: 'top 82%',
            },
          },
        );

        if (image) {
          gsap.to(image, {
            yPercent: -7,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
      });

      gsap.from('.film-card', {
        y: 30,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: '.film-grid',
          start: 'top 78%',
        },
      });

      gsap.from('.journey-item', {
        y: 34,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.journey-grid',
          start: 'top 80%',
        },
      });

      const mapStates = gsap.utils.toArray('.map-state');
      mapStates.forEach((state, index) => {
        const length = typeof state.getTotalLength === 'function' ? state.getTotalLength() : 0;

        if (length) {
          gsap.set(state, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        }

        gsap.fromTo(
          state,
          { autoAlpha: 0, scale: 0.985 },
          {
            autoAlpha: 1,
            scale: 1,
            strokeDashoffset: 0,
            duration: 1.1,
            delay: index * 0.015,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.map-stage',
              start: 'top 74%',
            },
          },
        );
      });

      gsap.to('.map-stage', {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.explore-india',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });
    }, rootRef);

    return () => context.revert();
  }, [rootRef]);
}

function VideoImage({ video, className = '' }) {
  const thumbnail = getYouTubeThumbnailSet(video.url);

  return (
    <img
      className={className}
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
        <span>Explore</span>
        <span>with Me</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
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
  const supportingVideos = siteContent.videos.slice(1, 4);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-media-stack">
        <a className="hero-frame hero-frame-large image-reveal" href={heroVideo.url} target="_blank" rel="noreferrer">
          <VideoImage video={heroVideo} />
        </a>
        <div className="hero-strip">
          {supportingVideos.map((video, index) => (
            <a className="image-reveal" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
              <VideoImage video={video} />
              <span>{String(index + 2).padStart(2, '0')}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="hero-copy">
        <p className="eyebrow">India travel films</p>
        <h1 id="hero-title">Explore with Me</h1>
        <p className="hero-text">
          A cinematic travel journal built around real videos, real journeys, and a growing visual map of India.
        </p>
        <div className="hero-actions" aria-label="Primary actions">
          <a className="button primary" href={siteContent.social.youtube} target="_blank" rel="noreferrer">
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

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function FeaturedJourney() {
  const featuredVideo = siteContent.videos[0];

  return (
    <section className="featured-journey section-band" id="featured" aria-labelledby="featured-title">
      <SectionIntro
        eyebrow="Featured journey"
        title="A current frame from the channel"
        text="The site uses real YouTube thumbnails and external links only, keeping playback fast and lightweight."
      />
      <a className="featured-panel image-reveal" href={featuredVideo.url} target="_blank" rel="noreferrer">
        <VideoImage video={featuredVideo} />
        <span>Open featured film</span>
      </a>
    </section>
  );
}

function IndiaMap({ states, selectedStateId, onSelect }) {
  return (
    <svg className="india-map" viewBox="0 0 540 760" role="img" aria-labelledby="india-map-title">
      <title id="india-map-title">Interactive India state map</title>
      {states.map((state) => {
        const isActive = state.videos.length > 0;
        const isSelected = selectedStateId === state.id;

        return (
          <path
            key={state.id}
            d={state.path}
            className={['map-state', isActive ? 'is-active' : 'is-muted', isSelected ? 'is-selected' : '']
              .filter(Boolean)
              .join(' ')}
            tabIndex={isActive ? 0 : -1}
            role={isActive ? 'button' : 'img'}
            aria-label={isActive ? `${state.name}, verified films available` : `${state.name}, no verified films yet`}
            onClick={() => {
              if (isActive) {
                onSelect(state.id);
              }
            }}
            onKeyDown={(event) => {
              if (isActive && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onSelect(state.id);
              }
            }}
          />
        );
      })}
    </svg>
  );
}

function ExploreIndia() {
  const interactiveStates = siteContent.exploreIndia.states.filter((state) => state.videos.length > 0);
  const [selectedStateId, setSelectedStateId] = useState(interactiveStates[0]?.id ?? '');
  const panelRef = useRef(null);
  const selectedState = useMemo(
    () => siteContent.exploreIndia.states.find((state) => state.id === selectedStateId),
    [selectedStateId],
  );

  useEffect(() => {
    if (!panelRef.current) {
      return;
    }

    gsap.fromTo(panelRef.current, { y: 10, autoAlpha: 0.72 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
  }, [selectedStateId]);

  return (
    <section className="explore-india section-band" id="explore-india" aria-labelledby="explore-india-title">
      <SectionIntro
        eyebrow="Explore India"
        title="An interactive map for verified journeys"
        text="States become selectable only when a verified Explore with Me video is connected in the content file."
      />

      <div className="map-layout">
        <div className="map-stage">
          <IndiaMap
            states={siteContent.exploreIndia.states}
            selectedStateId={selectedStateId}
            onSelect={setSelectedStateId}
          />
        </div>

        <aside className="map-panel" aria-live="polite">
          <div className="map-panel-content" ref={panelRef}>
            <p className="panel-kicker">Current coverage</p>
            {selectedState ? (
              <>
              <h3>{selectedState.name}</h3>
              <p>{selectedState.note}</p>
              <div className="panel-videos">
                {selectedState.videos.map((video) => (
                  <a className="image-reveal" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
                    <VideoImage video={video} />
                    <span>Open verified film</span>
                  </a>
                ))}
              </div>
              </>
            ) : (
              <>
              <h3>No state-level mapping yet</h3>
              <p>
                The existing video URLs are preserved below. Add a verified state connection in
                <span> siteContent.js </span>
                to activate a state on this map.
              </p>
              </>
            )}
          </div>
          <div className="state-list" aria-label="India states and content availability">
            {siteContent.exploreIndia.states.map((state) => (
              <button
                type="button"
                key={state.id}
                disabled={state.videos.length === 0}
                className={selectedStateId === state.id ? 'is-selected' : ''}
                onClick={() => setSelectedStateId(state.id)}
              >
                {state.name}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function SelectedJourneys() {
  return (
    <section className="selected-journeys section-band" id="journeys" aria-labelledby="journeys-title">
      <SectionIntro
        eyebrow="Selected journeys"
        title="A growing India archive"
        text="These are drawn from the existing verified YouTube URLs. More destination detail can be added when it is confirmed."
      />
      <div className="journey-grid">
        {siteContent.videos.slice(0, 3).map((video, index) => (
          <a className="journey-item image-reveal" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
            <VideoImage video={video} />
            <span>Journey {String(index + 1).padStart(2, '0')}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Films() {
  return (
    <section className="films section-band" id="films" aria-labelledby="films-title">
      <SectionIntro
        eyebrow="YouTube films"
        title="Real thumbnails, real links"
        text="No embedded players, no fabricated titles, and no invented performance claims."
      />
      <div className="film-grid">
        {siteContent.videos.map((video, index) => (
          <a className="film-card image-reveal" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
            <VideoImage video={video} />
            <span>Film {String(index + 1).padStart(2, '0')}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function About() {
  const aboutVideo = siteContent.videos[4] ?? siteContent.videos[0];

  return (
    <section className="about section-band" id="about" aria-labelledby="about-title">
      <SectionIntro eyebrow="About" title="Built for the next journey" />
      <div className="about-copy">
        <a className="about-image image-reveal" href={aboutVideo.url} target="_blank" rel="noreferrer">
          <VideoImage video={aboutVideo} />
        </a>
        <div className="about-story">
          <p>
            Explore with Me is all about discovering incredible destinations, hidden gems, local culture, and
            unforgettable travel experiences across India and beyond.
          </p>
          <p>
            From travel guides and scenic road trips to food, adventure, and budget-friendly itineraries, every video is
            created to inspire and help you plan your next journey.
          </p>
          <p className="about-tags">Travel • Culture • Food • Adventure • Hidden Gems</p>
        </div>
      </div>
    </section>
  );
}

function Instagram() {
  const instagramVideos = siteContent.videos.slice(5, 8);

  return (
    <section className="instagram section-band" id="instagram" aria-labelledby="instagram-title">
      <SectionIntro
        eyebrow="Instagram"
        title="Field notes beyond the films"
        text="Follow the creator account for additional travel updates and visual moments."
      />
      <div className="instagram-continuation">
        <div className="instagram-frames" aria-hidden="true">
          {instagramVideos.map((video) => (
            <span className="image-reveal" key={video.url}>
              <VideoImage video={video} />
            </span>
          ))}
        </div>
        <a className="text-link" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
          Visit @explore_with_me_vlogs
        </a>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <p className="eyebrow">Keep exploring</p>
      <h2 id="final-cta-title">Watch the films or follow the journey.</h2>
      <div className="hero-actions">
        <a className="button primary" href={siteContent.social.youtube} target="_blank" rel="noreferrer">
          YouTube
        </a>
        <a className="button secondary" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
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
  useCinematicMotion(rootRef);

  return (
    <div className="site-shell" ref={rootRef}>
      <Navbar />
      <main>
        <Hero />
        <FeaturedJourney />
        <ExploreIndia />
        <SelectedJourneys />
        <Films />
        <About />
        <Instagram />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
