import React, { useEffect, useMemo, useRef, useState } from 'react';
import indiaMap from '@svg-maps/india';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from './content/siteContent.js';
import { getYouTubeThumbnailSet } from './utils/youtube.js';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Explore India', href: '#explore-india' },
  { label: 'Journeys', href: '#journeys' },
  { label: 'Films', href: '#films' },
  { label: 'About', href: '#about' },
];

function useSiteMotion(rootRef) {
  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const headerTrigger = ScrollTrigger.create({
      start: 12,
      end: 99999,
      onUpdate: (self) => {
        rootRef.current?.classList.toggle('nav-solid', self.scroll() > 16);
      },
    });

    if (reduceMotion) {
      return () => headerTrigger.kill();
    }

    const context = gsap.context(() => {
      gsap.from('.site-header', {
        y: -18,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.hero-copy > *', {
        y: 32,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.1,
      });

      gsap.from('.hero-media', {
        scale: 1.05,
        autoAlpha: 0,
        duration: 1.25,
        ease: 'power3.out',
      });

      gsap.to('.hero-media img', {
        yPercent: 8,
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
          clipPath: 'inset(9% 0% 9% 0%)',
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
              scrub: 1.4,
            },
          });
        }
      });

      gsap.from('.map-state', {
        autoAlpha: 0,
        scale: 0.985,
        duration: 0.8,
        stagger: 0.01,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.map-canvas',
          start: 'top 78%',
        },
      });

      gsap.from('.destination-card', {
        x: 36,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.destination-track',
          start: 'top 82%',
        },
      });

      gsap.from('.film-link', {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.film-archive',
          start: 'top 82%',
        },
      });
    }, rootRef);

    return () => {
      context.revert();
      headerTrigger.kill();
    };
  }, [rootRef]);
}

function VideoImage({ video, eager = false }) {
  const thumbnail = getYouTubeThumbnailSet(video.url);

  return (
    <img
      src={thumbnail.maxres}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      onError={(event) => {
        event.currentTarget.src = thumbnail.hq;
      }}
    />
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={() => setMenuOpen(false)}>
        Explore with Me
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span />
        <span />
      </button>
      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
        <a href={siteContent.social.youtube} target="_blank" rel="noreferrer">
          YouTube
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  const heroVideo = siteContent.videos[0];

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <a className="hero-media" href={heroVideo.url} target="_blank" rel="noreferrer" aria-label="Open featured film">
        <VideoImage video={heroVideo} eager />
      </a>
      <div className="hero-copy">
        <p className="hero-kicker">Travel &middot; Food &middot; Culture &middot; Adventure &middot; Hidden Gems</p>
        <h1 id="hero-title">
          Explore
          <span>with Me</span>
        </h1>
        <p>
          Discover destinations, local culture, authentic food and unforgettable travel experiences across India and
          beyond.
        </p>
        <div className="actions">
          <a className="button primary" href={siteContent.social.youtube} target="_blank" rel="noreferrer">
            Watch on YouTube
          </a>
          <a className="button ghost" href="#journeys">
            Explore Journeys
          </a>
        </div>
      </div>
      <a className="scroll-cue" href="#explore-india" aria-label="Scroll to Explore India">
        <span />
        Scroll
      </a>
    </section>
  );
}

function SectionTitle({ eyebrow, title, text, light = false }) {
  return (
    <div className={light ? 'section-title light reveal' : 'section-title reveal'}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <span>{text}</span> : null}
    </div>
  );
}

