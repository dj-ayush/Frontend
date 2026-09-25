import React from 'react';
import { siteContent } from './content/siteContent.js';
import { getYouTubeThumbnailSet } from './utils/youtube.js';

const navItems = [
  { label: 'Journeys', href: '#journeys' },
  { label: 'Featured', href: '#featured' },
  { label: 'Videos', href: '#videos' },
  { label: 'About', href: '#about' },
  { label: 'Instagram', href: '#instagram' },
];

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
  const thumbnail = getYouTubeThumbnailSet(siteContent.videos[0].url);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Travel films and visual journeys</p>
        <h1 id="hero-title">Explore with Me</h1>
        <p className="hero-text">
          A cinematic home for routes, moments, and travel stories from the road.
        </p>
        <div className="hero-actions" aria-label="Social links">
          <a className="button primary" href={siteContent.social.youtube} target="_blank" rel="noreferrer">
            Watch on YouTube
          </a>
          <a className="button secondary" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>
      <div className="hero-media" aria-label="Featured travel video thumbnail">
        <img
          src={thumbnail.maxres}
          alt=""
          onError={(event) => {
            event.currentTarget.src = thumbnail.hq;
          }}
        />
      </div>
    </section>
  );
}

function SectionShell({ id, eyebrow, title, children }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function Journeys() {
  return (
    <SectionShell id="journeys" eyebrow="Journeys" title="Routes in progress">
      <div className="editorial-placeholder">
        <p>Destination-led story blocks will live here in the next stage.</p>
      </div>
    </SectionShell>
  );
}

function FeaturedVideo() {
  const featuredVideo = siteContent.videos[0];
  const thumbnail = getYouTubeThumbnailSet(featuredVideo.url);

  return (
    <SectionShell id="featured" eyebrow="Featured Video" title="A current frame from the channel">
      <a className="featured-video" href={featuredVideo.url} target="_blank" rel="noreferrer">
        <img
          src={thumbnail.maxres}
          alt=""
          onError={(event) => {
            event.currentTarget.src = thumbnail.hq;
          }}
        />
        <span>Open featured video</span>
      </a>
    </SectionShell>
  );
}

function LatestVideos() {
  return (
    <SectionShell id="videos" eyebrow="Latest Videos" title="Video library foundation">
      <div className="video-grid" aria-label="YouTube video links">
        {siteContent.videos.map((video, index) => {
          const thumbnail = getYouTubeThumbnailSet(video.url);

          return (
            <a className="video-tile" href={video.url} target="_blank" rel="noreferrer" key={video.url}>
              <img
                src={thumbnail.maxres}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = thumbnail.hq;
                }}
              />
              <span>Video {String(index + 1).padStart(2, '0')}</span>
            </a>
          );
        })}
      </div>
    </SectionShell>
  );
}

function Categories() {
  return (
    <SectionShell id="categories" eyebrow="Categories" title="Travel themes">
      <div className="category-row">
        {siteContent.categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </div>
    </SectionShell>
  );
}

function About() {
  return (
    <SectionShell id="about" eyebrow="About" title="Creator profile">
      <div className="editorial-placeholder">
        <p>Reserved for verified channel description and creator story.</p>
      </div>
    </SectionShell>
  );
}

function Instagram() {
  return (
    <SectionShell id="instagram" eyebrow="Instagram" title="Field notes and reels">
      <a className="text-link" href={siteContent.social.instagram} target="_blank" rel="noreferrer">
        Visit @explore_with_me_vlogs
      </a>
    </SectionShell>
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
        <Journeys />
        <FeaturedVideo />
        <LatestVideos />
        <Categories />
        <About />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
