import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Edit, ExternalLink, Eye } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const bioPage = await prisma.bioPage.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Welcome, {session.user.name}</h1>
        {!bioPage && (
          <Link href="/dashboard/new" className="btn-primary">
            <Plus size={18} /> Create Bio
          </Link>
        )}
      </div>

      {bioPage ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{bioPage.displayName || bioPage.username}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                biopage.lol/{bioPage.username}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href={`/dashboard/edit`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                  <Edit size={16} /> Edit Profile
                </Link>
                <Link href={`/${bioPage.username}`} target="_blank" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                  <ExternalLink size={16} /> View Public
                </Link>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Eye size={18} />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>{bioPage.views}</span>
                <span>views</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '16px', borderStyle: 'dashed' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You haven't created a bio page yet. Claim your username now!
          </p>
          <Link href="/dashboard/new" className="btn-primary">
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
