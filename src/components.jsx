import React, { useEffect, useMemo, useState } from 'react';
import indiaMap from '@svg-maps/india';
import { ArrowUpRight, Menu, Play, X } from 'lucide-react';
import { siteContent } from './content/siteContent.js';
import { getYouTubeThumbnail } from './utils/youtube.js';

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Explore India', href: '#explore-india' },
  { label: 'Journeys', href: '#journeys' },
  { label: 'Films', href: '#films' },
  { label: 'About', href: '#about' },
];

function getVideo(videoId) {
  return siteContent.videos.find((video) => video.id === videoId) ?? siteContent.videos[0];
}

export function VideoImage({ video, eager = false, className = '' }) {
  const [src, setSrc] = useState(getYouTubeThumbnail(video.id));

  useEffect(() => {
    setSrc(getYouTubeThumbnail(video.id));
  }, [video.id]);

  return (
    <img
      className={className}
      src={src}
      alt={video.destination ? `${video.destination} video thumbnail` : 'Explore with Me video thumbnail'}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setSrc(getYouTubeThumbnail(video.id, 'hqdefault'))}
    />
  );
}

export function PageLoader() {
  return (
    <div className="page-loader" aria-hidden="true">
      <div>
        <span>Explore</span>
        <span>with Me</span>
      </div>
      <i />
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

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={closeMenu}>
        Explore with Me
      </a>
      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a className="nav-link" href={item.href} key={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <div className="nav-socials">
          <a href={siteContent.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" data-cursor="PLAY">
            <Play size={17} />
            <span>YouTube</span>
          </a>
          <a href={siteContent.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-cursor="VIEW">
            <span>Instagram</span>
          </a>
        </div>
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}

export function Hero() {
  const heroVideo = getVideo('jiO-3RdbVGQ');

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-image media-parallax">
        <VideoImage video={heroVideo} eager />
      </div>
      <div className="hero-content" data-animate="section">
        <p className="eyebrow">Travel &bull; Food &bull; Culture &bull; Adventure</p>
        <h1 id="hero-title">
          Explore
          <span>with Me</span>
        </h1>
        <p>Discover destinations, hidden gems, local culture and unforgettable journeys.</p>
        <div className="hero-meta">
          <span>India</span>
          <span>Travel film journal</span>
        </div>
        <div className="actions">
          <a className="button primary" href={siteContent.socials.youtube} target="_blank" rel="noreferrer" data-cursor="PLAY">
            Watch on YouTube
            <ArrowUpRight size={16} />
          </a>
          <a className="button ghost" href="#journeys" data-cursor="EXPLORE">
            Explore Journeys
          </a>
        </div>
      </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <section className="manifesto cream-section" data-animate="section">
      <p className="eyebrow">The Journey</p>
      <h2>India, framed through food, roads, culture and quiet discoveries.</h2>
      <p>
        Explore with Me is a visual travel journal shaped by real places and real videos from the channel. The site uses
        creator thumbnails and verified journey data only.
      </p>
    </section>
  );
}

function SectionIntro({ eyebrow, title, text, align = 'split' }) {
  return (
    <div className={`section-intro ${align}`} data-animate="section">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <span>{text}</span> : null}
    </div>
  );
}

export function IndiaExplorer() {
  const [selectedStateId, setSelectedStateId] = useState('ka');
  const [hoveredState, setHoveredState] = useState(null);
  const videosByState = useMemo(() => {
    return siteContent.videos.reduce((acc, video) => {
      if (!video.stateId) {
        return acc;
      }
      acc[video.stateId] = [...(acc[video.stateId] ?? []), video];
      return acc;
    }, {});
  }, []);
  const selectedLocation = indiaMap.locations.find((location) => location.id === selectedStateId);
  const selectedVideos = videosByState[selectedStateId] ?? [];
  const selectedState = siteContent.mapStates[selectedStateId];

  return (
    <section className="explore-india" id="explore-india">
      <SectionIntro
        eyebrow="Explore India"
        title="India, through my lens."
        text="Click a state to discover the places actually covered."
      />
      <div className="atlas-layout">
        <div className="india-map-shell" data-animate="map" data-cursor="EXPLORE">
          <svg className="india-map" viewBox={indiaMap.viewBox} role="img" aria-label={indiaMap.label}>
            {indiaMap.locations.map((location) => {
              const journeys = videosByState[location.id] ?? [];
              const hasJourneys = journeys.length > 0;
              const isSelected = location.id === selectedStateId;

              return (
                <path
                  key={location.id}
                  d={location.path}
                  data-state-id={location.id}
                  className={[
                    'state-path',
                    hasJourneys ? 'has-journeys' : 'is-muted',
                    isSelected ? 'is-selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  tabIndex={0}
                  role="button"
                  aria-label={`${location.name}, ${journeys.length} journeys`}
                  onMouseEnter={() => setHoveredState(location)}
                  onMouseLeave={() => setHoveredState(null)}
                  onFocus={() => setHoveredState(location)}
                  onBlur={() => setHoveredState(null)}
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
          {hoveredState ? (
            <div className="map-tooltip">
              <strong>{hoveredState.name}</strong>
              <span>{videosByState[hoveredState.id]?.length ?? 0} journeys</span>
            </div>
          ) : null}
        </div>
        <aside className="state-panel" data-animate="section" aria-live="polite">
          <p className="eyebrow">{selectedLocation?.name ?? 'India'}</p>
          <h3>{selectedVideos.length ? `${selectedVideos.length} journeys` : 'No journeys documented yet.'}</h3>
          <span>{selectedState?.note ?? 'No verified Explore with Me video is connected to this state yet.'}</span>
          <div className="state-journeys">
            {selectedVideos.length ? (
              selectedVideos.map((video) => (
                <a href={video.url} target="_blank" rel="noreferrer" key={video.id} data-cursor="PLAY">
                  <VideoImage video={video} />
                  <span>
                    <strong>{video.destination || video.title}</strong>
                    <small>{video.label}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ))
            ) : (
              <p>No journeys documented yet.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function ExploredPlaces() {
  const journeys = siteContent.journeys.map((journey) => ({
    ...journey,
    video: getVideo(journey.videoId),
  }));

  return (
    <section className="journeys cream-section" id="journeys">
      <SectionIntro eyebrow="Journeys" title="Real destinations. Real stories." text="Verified places connected to supplied videos." />
      <div className="journey-editorial">
        {journeys.map((journey, index) => (
          <a
            className={`journey-tile tile-${index + 1}`}
            href={journey.video.url}
            target="_blank"
            rel="noreferrer"
            key={journey.videoId}
            data-animate="image"
            data-cursor="VIEW"
          >
            <VideoImage video={journey.video} />
            <span>
              <small>{journey.stateName}</small>
              <strong>{journey.destination}</strong>
              <em>{journey.label}</em>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function FeaturedJourney() {
  const featured = getVideo(siteContent.featuredVideoId);

  return (
    <section className="featured-film">
      <div className="featured-copy" data-animate="section">
        <p className="eyebrow">Featured Film</p>
        <h2>{featured.destination || featured.title}</h2>
        <p>{featured.description}</p>
        <a className="button primary" href={featured.url} target="_blank" rel="noreferrer" data-cursor="PLAY">
          Watch Film
          <ArrowUpRight size={16} />
        </a>
      </div>
      <a className="featured-image" href={featured.url} target="_blank" rel="noreferrer" data-animate="image" data-cursor="PLAY">
        <VideoImage video={featured} />
        <span>
          <Play size={18} />
        </span>
      </a>
    </section>
  );
}

function FilmLink({ video, index, variant = 'card' }) {
  return (
    <a className={`film-link ${variant}`} href={video.url} target="_blank" rel="noreferrer" data-animate="image" data-cursor="PLAY">
      <VideoImage video={video} />
      <span className="play-dot">
        <Play size={16} />
      </span>
      <div>
        <small>
          {String(index + 1).padStart(2, '0')} &bull; {video.category}
        </small>
        <strong>{video.destination || video.title}</strong>
        {video.destination ? <em>{video.stateName}</em> : <em>Explore with Me archive</em>}
      </div>
    </a>
  );
}

export function FilmArchive() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filteredVideos = activeCategory === 'All'
    ? siteContent.videos
    : siteContent.videos.filter((video) => video.category === activeCategory);
  const featured = filteredVideos[0];
  const latest = filteredVideos.slice(1, 7);
  const rows = filteredVideos.slice(7);

  return (
    <section className="films" id="films">
      <SectionIntro
        eyebrow="The Film Archive"
        title="Stories, places and moments collected along the way."
        text={`${siteContent.videos.length} real YouTube videos. No embedded players.`}
      />
      <div className="filter-bar" role="tablist" aria-label="Film categories">
        {siteContent.categories.map((category) => (
          <button
            type="button"
            className={activeCategory === category ? 'is-active' : ''}
            key={category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {filteredVideos.length ? (
        <div className="archive-layout" key={activeCategory}>
          {featured ? <FilmLink video={featured} index={0} variant="feature" /> : null}
          <div className="latest-strip" aria-label="Latest films">
            {latest.map((video, index) => (
              <FilmLink video={video} index={index + 1} variant="strip" key={video.id} />
            ))}
          </div>
          <div className="archive-rows">
            {rows.map((video, index) => (
              <FilmLink video={video} index={index + 7} variant="row" key={video.id} />
            ))}
          </div>
        </div>
      ) : (
        <p className="empty-filter">No verified films in this category yet.</p>
      )}
    </section>
  );
}

export function About() {
  const aboutVideo = getVideo('DAtrMaRw12I');

  return (
    <section className="about" id="about">
      <div className="about-copy" data-animate="section">
        <p className="eyebrow">About</p>
        <h2>More than just destinations.</h2>
        <p>
          Explore with Me is all about discovering incredible destinations, hidden gems, local culture, and unforgettable
          travel experiences across India and beyond.
        </p>
        <p>
          From travel guides and scenic road trips to food, adventure, and budget-friendly itineraries, every video is
          created to inspire and help you plan your next journey.
        </p>
        <strong>Travel &bull; Culture &bull; Food &bull; Adventure &bull; Hidden Gems</strong>
      </div>
      <a className="about-image" href={aboutVideo.url} target="_blank" rel="noreferrer" data-animate="image" data-cursor="PLAY">
        <VideoImage video={aboutVideo} />
      </a>
    </section>
  );
}

export function InstagramSection() {
  const stripVideos = siteContent.videos.slice(2, 7);

  return (
    <section className="instagram-section cream-section" id="instagram" data-animate="section">
      <div className="instagram-strip">
        {stripVideos.map((video) => (
          <span key={video.id} data-animate="image">
            <VideoImage video={video} />
          </span>
        ))}
      </div>
      <div className="instagram-copy">
        <p className="eyebrow">Follow the journey</p>
        <h2>@explore_with_me_vlogs</h2>
        <a className="button primary" href={siteContent.socials.instagram} target="_blank" rel="noreferrer" data-cursor="VIEW">
          Follow on Instagram
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta" data-animate="section">
      <p className="eyebrow">Keep exploring</p>
      <h2>Stories worth remembering.</h2>
      <div className="actions">
        <a className="button primary" href={siteContent.socials.youtube} target="_blank" rel="noreferrer" data-cursor="PLAY">
          YouTube
        </a>
        <a className="button ghost" href={siteContent.socials.instagram} target="_blank" rel="noreferrer" data-cursor="VIEW">
          Instagram
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer" data-animate="section">
      <div>
        <h2>Explore with Me.</h2>
        <p>Travel &bull; Food &bull; Culture &bull; Adventure &bull; Hidden Gems</p>
        <small>Stories worth remembering.</small>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
        <a href={siteContent.socials.youtube} target="_blank" rel="noreferrer">
          YouTube
        </a>
        <a href={siteContent.socials.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </nav>
      <small>&copy; 2026 Explore with Me</small>
    </footer>
  );
}
