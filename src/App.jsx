import React, { useMemo, useState } from 'react';
import { siteContent } from './content/siteContent.js';
import { getYouTubeThumbnailSet } from './utils/youtube.js';

const navItems = [
  { label: 'Featured', href: '#featured' },
  { label: 'Explore India', href: '#explore-india' },
  { label: 'Films', href: '#films' },
  { label: 'About', href: '#about' },
];

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
        <a className="hero-frame hero-frame-large" href={heroVideo.url} target="_blank" rel="noreferrer">
          <VideoImage video={heroVideo} />
        </a>
        <div className="hero-strip">
          {supportingVideos.map((video, index) => (
            <a href={video.url} target="_blank" rel="noreferrer" key={video.url}>
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
      <a className="featured-panel" href={featuredVideo.url} target="_blank" rel="noreferrer">
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
  const selectedState = useMemo(
    () => siteContent.exploreIndia.states.find((state) => state.id === selectedStateId),
    [selectedStateId],
  );

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
          <p className="panel-kicker">Current coverage</p>
          {selectedState ? (
            <>
              <h3>{selectedState.name}</h3>
              <p>{selectedState.note}</p>
              <div className="panel-videos">
                {selectedState.videos.map((video) => (
                  <a href={video.url} target="_blank" rel="noreferrer" key={video.url}>
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
          <a className="journey-item" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
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
          <a className="film-card" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
            <VideoImage video={video} />
            <span>Film {String(index + 1).padStart(2, '0')}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-band" id="about" aria-labelledby="about-title">
      <SectionIntro eyebrow="About" title="A travel creator archive for Explore with Me" />
      <div className="about-copy">
        <p>
          Explore with Me is represented here through the verified YouTube and Instagram accounts linked on this site.
        </p>
        <p>
          Creator biography, destinations, achievements, collaborations, and statistics have intentionally been left out
          until they can be verified.
        </p>
      </div>
    </section>
  );
}

function Instagram() {
  return (
    <section className="instagram section-band" id="instagram" aria-labelledby="instagram-title">
      <SectionIntro
        eyebrow="Instagram"
        title="Field notes beyond the films"
        text="Follow the creator account for additional travel updates and visual moments."
      />
      <a className="text-link" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
        Visit @explore_with_me_vlogs
      </a>
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
  return (
    <>
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
    </>
  );
}
