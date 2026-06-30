import Navigation from '@/components/Navigation';

export default function DescriptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mid-section-cover">
      <nav>
        <h1>MovingJu</h1>
        <Navigation />
      </nav>
      <main className="sub-mid-section-cover">
        {children}
      </main>
    </div>
  );
}
