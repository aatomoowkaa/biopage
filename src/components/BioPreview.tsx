"use client";

import { useEffect, useRef, useState } from "react";
import { 
  FaDiscord, FaTwitter, FaInstagram, FaGithub, FaYoutube, FaTwitch, FaExternalLinkAlt, FaTiktok, FaVolumeUp, FaVolumeMute
} from "react-icons/fa";

// Lanyard types
interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: {
    name: string;
    state?: string;
    details?: string;
    assets?: { large_image: string; small_image: string };
    type: number;
    timestamps?: { start?: number };
  }[];
  discord_user: {
    username: string;
    discriminator: string;
    avatar: string;
  };
}

export default function BioPreview({ 
  data, 
  previewMode = false, 
  discordId, 
  entered = false 
}: { 
  data: any, 
  previewMode?: boolean, 
  discordId?: string, 
  entered?: boolean 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [presence, setPresence] = useState<LanyardData | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Helper to get social icon
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'discord': return <FaDiscord size={20} />;
      case 'twitter': return <FaTwitter size={20} />;
      case 'instagram': return <FaInstagram size={20} />;
      case 'github': return <FaGithub size={20} />;
      case 'youtube': return <FaYoutube size={20} />;
      case 'twitch': return <FaTwitch size={20} />;
      case 'tiktok': return <FaTiktok size={20} />;
      default: return <FaExternalLinkAlt size={18} />;
    }
  };

  // Helper for YouTube ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(data.backgroundVideoUrl || "");

  // Fetch Discord Presence
  useEffect(() => {
    if (!discordId || !data.showDiscordPresence) return;

    const fetchPresence = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const json = await res.json();
        if (json.success) setPresence(json.data);
      } catch (err) {
        console.error("Lanyard error:", err);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 30000);
    return () => clearInterval(interval);
  }, [discordId, data.showDiscordPresence]);

  // Handle Video Volume
  useEffect(() => {
    const currentVolume = isMuted ? 0 : volume;
    if (videoRef.current) {
      videoRef.current.volume = currentVolume;
    }
    if (iframeRef.current && youtubeId) {
       iframeRef.current.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [currentVolume * 100]
      }), '*');
    }
  }, [volume, youtubeId, isMuted]);

  // Handle Video Audio Play/Mute
  useEffect(() => {
    if (videoRef.current) {
      if (entered && !previewMode) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      } else {
        videoRef.current.muted = true;
      }
    }
  }, [entered, previewMode]);

  useEffect(() => {
    if (data.backgroundEffect === "none" || !canvasRef.current || data.backgroundVideoUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: any[] = [];
    
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Effect logic...
    if (data.backgroundEffect === "snow") {
       particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        d: Math.random() * 1,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        for (let p of particles) {
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        }
        ctx.fill();
        updateSnow();
        animationId = requestAnimationFrame(draw);
      };

      const updateSnow = () => {
        for (let p of particles) {
          p.y += Math.cos(p.d) + 1 + p.r / 2;
          p.x += Math.sin(0) * 2;
          if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = -10;
          }
        }
      };
      draw();
    }

    if (data.backgroundEffect === "matrix") {
      const columns = Math.floor(canvas.width / 20);
      const drops: number[] = Array(columns).fill(1);

      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = data.themeColor || "#0F0";
        ctx.font = "15px monospace";

        for (let i = 0; i < drops.length; i++) {
          const text = String.fromCharCode(Math.random() * 128);
          ctx.fillText(text, i * 20, drops[i] * 20);
          if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
        animationId = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [data.backgroundEffect, data.themeColor, data.backgroundVideoUrl]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "#43b581";
      case "idle": return "#faa61a";
      case "dnd": return "#f04747";
      default: return "#747f8d";
    }
  };

  // Improved Activity Selection
  const getActivity = () => {
    if (!presence) return null;
    
    // 1. Priority: Game (type 0)
    const game = presence.activities.find(a => a.type === 0);
    if (game) return { ...game, icon: <FaDiscord size={24} />, label: "Playing" };

    // 2. Priority: Spotify (type 2)
    const spotify = presence.activities.find(a => a.type === 2);
    if (spotify) return { ...spotify, name: spotify.details, details: `by ${spotify.state}`, icon: <FaTwitch size={24} style={{ color: '#1DB954' }} />, label: "Listening to Spotify" };

    // 3. Priority: Custom Status (type 4)
    const custom = presence.activities.find(a => a.type === 4);
    if (custom) return { ...custom, name: custom.state, details: "", icon: <FaDiscord size={24} />, label: "Status" };

    return null;
  };

  const activity = getActivity();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: data.bgColor || '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      cursor: data.cursorUrl ? `url(${data.cursorUrl}), auto` : 'auto',
      color: data.textColor || 'white',
      overflow: 'hidden',
      borderRadius: previewMode ? 'inherit' : '0'
    }}>
      {/* Video Background */}
      {data.backgroundVideoUrl && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          {youtubeId ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${entered ? 0 : 1}&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1`}
              style={{ width: '100%', height: '100%', border: 'none', transform: 'scale(1.5)' }}
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video 
              ref={videoRef}
              src={data.backgroundVideoUrl} 
              autoPlay muted loop playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}></div>
        </div>
      )}

      {/* Background Canvas for Effects */}
      {!data.backgroundVideoUrl && (
        <canvas 
          ref={canvasRef} 
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} 
        />
      )}

      {/* Volume Control */}
      {entered && !previewMode && data.backgroundVideoUrl && (
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          left: '20px', 
          zIndex: 1002, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          background: 'rgba(0,0,0,0.5)',
          padding: '8px 12px',
          borderRadius: '20px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease'
        }}>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
          >
            {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            style={{ 
              width: '80px', 
              accentColor: data.themeColor || 'var(--accent)',
              cursor: 'pointer'
            }}
          />
        </div>
      )}

      {/* Profile Card */}
      <div className="glass" style={{
        zIndex: 1,
        width: '90%',
        maxWidth: '450px',
        padding: '3rem 2rem',
        borderRadius: '24px',
        textAlign: 'center',
        border: `1px solid ${data.themeColor}33` || '1px solid var(--glass-border)',
        boxShadow: `0 8px 32px 0 ${data.themeColor}1a` || 'var(--shadow)',
        backdropFilter: 'blur(16px)',
      }}>
        {/* Avatar with Status */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
          <img 
            src={data.avatarUrl || 'https://via.placeholder.com/150'} 
            alt="Avatar" 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: `3px solid ${data.themeColor}`
            }} 
          />
          {presence && data.showDiscordPresence && (
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(presence.discord_status)
              }}></div>
            </div>
          )}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            boxShadow: `0 0 20px ${data.themeColor}`,
            zIndex: -1,
            opacity: 0.5
          }}></div>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{data.displayName}</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>@{data.username}</p>
        
        {data.description && (
          <p style={{ marginBottom: '2rem', lineHeight: '1.6', fontSize: '1rem' }}>
            {data.description}
          </p>
        )}

        {/* Discord Activity */}
        {presence && data.showDiscordPresence && activity && (
            <div style={{ 
              marginBottom: '2rem', 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}>
               <div style={{ color: data.themeColor }}>{activity.icon}</div>
               <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.5, fontWeight: 'bold' }}>{activity.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{activity.name}</div>
                  {activity.details && <div style={{ fontSize: '11px', opacity: 0.7 }}>{activity.details}</div>}
               </div>
            </div>
        )}

        {/* Social Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {(data.socialLinks || []).map((link: any, index: number) => (
            <SocialLink 
              key={index}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
              icon={getSocialIcon(link.platform)} 
              color={data.themeColor} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon, color }: { href: string, icon: any, color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      width: '45px',
      height: '45px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.2s ease',
      color: 'white'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = `${color}33`;
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {icon}
    </a>
  );
}
