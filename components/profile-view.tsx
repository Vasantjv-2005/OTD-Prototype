"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, ChevronDown, LogOut, Save, Shield, Sparkles, User as UserIcon } from "lucide-react"
import { ClothingItem, SavedLook, User } from "@/lib/types"
import { defaultUser } from "@/lib/data"
import { registerUser, setActiveUser } from "@/lib/storage"

interface ProfileProps {
  pathname: string
  user: User | null
  wardrobe: ClothingItem[]
  savedLooks: SavedLook[]
  onUpdateUser: (user: User | null) => void
  announce: (msg: string) => void
}

const ALL_STYLE_TAGS = ["Minimal", "Effortless", "Tailored", "Relaxed", "Classic", "Romantic", "Bold", "Eclectic"]
const ALL_COLORS = ["Ivory", "Camel", "Indigo", "Charcoal", "Black", "Chalk White", "Champagne", "Espresso", "Olive", "Cognac"]

export function ProfileView({
  pathname,
  user,
  wardrobe,
  savedLooks,
  onUpdateUser,
  announce
}: ProfileProps) {
  const router = useRouter()
  const activeUser = user || defaultUser

  // Editable profile state
  const [name, setName] = useState(activeUser.name)
  const [email, setEmail] = useState(activeUser.email)
  const [bio, setBio] = useState(activeUser.styleBio || "")
  const [selectedStyles, setSelectedStyles] = useState<string[]>(activeUser.preferredStyles || ["Minimal", "Effortless"])
  const [selectedColors, setSelectedColors] = useState<string[]>(activeUser.preferredColors || ["Ivory", "Camel", "Indigo"])
  const [topSize, setTopSize] = useState(activeUser.sizes?.tops || "S")
  const [bottomSize, setBottomSize] = useState(activeUser.sizes?.bottoms || "27 / S")
  const [shoeSize, setShoeSize] = useState(activeUser.sizes?.shoes || "38 EU / 7.5 US")

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    const updated: User = {
      ...activeUser,
      name: name.trim(),
      email: email.trim(),
      styleBio: bio.trim(),
      preferredStyles: selectedStyles,
      preferredColors: selectedColors,
      sizes: {
        tops: topSize,
        bottoms: bottomSize,
        shoes: shoeSize
      }
    }
    setActiveUser(updated)
    onUpdateUser(updated)
    announce("Your profile and style preferences have been updated!")
  }

  function handleSignOut() {
    setActiveUser(null)
    onUpdateUser(null)
    announce("Signed out successfully. See you soon!")
    router.push("/")
  }

  function toggleStyleTag(tag: string) {
    setSelectedStyles(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function toggleColorTag(col: string) {
    setSelectedColors(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    )
  }

  // Onboarding Quiz View
  if (pathname === "/onboarding") {
    return (
      <div className="auth-panel" style={{ maxWidth: 560 }}>
        <p className="eyebrow">YOUR STYLE IDENTITY · STEP 01 OF 03</p>
        <h2>What feels like you?</h2>
        <p style={{ color: "#716960", fontSize: 12, lineHeight: 1.7, marginBottom: 20 }}>
          Select the aesthetics that best describe your personal wardrobe goals. You can adjust these anytime.
        </p>

        <div className="onboarding-options" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {ALL_STYLE_TAGS.map(tag => {
            const isSelected = selectedStyles.includes(tag)
            return (
              <button
                type="button"
                key={tag}
                className={isSelected ? "selected" : ""}
                onClick={() => toggleStyleTag(tag)}
                style={{ padding: "12px 14px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>{tag}</span>
                {isSelected && <Check size={14} />}
              </button>
            )
          })}
        </div>

        <p className="eyebrow" style={{ marginTop: 24, marginBottom: 10 }}>PREFERRED PALETTE</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
          {ALL_COLORS.map(col => {
            const isChosen = selectedColors.includes(col)
            return (
              <button
                type="button"
                key={col}
                className={`filter-chip ${isChosen ? "selected" : ""}`}
                onClick={() => toggleColorTag(col)}
              >
                {col}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="button button-dark full-button"
          onClick={() => {
            const updated: User = {
              ...activeUser,
              preferredStyles: selectedStyles,
              preferredColors: selectedColors
            }
            registerUser(updated)
            onUpdateUser(updated)
            announce("Welcome to your digital closet!")
            router.push("/closet")
          }}
        >
          Enter my digital closet <ArrowRight size={15} />
        </button>
      </div>
    )
  }

  // Profile View
  return (
    <div style={{ maxWidth: 840, margin: "20px auto" }}>
      {/* Profile Header Card */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, padding: 28, background: "#FFFEFA", border: "1px solid var(--otd-border)", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={activeUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
            alt={activeUser.name}
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "1px solid #C6AC83" }}
          />
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>MEMBER SINCE {activeUser.joinedDate?.toUpperCase() || "2026"}</p>
            <h2 style={{ font: "400 28px 'Playfair Display', Georgia, serif", margin: "4px 0" }}>
              {activeUser.name}
            </h2>
            <span style={{ fontSize: 11, color: "#716960" }}>{activeUser.email}</span>
          </div>
        </div>

        <button
          type="button"
          className="button button-outline"
          onClick={handleSignOut}
          style={{ minHeight: 38 }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      {/* Wardrobe Metrics Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        <div style={{ background: "#FFFEFA", border: "1px solid var(--otd-border)", padding: "18px 20px" }}>
          <span style={{ fontSize: 9, letterSpacing: ".12em", color: "#81776B", textTransform: "uppercase" }}>CLOSET PIECES</span>
          <strong style={{ font: "400 28px 'Playfair Display', Georgia, serif", display: "block", marginTop: 4 }}>
            {wardrobe.length}
          </strong>
          <Link href="/closet" className="text-link" style={{ fontSize: 10, marginTop: 4 }}>
            View closet <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ background: "#FFFEFA", border: "1px solid var(--otd-border)", padding: "18px 20px" }}>
          <span style={{ fontSize: 9, letterSpacing: ".12em", color: "#81776B", textTransform: "uppercase" }}>SAVED LOOKS</span>
          <strong style={{ font: "400 28px 'Playfair Display', Georgia, serif", display: "block", marginTop: 4 }}>
            {savedLooks.length}
          </strong>
          <Link href="/looks" className="text-link" style={{ fontSize: 10, marginTop: 4 }}>
            View looks <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ background: "#FFFEFA", border: "1px solid var(--otd-border)", padding: "18px 20px" }}>
          <span style={{ fontSize: 9, letterSpacing: ".12em", color: "#81776B", textTransform: "uppercase" }}>STYLE ARCHETYPE</span>
          <strong style={{ font: "400 24px 'Playfair Display', Georgia, serif", display: "block", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedStyles[0] || "Minimal"}
          </strong>
          <span style={{ fontSize: 10, color: "#716960" }}>Curated Capsule</span>
        </div>
      </div>

      {/* Edit Profile & Preferences Form */}
      <form onSubmit={handleSaveProfile} style={{ background: "#FFFEFA", border: "1px solid var(--otd-border)", padding: 32 }}>
        <p className="eyebrow">YOUR PREFERENCES</p>
        <h3 style={{ font: "400 24px 'Playfair Display', Georgia, serif", margin: "4px 0 20px" }}>
          Personal Information & Sizing
        </h3>

        <div className="field-row">
          <div>
            <label className="field-label" htmlFor="prof-name">Display Name</label>
            <input
              id="prof-name"
              className="field"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="prof-email">Email Address</label>
            <input
              id="prof-email"
              type="email"
              className="field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <label className="field-label" htmlFor="prof-bio">Personal Style Philosophy</label>
        <textarea
          id="prof-bio"
          className="field"
          rows={2}
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="e.g. Timeless neutral capsule wardrobe with focus on quality natural fabrics."
        />

        <div style={{ borderTop: "1px solid var(--otd-border)", margin: "24px 0", paddingTop: 20 }}>
          <label className="field-label" style={{ margin: "0 0 10px" }}>Style Aesthetics</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ALL_STYLE_TAGS.map(tag => {
              const isSelected = selectedStyles.includes(tag)
              return (
                <button
                  type="button"
                  key={tag}
                  className={`filter-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleStyleTag(tag)}
                >
                  {tag} {isSelected && "✓"}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--otd-border)", margin: "24px 0", paddingTop: 20 }}>
          <label className="field-label" style={{ margin: "0 0 10px" }}>Preferred Color Palette</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ALL_COLORS.map(col => {
              const isChosen = selectedColors.includes(col)
              return (
                <button
                  type="button"
                  key={col}
                  className={`filter-chip ${isChosen ? "selected" : ""}`}
                  onClick={() => toggleColorTag(col)}
                >
                  {col} {isChosen && "✓"}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--otd-border)", margin: "24px 0", paddingTop: 20 }}>
          <label className="field-label" style={{ margin: "0 0 10px" }}>Standard Sizes</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <div>
              <label style={{ fontSize: 9, color: "#81776B", textTransform: "uppercase" }}>Tops</label>
              <input
                className="field"
                value={topSize}
                onChange={e => setTopSize(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#81776B", textTransform: "uppercase" }}>Bottoms</label>
              <input
                className="field"
                value={bottomSize}
                onChange={e => setBottomSize(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 9, color: "#81776B", textTransform: "uppercase" }}>Footwear</label>
              <input
                className="field"
                value={shoeSize}
                onChange={e => setShoeSize(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
          <button type="submit" className="button button-dark">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