function ExploreIndia() {
  const [selectedStateId, setSelectedStateId] = useState('ka');
  const [hoveredStateId, setHoveredStateId] = useState('');
  const journeysByState = useMemo(() => {
    return siteContent.videos.reduce((acc, video) => {
      if (!video.stateId) {
        return acc;
      }

      acc[video.stateId] = [...(acc[video.stateId] ?? []), video];
      return acc;
    }, {});
  }, []);

  const selectedLocation = indiaMap.locations.find((location) => location.id === selectedStateId);
  const selectedJourneys = journeysByState[selectedStateId] ?? [];
  const selectedState = siteContent.exploreIndia.states.find((state) => state.id === selectedStateId);

  return (
    <section className="explore-india" id="explore-india">
      <SectionTitle
        eyebrow="Explore India"
        title="A map of journeys."
        text="Click a state to discover the places actually covered."
      />
      <div className="map-experience">
        <div className="map-canvas reveal">
          <svg viewBox={indiaMap.viewBox} role="img" aria-label={indiaMap.label}>
            {indiaMap.locations.map((location) => {
              const hasJourneys = Boolean(journeysByState[location.id]);
              const isSelected = selectedStateId === location.id;
              const isHovered = hoveredStateId === location.id;

              return (
                <path
                  key={location.id}
                  d={location.path}
                  className={[
                    'map-state',
                    hasJourneys ? 'has-journeys' : 'is-quiet',
                    isSelected ? 'is-selected' : '',
                    isHovered ? 'is-hovered' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  tabIndex={0}
                  role="button"
                  aria-label={`${location.name}${hasJourneys ? ', journeys available' : ', no journeys yet'}`}
                  onMouseEnter={() => setHoveredStateId(location.id)}
                  onMouseLeave={() => setHoveredStateId('')}
                  onFocus={() => setHoveredStateId(location.id)}
                  onClick={() => setSelectedStateId(location.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedStateId(location.id);
                    }
                  }}
                />
              );
            })}
          </svg>
        </div>
        <aside className="state-panel reveal" aria-live="polite">
          <p>{selectedLocation?.name ?? 'India'}</p>
          <h3>{selectedJourneys.length ? `${selectedJourneys.length} verified journey${selectedJourneys.length > 1 ? 's' : ''}` : 'No verified journeys yet'}</h3>
          {selectedState ? <span>{selectedState.note}</span> : <span>Unsupported states stay quiet until a real Explore with Me video is connected.</span>}
          {selectedJourneys.length ? (
            <div className="state-journeys">
              {selectedJourneys.map((video) => (
                <a href={video.url} target="_blank" rel="noreferrer" key={video.url}>
                  <VideoImage video={video} />
                  <strong>{video.destination}</strong>
                  <small>{video.label}</small>
                </a>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function PlacesExplored() {
  const destinations = siteContent.videos.filter((video) => video.destination && video.destination !== 'Explore with Me Film');

  return (
    <section className="places warm-section" id="journeys">
      <SectionTitle eyebrow="Places I've explored" title="Real destinations. Real stories." light />
      <div className="destination-track" aria-label="Destination gallery">
        {destinations.map((video, index) => (
          <a
            className={`destination-card size-${(index % 3) + 1} image-reveal`}
            href={video.url}
            target="_blank"
            rel="noreferrer"
            key={video.url}
          >
            <VideoImage video={video} />
            <span>
              <small>{video.label}</small>
              <strong>{video.destination}</strong>
            </span>
            <em>Open</em>
          </a>
        ))}
      </div>
    </section>
  );
}

function Films() {
  return (
    <section className="films" id="films">
      <SectionTitle eyebrow="Films" title="Watch the archive." text="Real YouTube thumbnails. No embedded players." />
      <div className="film-archive">
        {siteContent.videos.map((video, index) => (
          <a className="film-link" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
            <span className="film-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="film-copy">
              <strong>{video.destination}</strong>
              <small>{video.label}</small>
            </span>
            <span className="film-image image-reveal">
              <VideoImage video={video} />
            </span>
            <span className="film-play">Play</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeaturedJourney() {
  const featuredVideo = siteContent.videos[2] ?? siteContent.videos[0];

  return (
    <section className="featured warm-section" id="featured">
      <a className="featured-photo image-reveal" href={featuredVideo.url} target="_blank" rel="noreferrer">
        <VideoImage video={featuredVideo} />
      </a>
      <div className="featured-copy reveal">
        <p>Featured journey</p>
        <span>{featuredVideo.label}</span>
        <h2>{featuredVideo.destination}</h2>
        <a className="button dark" href={featuredVideo.url} target="_blank" rel="noreferrer">
          Watch Film
        </a>
      </div>
    </section>
  );
}

function About() {
  const aboutVideo = siteContent.videos[4] ?? siteContent.videos[0];

  return (
    <section className="about" id="about">
      <div className="about-copy reveal">
        <p>About</p>
        <h2>More than just destinations.</h2>
        <span>
          Explore with Me is all about discovering incredible destinations, hidden gems, local culture, and
          unforgettable travel experiences across India and beyond.
        </span>
        <span>
          From travel guides and scenic road trips to food, adventure, and budget-friendly itineraries, every video is
          created to inspire and help you plan your next journey.
        </span>
        <strong>Travel &bull; Culture &bull; Food &bull; Adventure &bull; Hidden Gems</strong>
      </div>
      <a className="about-photo image-reveal" href={aboutVideo.url} target="_blank" rel="noreferrer">
        <VideoImage video={aboutVideo} />
      </a>
    </section>
  );
}

function Instagram() {
  const instagramVideos = siteContent.videos.slice(0, 3);

  return (
    <section className="instagram warm-section" id="instagram">
      <div className="instagram-strip">
        {instagramVideos.map((video) => (
          <span className="image-reveal" key={video.url}>
            <VideoImage video={video} />
          </span>
        ))}
      </div>
      <div className="instagram-copy reveal">
        <p>Follow the journey</p>
        <h2>@explore_with_me_vlogs</h2>
        <a className="button dark" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>Explore with Me</h2>
        <p>Travel films, food stories, culture and hidden gems.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="#top">Home</a>
        <a href="#explore-india">Explore India</a>
        <a href="#journeys">Journeys</a>
        <a href="#films">Films</a>
        <a href="#about">About</a>
        <a href={siteContent.social.youtube} target="_blank" rel="noreferrer">
          YouTube
        </a>
        <a href={siteContent.social.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </nav>
    </footer>
  );
}

export default function App() {
  const rootRef = useRef(null);
  useSiteMotion(rootRef);

  return (
    <div className="site-shell" ref={rootRef}>
      <Header />
      <main>
        <Hero />
        <ExploreIndia />
        <PlacesExplored />
        <Films />
        <FeaturedJourney />
        <About />
        <Instagram />
      </main>
      <Footer />
    </div>
  );
}
