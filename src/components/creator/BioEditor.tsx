"use client";

import { useState, useRef } from "react";
import { updateBioPage } from "@/lib/actions";
import { HexColorPicker } from "react-colorful";
import { Save, ImageIcon, Link as LinkIcon, Type, Palette, Monitor, Upload, Trash2, CheckCircle } from "lucide-react";
import BioPreview from "@/components/BioPreview";

export default function BioEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("appearance");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBioPage(data);
    } catch (error) {
      console.error(error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file (.mp4, .webm, etc.)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      handleChange("backgroundVideoUrl", url);
    } catch (error) {
      console.error(error);
      alert("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '2rem' }}>
      {/* Sidebar */}
      <div className="glass" style={{ width: '400px', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button 
            onClick={() => setActiveTab("appearance")}
            style={{ flex: 1, padding: '1rem', background: activeTab === "appearance" ? 'var(--bg-accent)' : 'transparent', borderBottom: activeTab === "appearance" ? '2px solid var(--accent)' : 'none' }}
          >
            <Palette size={18} />
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            style={{ flex: 1, padding: '1rem', background: activeTab === "profile" ? 'var(--bg-accent)' : 'transparent', borderBottom: activeTab === "profile" ? '2px solid var(--accent)' : 'none' }}
          >
            <Type size={18} />
          </button>
          <button 
            onClick={() => setActiveTab("links")}
            style={{ flex: 1, padding: '1rem', background: activeTab === "links" ? 'var(--bg-accent)' : 'transparent', borderBottom: activeTab === "links" ? '2px solid var(--accent)' : 'none' }}
          >
            <LinkIcon size={18} />
          </button>
          <button 
            onClick={() => setActiveTab("extras")}
            style={{ flex: 1, padding: '1rem', background: activeTab === "extras" ? 'var(--bg-accent)' : 'transparent', borderBottom: activeTab === "extras" ? '2px solid var(--accent)' : 'none' }}
          >
            <Monitor size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {activeTab === "appearance" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Accent Color</label>
                <HexColorPicker color={data.themeColor} onChange={(color) => handleChange("themeColor", color)} style={{ width: '100%' }} />
              </section>
              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Background Effect</label>
                <select 
                  value={data.backgroundEffect} 
                  onChange={(e) => handleChange("backgroundEffect", e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                >
                  <option value="none">None</option>
                  <option value="snow">Snow</option>
                  <option value="matrix">Matrix</option>
                  <option value="rings">Rings</option>
                </select>
              </section>
              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Background Color</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                   <div style={{ width: '30px', height: '30px', borderRadius: '4px', background: data.bgColor, border: '1px solid var(--border)' }}></div>
                   <input type="text" value={data.bgColor} onChange={(e) => handleChange("bgColor", e.target.value)} style={{ flex: 1, background: 'var(--bg-accent)', border: 'none', padding: '0 8px', borderRadius: '4px', color: 'white' }} />
                </div>
              </section>

              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Background Video</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        value={data.backgroundVideoUrl || ""} 
                        onChange={(e) => handleChange("backgroundVideoUrl", e.target.value)}
                        placeholder="Link to video (.mp4) or YouTube"
                        style={{ flex: 1, padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        style={{ padding: '0 15px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        {isUploading ? "..." : <Upload size={18} />}
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleVideoUpload} 
                        style={{ display: 'none' }} 
                        accept="video/*" 
                      />
                   </div>
                   {data.backgroundVideoUrl?.startsWith("/uploads/") && (
                      <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> File uploaded successfully
                      </div>
                   )}
                </div>
              </section>
            </div>
          )}

          {activeTab === "profile" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Display Name</label>
                <input 
                  type="text" 
                  value={data.displayName} 
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                />
              </section>
              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Bio / Description</label>
                <textarea 
                  value={data.description || ""} 
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', resize: 'none' }}
                />
              </section>
              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Avatar URL</label>
                <input 
                  type="text" 
                  value={data.avatarUrl || ""} 
                  onChange={(e) => handleChange("avatarUrl", e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                />
              </section>
            </div>
          )}

          {activeTab === "links" && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Add your social links below.</p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(data.socialLinks || []).map((link: any, index: number) => (
                    <div key={index} className="glass" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <select 
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...data.socialLinks];
                            newLinks[index].platform = e.target.value;
                            handleChange("socialLinks", newLinks);
                          }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 'bold', outline: 'none' }}
                        >
                          <option value="discord">Discord</option>
                          <option value="twitter">Twitter</option>
                          <option value="instagram">Instagram</option>
                          <option value="github">GitHub</option>
                          <option value="youtube">YouTube</option>
                          <option value="twitch">Twitch</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                        <button 
                          onClick={() => {
                            const newLinks = data.socialLinks.filter((_: any, i: number) => i !== index);
                            handleChange("socialLinks", newLinks);
                          }}
                          style={{ color: '#ff4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input 
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...data.socialLinks];
                          newLinks[index].url = e.target.value;
                          handleChange("socialLinks", newLinks);
                        }}
                        placeholder="URL or Username"
                        style={{ width: '100%', background: 'var(--bg-accent)', border: 'none', padding: '8px', borderRadius: '4px', color: 'white' }}
                      />
                    </div>
                  ))}
               </div>

               <button 
                className="btn-secondary" 
                style={{ width: '100%' }}
                onClick={() => {
                  const newLinks = [...(data.socialLinks || []), { platform: 'twitter', url: '' }];
                  handleChange("socialLinks", newLinks);
                }}
               >
                 + Add New Link
               </button>
             </div>
          )}

          {activeTab === "extras" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div>
                      <h4 style={{ margin: 0 }}>Discord Presence</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Show your live Discord status</p>
                   </div>
                   <input 
                    type="checkbox" 
                    checked={data.showDiscordPresence || false}
                    onChange={(e) => handleChange("showDiscordPresence", e.target.checked)}
                    style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                   />
                </div>
              </section>

              <section>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: 'var(--text-secondary)' }}>Custom Cursor URL</label>
                <input 
                  type="text" 
                  value={data.cursorUrl || ""} 
                  onChange={(e) => handleChange("cursorUrl", e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                />
              </section>
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Preview Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Monitor size={16} /> Live Preview
        </div>
        <div className="glass" style={{ flex: 1, borderRadius: '24px', position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
          <BioPreview data={data} previewMode={true} />
        </div>
      </div>
    </div>
  );
}
