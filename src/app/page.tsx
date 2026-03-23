import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: '800' }}>
        Your personal <span style={{ color: 'var(--accent)' }}>bio link</span>, <br />
        elevated.
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        Create a stunning profile with background effects, custom music, and Discord integration. 
        The only bio link you'll ever need.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {session ? (
          <Link href="/dashboard" className="btn-primary" style={{ padding: '12px 32px' }}>
            Go to Dashboard
          </Link>
        ) : (
          <Link href="/api/auth/signin" className="btn-primary" style={{ padding: '12px 32px' }}>
            Get Started Free
          </Link>
        )}
        <Link href="/explore" className="btn-secondary" style={{ padding: '12px 32px' }}>
          Explore Profiles
        </Link>
      </div>

      <div style={{ marginTop: '6rem', position: 'relative' }}>
        <div className="glass" style={{ 
          width: '80%', 
          height: '400px', 
          margin: '0 auto', 
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--glass-border)'
        }}>
          Preview Image / Showcase
        </div>
        {/* Subtle glow effect behind the preview */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '100%',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.1,
          zIndex: -1
        }}></div>
      </div>
    </div>
  );
}
