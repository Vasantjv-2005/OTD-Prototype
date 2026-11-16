"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bookmark, Check, RefreshCw, Shirt, Sparkles } from "lucide-react"
import { ClothingItem, SavedLook } from "@/lib/types"

interface TryOnProps {
  wardrobe: ClothingItem[]
  savedLooks: SavedLook[]
  onUpdateSavedLooks: (looks: SavedLook[]) => void
  announce: (msg: string) => void
}

const AVATAR_PROFILES = [
  { id: "ava-1", name: "Silvia", height: "5'9\"", fit: "Relaxed Minimalist", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
  { id: "ava-2", name: "Elena", height: "5'7\"", fit: "Architectural Tailoring", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" },
  { id: "ava-3", name: "Maya", height: "5'8\"", fit: "Effortless Neutral", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" }
]

export function TryOnView({ wardrobe, savedLooks, onUpdateSavedLooks, announce }: TryOnProps) {
  const tops = useMemo(() => wardrobe.filter(w => w.category === "Tops"), [wardrobe])
  const bottoms = useMemo(() => wardrobe.filter(w => w.category === "Bottoms"), [wardrobe])
  const outerwear = useMemo(() => wardrobe.filter(w => w.category === "Outerwear"), [wardrobe])
  const shoes = useMemo(() => wardrobe.filter(w => w.category === "Shoes"), [wardrobe])

  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PROFILES[0])
  const [selectedTopId, setSelectedTopId] = useState<string>(tops[0]?.id || "")
  const [selectedBottomId, setSelectedBottomId] = useState<string>(bottoms[0]?.id || "")
  const [selectedOuterId, setSelectedOuterId] = useState<string>(outerwear[0]?.id || "")
  const [selectedShoeId, setSelectedShoeId] = useState<string>(shoes[0]?.id || "")

  const activeTop = tops.find(t => t.id === selectedTopId) || tops[0]
  const activeBottom = bottoms.find(b => b.id === selectedBottomId) || bottoms[0]
  const activeOuter = outerwear.find(o => o.id === selectedOuterId) || outerwear[0]
  const activeShoe = shoes.find(s => s.id === selectedShoeId) || shoes[0]

  // Dynamic aesthetic harmony score
  const harmonyScore = useMemo(() => {
    let score = 88
    if (activeTop?.color === "Ivory" && activeOuter?.color === "Camel") score += 8
    if (activeBottom?.color === "Indigo" || activeBottom?.color === "Charcoal") score += 3
    return Math.min(score, 99)
  }, [activeTop, activeBottom, activeOuter])

  function handleSaveOutfit() {
    const pieces = [activeTop, activeBottom, activeOuter, activeShoe].filter(Boolean) as ClothingItem[]
    const lookName = `Studio Layered: ${activeOuter ? activeOuter.name : activeTop?.name}`

    const newLook: SavedLook = {
      id: "look-" + Date.now(),
      title: lookName,
      occasion: "Studio Try-On",
      mood: "Tailored",
      destination: "Mix & Match Studio",
      image: activeOuter?.photo || activeTop?.photo || selectedAvatar.photo,
      items: pieces.map(p => p.name),
      dateSaved: new Date().toISOString().split("T")[0],
      tags: ["Try-On", "Mix & Match"]
    }

    onUpdateSavedLooks([newLook, ...savedLooks])
    announce(`Saved "${lookName}" to your looks!`)
  }

  function handleRandomize() {
    if (tops.length) setSelectedTopId(tops[Math.floor(Math.random() * tops.length)].id)
    if (bottoms.length) setSelectedBottomId(bottoms[Math.floor(Math.random() * bottoms.length)].id)
    if (outerwear.length) setSelectedOuterId(outerwear[Math.floor(Math.random() * outerwear.length)].id)
    if (shoes.length) setSelectedShoeId(shoes[Math.floor(Math.random() * shoes.length)].id)
    announce("Assembled new studio pairing!")
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", borderBottom: "1px solid var(--otd-border)", paddingBottom: 24, margin: "20px 0 30px" }}>
        <div>
          <p className="eyebrow">DIGITAL SILHOUETTE STUDIO</p>
          <h2 style={{ font: "400 36px 'Playfair Display', Georgia, serif", margin: "6px 0 0" }}>
            Virtual Try-On & Layering
          </h2>
        </div>
        <button
          type="button"
          className="button button-outline"
          onClick={handleRandomize}
        >
          <RefreshCw size={14} /> Mix random pieces
        </button>
      </div>

      <div className="tryon-grid">
        {/* Visual Canvas */}
        <div className="tryon-canvas">
          <div style={{ position: "absolute", top: 16, left: 16, background: "#3B3834", color: "white", padding: "6px 12px", fontSize: 9, letterSpacing: ".1em" }}>
            <Sparkles size={11} style={{ display: "inline", marginRight: 5 }} />
            {harmonyScore}% AESTHETIC HARMONY
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={selectedAvatar.photo}
              alt={selectedAvatar.name}
              style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", margin: "0 auto 8px", border: "2px solid #C6AC83" }}
            />
            <strong style={{ fontSize: 13, display: "block" }}>{selectedAvatar.name}</strong>
            <span style={{ fontSize: 10, color: "#81776B" }}>Silhouette: {selectedAvatar.fit}</span>
          </div>

          {/* Layered stack */}
          <div className="tryon-layers">
            {activeOuter && (
              <div className="tryon-item-slot">
                <img src={activeOuter.photo} alt={activeOuter.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 8, color: "#81776B" }}>LAYER 01 · OUTERWEAR</span>
                  <strong style={{ fontSize: 11, display: "block" }}>{activeOuter.name}</strong>
                  <small style={{ color: "#716960", fontSize: 9 }}>{activeOuter.color}</small>
                </div>
              </div>
            )}

            {activeTop && (
              <div className="tryon-item-slot">
                <img src={activeTop.photo} alt={activeTop.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 8, color: "#81776B" }}>LAYER 02 · TOP</span>
                  <strong style={{ fontSize: 11, display: "block" }}>{activeTop.name}</strong>
                  <small style={{ color: "#716960", fontSize: 9 }}>{activeTop.color}</small>
                </div>
              </div>
            )}

            {activeBottom && (
              <div className="tryon-item-slot">
                <img src={activeBottom.photo} alt={activeBottom.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 8, color: "#81776B" }}>LAYER 03 · BOTTOM</span>
                  <strong style={{ fontSize: 11, display: "block" }}>{activeBottom.name}</strong>
                  <small style={{ color: "#716960", fontSize: 9 }}>{activeBottom.color}</small>
                </div>
              </div>
            )}

            {activeShoe && (
              <div className="tryon-item-slot">
                <img src={activeShoe.photo} alt={activeShoe.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 8, color: "#81776B" }}>LAYER 04 · FOOTWEAR</span>
                  <strong style={{ fontSize: 11, display: "block" }}>{activeShoe.name}</strong>
                  <small style={{ color: "#716960", fontSize: 9 }}>{activeShoe.color}</small>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="button button-dark full-button"
            style={{ maxWidth: 320, marginTop: 24 }}
            onClick={handleSaveOutfit}
          >
            <Bookmark size={14} /> Save this look to collection
          </button>
        </div>

        {/* Mix & Match Controls */}
        <div style={{ background: "#FFFEFA", border: "1px solid var(--otd-border)", padding: 26 }}>
          <p className="eyebrow">STEP 1: SELECT SILHOUETTE</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "8px 0 24px" }}>
            {AVATAR_PROFILES.map(ava => (
              <button
                type="button"
                key={ava.id}
                onClick={() => setSelectedAvatar(ava)}
                style={{
                  border: selectedAvatar.id === ava.id ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                  background: "#FAF7F0",
                  padding: 8,
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <img src={ava.photo} alt={ava.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", margin: "0 auto 4px" }} />
                <strong style={{ fontSize: 10, display: "block" }}>{ava.name}</strong>
                <span style={{ fontSize: 8, color: "#716960" }}>{ava.fit}</span>
              </button>
            ))}
          </div>

          <p className="eyebrow">STEP 2: PICK CLOSET PIECES</p>

          {/* Outerwear selector */}
          <label className="field-label" style={{ marginTop: 10 }}>Outerwear</label>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {outerwear.map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedOuterId(item.id)}
                style={{
                  flexShrink: 0,
                  width: 65,
                  border: selectedOuterId === item.id ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                  padding: 4,
                  background: "#FFFEFA",
                  cursor: "pointer"
                }}
              >
                <img src={item.photo} alt={item.name} style={{ width: "100%", height: 50, objectFit: "cover" }} />
                <span style={{ fontSize: 8, display: "block", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Top selector */}
          <label className="field-label" style={{ marginTop: 14 }}>Tops</label>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {tops.map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedTopId(item.id)}
                style={{
                  flexShrink: 0,
                  width: 65,
                  border: selectedTopId === item.id ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                  padding: 4,
                  background: "#FFFEFA",
                  cursor: "pointer"
                }}
              >
                <img src={item.photo} alt={item.name} style={{ width: "100%", height: 50, objectFit: "cover" }} />
                <span style={{ fontSize: 8, display: "block", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Bottom selector */}
          <label className="field-label" style={{ marginTop: 14 }}>Bottoms</label>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {bottoms.map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedBottomId(item.id)}
                style={{
                  flexShrink: 0,
                  width: 65,
                  border: selectedBottomId === item.id ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                  padding: 4,
                  background: "#FFFEFA",
                  cursor: "pointer"
                }}
              >
                <img src={item.photo} alt={item.name} style={{ width: "100%", height: 50, objectFit: "cover" }} />
                <span style={{ fontSize: 8, display: "block", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Shoes selector */}
          <label className="field-label" style={{ marginTop: 14 }}>Shoes</label>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {shoes.map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedShoeId(item.id)}
                style={{
                  flexShrink: 0,
                  width: 65,
                  border: selectedShoeId === item.id ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                  padding: 4,
                  background: "#FFFEFA",
                  cursor: "pointer"
                }}
              >
                <img src={item.photo} alt={item.name} style={{ width: "100%", height: 50, objectFit: "cover" }} />
                <span style={{ fontSize: 8, display: "block", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
