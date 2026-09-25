import React, { useMemo, useState } from 'react';
import indiaMap from '@svg-maps/india';
import { ArrowUpRight, Play } from 'lucide-react';
import { siteContent } from './content/siteContent.js';
import { getYouTubeThumbnailSet } from './utils/youtube.js';

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Explore India', href: '#explore-india' },
  { label: 'Journeys', href: '#journeys' },
  { label: 'Films', href: '#films' },
  { label: 'About', href: '#about' },
];

export function VideoImage({ video, eager = false }) {
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

export function PageLoader() {
  return (
    <div className="page-loader" aria-hidden="true">
      <span>Explore with Me</span>
    </div>
  );
}

export function Cursor() {
  return (
    <div className="cursor" aria-hidden="true">
      <span />
    </div>
  );
}

export function Header() {
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
          <a className="nav-link" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
        <a href={siteContent.social.youtube} target="_blank" rel="noreferrer" className="nav-youtube">
          <Play size={14} />
          YouTube
        </a>
      </nav>
    </header>
  );
}

export function Hero() {
  const heroVideo = siteContent.videos[0];

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <a className="hero-media" href={heroVideo.url} target="_blank" rel="noreferrer" data-cursor="PLAY">
        <VideoImage video={heroVideo} eager />
      </a>
      <div className="hero-copy">
        <p className="hero-kicker">Travel &bull; Food &bull; Culture &bull; Adventure</p>
        <h1 id="hero-title">
          Explore
          <span>with Me.</span>
        </h1>
        <p>Stories, places and experiences from the road.</p>
        <div className="hero-meta">
          <span>India</span>
          <span>Travel journal</span>
        </div>
        <div className="actions">
          <a className="button primary" href={siteContent.social.youtube} target="_blank" rel="noreferrer">
            Watch on YouTube
            <ArrowUpRight size={16} />
          </a>
          <a className="button ghost" href="#explore-india">
            Explore India
          </a>
        </div>
      </div>
      <a className="scroll-cue" href="#manifesto" aria-label="Scroll to manifesto">
        <span />
        Scroll
      </a>
    </section>
  );
}

export function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="manifesto-mark reveal">The Journey</div>
      <h2 className="reveal">Some places are visited. Some places stay with you.</h2>
      <p className="reveal">
        Explore with Me is a visual travel journal shaped by destinations, hidden gems, food, culture and simple moments
        from the road. Every film keeps the focus on real places and real experiences.
      </p>
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

