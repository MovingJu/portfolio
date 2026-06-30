import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className="mid-section-home">
      <h1>🥕 Welcome 🥕</h1>
      <div className="row sub-heading">
        <div className="summary-about-me">
          <p>
            More than<br />
            a site<br />
            A Moving<br />
            place.
          </p>
        </div>
        <div className="nav-link">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
