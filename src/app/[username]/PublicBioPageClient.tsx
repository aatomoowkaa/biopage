"use client";

import { useState } from "react";
import BioPreview from "@/components/BioPreview";

export default function PublicBioPageClient({ bioPage, discordId }: { bioPage: any, discordId?: string }) {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return (
      <div 
        onClick={() => setEntered(true)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2000,
          backgroundColor: '#050505',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', opacity: 0.8 }}>
          click to enter
        </h1>
        <div style={{ width: '40px', height: '2px', background: 'var(--accent)', opacity: 0.5 }}></div>
      </div>
    );
  }

  const socialLinks = typeof bioPage.socialLinks === "string" 
    ? JSON.parse(bioPage.socialLinks) 
    : bioPage.socialLinks;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000 }}>
      <BioPreview 
        data={{
          ...bioPage,
          socialLinks: socialLinks,
        }} 
        discordId={discordId}
        entered={entered}
      />
      
      {/* Branding link for visitors */}
      <a 
        href="/" 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1001, 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.3)',
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 12px',
          borderRadius: '20px',
          backdropFilter: 'blur(4px)',
          textDecoration: 'none'
        }}
      >
        made with <span style={{ color: '#7289da', fontWeight: 'bold' }}>biopage.lol</span>
      </a>
    </div>
  );
}