export function IndiaExplorer() {
  const [selectedStateId, setSelectedStateId] = useState('ka');
  const [hovered, setHovered] = useState(null);
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
  const selectedState = siteContent.exploreIndia.states.find((state) => state.id === selectedStateId);
  const selectedJourneys = journeysByState[selectedStateId] ?? [];

  return (
    <section className="explore-india" id="explore-india">
      <SectionTitle
        eyebrow="Explore India"
        title="Click a state to explore the places covered."
        text="A working India map for verified Explore with Me journeys."
      />
      <div className="map-grid">
        <div className="map-wrap reveal" data-cursor="EXPLORE">
          <svg viewBox={indiaMap.viewBox} role="img" aria-label={indiaMap.label}>
            {indiaMap.locations.map((location) => {
              const hasJourneys = Boolean(journeysByState[location.id]);
              const isSelected = selectedStateId === location.id;
              return (
                <path
                  key={location.id}
                  d={location.path}
                  data-state-id={location.id}
                  className={['map-state state-path', hasJourneys ? 'has-journeys' : 'is-quiet', isSelected ? 'is-selected' : '']
                    .filter(Boolean)
                    .join(' ')}
                  tabIndex={0}
                  role="button"
                  aria-label={`${location.name}${hasJourneys ? `, ${journeysByState[location.id].length} journeys` : ', more journeys coming soon'}`}
                  onMouseEnter={() => setHovered(location)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(location)}
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
          {hovered ? (
            <div className="map-tooltip">
              <strong>{hovered.name}</strong>
              <span>{journeysByState[hovered.id]?.length ?? 0} journeys</span>
            </div>
          ) : null}
        </div>
        <aside className="state-panel reveal" aria-live="polite">
          <p>{selectedLocation?.name ?? 'India'}</p>
          <h3>{selectedJourneys.length ? `${selectedJourneys.length.toString().padStart(2, '0')} journeys` : 'More journeys coming soon.'}</h3>
          <span>{selectedState?.note ?? 'No verified Explore with Me video is connected to this state yet.'}</span>
          {selectedJourneys.length ? (
            <div className="state-journeys">
              {selectedJourneys.map((video) => (
                <a href={video.url} target="_blank" rel="noreferrer" key={video.url} data-cursor="PLAY">
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

export function ExploredPlaces() {
  const destinations = siteContent.destinations;

  return (
    <section className="places warm-section" id="journeys">
      <SectionTitle eyebrow="Places I've explored" title="Real destinations. Real stories." light />
      <div className="destination-layout">
        {destinations.map((destination, index) => (
          <a
            className={`destination-card place-card image-reveal place-${index + 1}`}
            href={destination.video.url}
            target="_blank"
            rel="noreferrer"
            key={`${destination.name}-${destination.video.url}`}
            data-cursor="EXPLORE"
          >
            <VideoImage video={destination.video} />
            <span>
              <small>{destination.video.label}</small>
              <strong>{destination.name}</strong>
            </span>
            <ArrowUpRight size={20} />
          </a>
        ))}
      </div>
    </section>
  );
}

export function FilmArchive() {
  return (
    <section className="films" id="films">
      <SectionTitle eyebrow="The Film Archive" title="Real journeys. Real places. Real stories." />
      <div className="film-grid">
        {siteContent.videos.map((video, index) => (
          <a
            className={`film-card film-row image-reveal film-${index + 1}`}
            href={video.url}
            target="_blank"
            rel="noreferrer"
            key={video.url}
            data-cursor="PLAY"
          >
            <VideoImage video={video} />
            <span className="play-badge">
              <Play size={16} />
            </span>
            <div>
              <small>{video.label}</small>
              <strong>{video.destination}</strong>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function FeaturedJourney() {
  const featured = siteContent.videos.find((video) => video.destination === 'Wayanad') ?? siteContent.videos[4];

  return (
    <section className="featured-poster">
      <a className="poster-image image-reveal" href={featured.url} target="_blank" rel="noreferrer" data-cursor="PLAY">
        <VideoImage video={featured} />
      </a>
      <div className="poster-copy reveal">
        <p>Featured Journey</p>
        <span>Mist &bull; Waterfalls &bull; Hills</span>
        <h2>{featured.destination}</h2>
        <em>Wayanad like never before.</em>
        <a className="button primary" href={featured.url} target="_blank" rel="noreferrer">
          Watch Film
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

export function StoryGrid() {
  const stories = siteContent.videos.filter((video) =>
    ['Kolar Gold Fields', 'Chikkamagaluru', 'Yelagiri', 'Sakleshpur'].includes(video.destination),
  );

  return (
    <section className="stories warm-section">
      <SectionTitle eyebrow="Stories from the road" title="Small chapters from real journeys." light />
      <div className="story-grid">
        {stories.map((video) => (
          <a href={video.url} target="_blank" rel="noreferrer" className="story image-reveal" key={video.url} data-cursor="PLAY">
            <VideoImage video={video} />
            <span>
              <small>{video.label}</small>
              <strong>{video.destination}</strong>
              <em>{video.stateName}</em>
            </span>
            <ArrowUpRight size={18} />
          </a>
        ))}
      </div>
    </section>
  );
}

export function About() {
  const aboutVideo = siteContent.videos.find((video) => video.destination === 'Chikkamagaluru') ?? siteContent.videos[2];

  return (
    <section className="about" id="about">
      <div className="about-copy reveal">
        <p>About</p>
        <h2>More than just destinations.</h2>
        <span>
          Explore with Me is all about discovering incredible destinations, hidden gems, local culture, and unforgettable
          travel experiences across India and beyond.
        </span>
        <span>
          From travel guides and scenic road trips to food, adventure, and budget-friendly itineraries, every video is
          created to inspire and help you plan your next journey.
        </span>
        <strong>Travel &bull; Culture &bull; Food &bull; Adventure &bull; Hidden Gems</strong>
      </div>
      <a className="about-photo image-reveal" href={aboutVideo.url} target="_blank" rel="noreferrer" data-cursor="PLAY">
        <VideoImage video={aboutVideo} />
      </a>
    </section>
  );
}

export function InstagramSection() {
  const instagramVideos = siteContent.videos.slice(0, 4);

  return (
    <section className="instagram" id="instagram">
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
        <a className="button primary" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
          Open Instagram
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const ctaVideo = siteContent.videos[1];

  return (
    <section className="final-cta">
      <a className="final-image image-reveal" href={ctaVideo.url} target="_blank" rel="noreferrer" data-cursor="PLAY">
        <VideoImage video={ctaVideo} />
      </a>
      <div className="final-copy reveal">
        <h2>Where should we go next?</h2>
        <p>Follow the journey and watch the latest Explore with Me films.</p>
        <div className="actions">
          <a className="button primary" href={siteContent.social.youtube} target="_blank" rel="noreferrer">
            Watch on YouTube
          </a>
          <a className="button ghost" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>
          Explore
          <span>with Me.</span>
        </h2>
        <p>Travel &bull; Food &bull; Culture &bull; Adventure</p>
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
      <small>&copy; 2026 Explore with Me</small>
    </footer>
  );
}
