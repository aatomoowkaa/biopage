import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { User } from "lucide-react";

export default async function Header() {
  const session = await auth();

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      borderRadius: '0 0 16px 16px'
    }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
        biopage<span style={{ color: 'white' }}>.lol</span>
      </Link>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {session ? (
          <>
            <Link href="/dashboard" style={{ color: 'var(--text-secondary)' }}>Dashboard</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {session.user?.image ? (
                <img src={session.user.image} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              ) : (
                <User size={20} />
              )}
              <form action={async () => {
                "use server";
                await signOut();
              }}>
                <button type="submit" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }}>
                  Sign Out
                </button>
              </form>
            </div>
          </>
        ) : (
          <form action={async () => {
            "use server";
            await signIn("discord");
          }}>
            <button type="submit" className="btn-primary">
              Sign in with Discord
            </button>
          </form>
        )}
      </nav>
    </header>
  );
}
