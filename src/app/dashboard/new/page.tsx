import { auth } from "@/auth";
import { createBioPage } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function NewBioPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Claim your name</h1>
      <form action={createBioPage} className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Username
          </label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-accent)', borderRadius: '8px', padding: '0 12px', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>biopage.lol/</span>
            <input
              type="text"
              name="username"
              id="username"
              required
              minLength={3}
              placeholder="username"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                padding: '12px 4px',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Claim and Continue
        </button>
      </form>
    </div>
  );
}
