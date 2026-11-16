"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Bookmark, Calendar, Check, ChevronDown, CloudSun, Plus, RotateCcw, Sparkles, Trash2, X } from "lucide-react"
import { ClothingItem, SavedLook } from "@/lib/types"

interface StylingProps {
  pathname: string
  wardrobe: ClothingItem[]
  savedLooks: SavedLook[]
  onUpdateSavedLooks: (looks: SavedLook[]) => void
  announce: (msg: string) => void
}

const DESTINATION_PILLS = [
  "West Village Bistro",
  "Design Studio Meeting",
  "Sunday Gallery Walk",
  "Rooftop Sunset Drinks",
  "Weekend Getaway",
  "Casual Coffee & Work"
]

export function StylingView({
  pathname,
  wardrobe,
  savedLooks,
  onUpdateSavedLooks,
  announce
}: StylingProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pre-fill from query params if available
  const initialDestination = searchParams.get("destination") || ""
  const initialOccasion = searchParams.get("occasion") || "Dinner"
  const initialMood = searchParams.get("mood") || "Effortless"
  const selectedParam = searchParams.get("selected") || ""

  const [destination, setDestination] = useState(initialDestination)
  const [occasion, setOccasion] = useState(initialOccasion)
  const [mood, setMood] = useState(initialMood)
  const [weather, setWeather] = useState("Mild (18°C)")
  const [timeOfDay, setTimeOfDay] = useState("Tonight")
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    selectedParam ? selectedParam.split(",").filter(Boolean) : []
  )

  // Keep state in sync with URL searchParams
  useEffect(() => {
    const qDest = searchParams.get("destination")
    const qOcc = searchParams.get("occasion")
    const qMood = searchParams.get("mood")
    const qSel = searchParams.get("selected")
    if (qDest !== null) setDestination(qDest)
    if (qOcc !== null) setOccasion(qOcc)
    if (qMood !== null) setMood(qMood)
    if (qSel !== null) setSelectedItemIds(qSel.split(",").filter(Boolean))
  }, [searchParams])

  // Results cycle index for "Shuffle / Try another look"
  const [shuffleIndex, setShuffleIndex] = useState(0)

  // Filter saved looks in /looks
  const [looksFilter, setLooksFilter] = useState("All")

  // Generate dynamic outfit based on wardrobe, occasion, mood, and selected items
  const generatedLook = useMemo(() => {
    // Collect pieces
    const tops = wardrobe.filter(i => i.category === "Tops")
    const bottoms = wardrobe.filter(i => i.category === "Bottoms")
    const outerwear = wardrobe.filter(i => i.category === "Outerwear")
    const shoes = wardrobe.filter(i => i.category === "Shoes")
    const dresses = wardrobe.filter(i => i.category === "Dresses")
    const accessories = wardrobe.filter(i => i.category === "Accessories")

    // Selected items
    const selectedPieces = wardrobe.filter(i => selectedItemIds.includes(i.id))

    // Pick top and bottom or dress
    let top = selectedPieces.find(i => i.category === "Tops") || tops[shuffleIndex % Math.max(1, tops.length)]
    let bottom = selectedPieces.find(i => i.category === "Bottoms") || bottoms[shuffleIndex % Math.max(1, bottoms.length)]
    let coat = selectedPieces.find(i => i.category === "Outerwear") || outerwear[shuffleIndex % Math.max(1, outerwear.length)]
    let footwear = selectedPieces.find(i => i.category === "Shoes") || shoes[shuffleIndex % Math.max(1, shoes.length)]
    let accessory = selectedPieces.find(i => i.category === "Accessories") || accessories[shuffleIndex % Math.max(1, accessories.length)]

    const outfitItems = [top, bottom, coat, footwear, accessory].filter(Boolean) as ClothingItem[]
    const itemNames = outfitItems.map(i => i.name)

    // Curated title based on mood & pieces
    const primaryPiece = coat ? coat.name : (top ? top.name : "Tonal Ensemble")
    const secondaryPiece = bottom ? bottom.name : "Relaxed Silhouettes"
    const title = `${mood} Harmony: ${primaryPiece} & ${secondaryPiece}`

    const lookImages = [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
    ]
    const chosenImage = outfitItems[0]?.photo || lookImages[shuffleIndex % lookImages.length]

    return {
      title,
      occasion,
      mood,
      destination: destination || "Wherever the moment leads",
      image: chosenImage,
      items: itemNames,
      outfitPieces: outfitItems
    }
  }, [wardrobe, occasion, mood, destination, selectedItemIds, shuffleIndex])

  // Check if current generated look is saved
  const isCurrentLookSaved = useMemo(() => {
    return savedLooks.some(l => l.title === generatedLook.title)
  }, [savedLooks, generatedLook.title])

  // Save / Toggle current look
  function handleToggleSaveLook() {
    if (isCurrentLookSaved) {
      const updated = savedLooks.filter(l => l.title !== generatedLook.title)
      onUpdateSavedLooks(updated)
      announce("Removed from Saved Looks")
    } else {
      const newLook: SavedLook = {
        id: "look-" + Date.now(),
        title: generatedLook.title,
        occasion: generatedLook.occasion,
        mood: generatedLook.mood,
        destination: generatedLook.destination,
        image: generatedLook.image,
        items: generatedLook.items,
        notes: `Designed for ${generatedLook.occasion} with a ${generatedLook.mood} sensibility.`,
        dateSaved: new Date().toISOString().split("T")[0],
        tags: [generatedLook.occasion, generatedLook.mood]
      }
      const updated = [newLook, ...savedLooks.filter(l => l.title !== newLook.title)]
      onUpdateSavedLooks(updated)
      announce(`Saved "${generatedLook.title}" to your Saved Looks!`)
    }
  }

  // Handle Remove saved look
  function handleRemoveSavedLook(id: string, title: string) {
    const updated = savedLooks.filter(l => l.id !== id)
    onUpdateSavedLooks(updated)
    announce(`Removed "${title}" from saved looks`)
  }

  // 1. /style - The Wizard
  if (pathname === "/style") {
    return (
      <section className="wizard-layout">
        <div className="wizard-card">
          <p className="eyebrow">A LOOK THAT STARTS WITH YOU</p>
          <h2>Where are you headed?</h2>
          <p style={{ color: "#716960", fontSize: 12, lineHeight: 1.7, margin: "10px 0 16px" }}>
            Tell us about your plans. OTD will pair pieces directly from your digital closet.
          </p>

          <label className="field-label" htmlFor="style-place">Destination</label>
          <input
            id="style-place"
            className="field"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="Neighborhood, venue, or occasion..."
          />

          {/* Destination inspiration chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0 16px" }}>
            {DESTINATION_PILLS.map(pill => (
              <button
                type="button"
                key={pill}
                onClick={() => setDestination(pill)}
                style={{
                  fontSize: 10,
                  padding: "4px 9px",
                  border: "1px solid var(--otd-border)",
                  background: destination === pill ? "#3B3834" : "#FFFEFA",
                  color: destination === pill ? "#FFFEFA" : "#716960",
                  cursor: "pointer"
                }}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="field-row">
            <div>
              <label className="field-label" htmlFor="style-occasion">Occasion</label>
              <select
                id="style-occasion"
                className="field"
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
              >
                {["Dinner", "Work", "Date", "Casual", "Weekend", "Party", "Wedding", "Travel"].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="style-mood">Mood</label>
              <select
                id="style-mood"
                className="field"
                value={mood}
                onChange={e => setMood(e.target.value)}
              >
                {["Effortless", "Minimal", "Elegant", "Relaxed", "Bold", "Romantic", "Smart"].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row" style={{ marginTop: 12 }}>
            <div>
              <label className="field-label" htmlFor="style-weather">Weather</label>
              <select
                id="style-weather"
                className="field"
                value={weather}
                onChange={e => setWeather(e.target.value)}
              >
                {["Mild (18°C)", "Chilly (12°C)", "Warm (25°C)", "Rainy / Overcast", "Crisp Autumn"].map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="style-time">When?</label>
              <select
                id="style-time"
                className="field"
                value={timeOfDay}
                onChange={e => setTimeOfDay(e.target.value)}
              >
                {["Tonight", "Tomorrow", "This weekend", "Next week"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional: Pick closet piece to include */}
          {wardrobe.length > 0 && (
            <div style={{ marginTop: 18, borderTop: "1px solid var(--otd-border)", paddingTop: 14 }}>
              <label className="field-label" style={{ margin: "0 0 8px" }}>
                Anchor with a piece from your closet (optional)
              </label>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                {wardrobe.map(item => {
                  const isChecked = selectedItemIds.includes(item.id)
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        setSelectedItemIds(prev =>
                          prev.includes(item.id)
                            ? prev.filter(x => x !== item.id)
                            : [...prev, item.id]
                        )
                      }
                      style={{
                        flexShrink: 0,
                        border: isChecked ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                        background: "#FFFEFA",
                        padding: 4,
                        textAlign: "center",
                        width: 70,
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      <img
                        src={item.photo}
                        alt={item.name}
                        style={{ width: "100%", height: 50, objectFit: "cover" }}
                      />
                      <span style={{ fontSize: 8, display: "block", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </span>
                      {isChecked && (
                        <div style={{ position: "absolute", top: 2, right: 2, background: "#3B3834", color: "white", borderRadius: "50%", padding: 1 }}>
                          <Check size={10} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="wizard-actions">
            <span>01 <i /> 05 · YOUR PLANS</span>
            <Link
              href={`/style/results?destination=${encodeURIComponent(destination)}&occasion=${encodeURIComponent(occasion)}&mood=${encodeURIComponent(mood)}&weather=${encodeURIComponent(weather)}&selected=${selectedItemIds.join(",")}`}
              className="button button-dark"
            >
              Find my look <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="wizard-image">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
            alt="Outfit inspiration for a night out"
          />
          <p>YOUR WARDROBE + YOUR PLANS = YOUR LOOK</p>
        </div>
      </section>
    )
  }

  // 2. /style/results - The Curated Look
  if (pathname === "/style/results") {
    return (
      <div className="result-layout">
        <div className="result-photo">
          <img src={generatedLook.image} alt={generatedLook.title} />
          <span className="demo-pill">CURATED CAPSULE LOOK</span>
        </div>

        <div className="result-copy">
          <p className="eyebrow">A TAILORED FORMULA FOR {generatedLook.occasion.toUpperCase()}</p>
          <h2>{generatedLook.title}</h2>
          <p>
            An effortless silhouette blending relaxed proportions with refined fabric textures.
            Built from your wardrobe pieces to match a <strong>{generatedLook.mood.toLowerCase()}</strong> sensibility.
          </p>

          <div className="result-meta">
            <span>YOUR MOOD</span>
            <strong>{generatedLook.mood}</strong>
            <span>YOUR DESTINATION</span>
            <strong>{generatedLook.destination}</strong>
          </div>

          {/* Breakdown of items in this outfit */}
          <div style={{ margin: "16px 0 20px" }}>
            <span style={{ fontSize: 9, letterSpacing: ".12em", color: "#81776B", textTransform: "uppercase" }}>
              WARDROBE PIECES IN THIS LOOK
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginTop: 8 }}>
              {generatedLook.outfitPieces.map(piece => (
                <div
                  key={piece.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    background: "#FFFEFA",
                    border: "1px solid var(--otd-border)"
                  }}
                >
                  <img
                    src={piece.photo}
                    alt={piece.name}
                    style={{ width: 34, height: 34, objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 8, color: "#81776B", display: "block" }}>{piece.category}</span>
                    <strong style={{ fontSize: 10, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {piece.name}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="result-actions" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <button
              type="button"
              className="button button-dark"
              onClick={handleToggleSaveLook}
            >
              <Bookmark size={15} fill={isCurrentLookSaved ? "#C6AC83" : "none"} color={isCurrentLookSaved ? "#C6AC83" : "white"} />
              {isCurrentLookSaved ? "✓ Saved in My Looks" : "Save this look"}
            </button>

            <Link
              href="/looks"
              className="button button-outline"
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              <Bookmark size={14} /> View in Saved Looks ({savedLooks.length}) <ArrowRight size={13} />
            </Link>

            <button
              type="button"
              className="button button-outline"
              onClick={() => {
                setShuffleIndex(prev => prev + 1)
                announce("Generated alternative outfit combination")
              }}
              title="Cycle through different piece pairings"
            >
              <RotateCcw size={14} /> Try another pairing
            </button>

            <Link
              href={`/style/why-this-works?mood=${encodeURIComponent(generatedLook.mood)}&occasion=${encodeURIComponent(generatedLook.occasion)}`}
              className="text-link"
            >
              Why this works <ArrowRight size={14} />
            </Link>
          </div>

          <p className="privacy-inline" style={{ marginTop: 22 }}>
            Connected directly to your Digital Closet · {generatedLook.outfitPieces.length} items styled from your collection.
          </p>
        </div>
      </div>
    )
  }

  // 3. /style/why-this-works - Design Breakdown
  if (pathname === "/style/why-this-works") {
    const activeMood = searchParams.get("mood") || "Effortless"
    const activeOccasion = searchParams.get("occasion") || "Dinner"

    const principles = [
      {
        num: "01",
        title: "Tonal Color Harmony",
        color: "#d5c6b0",
        desc: `Pairing warm neutrals (ivory, oatmeal, camel) creates visual cohesion without feeling rigid. It flatters and elevates simple everyday silhouettes.`
      },
      {
        num: "02",
        title: "Proportion & Silhouette Balance",
        color: "#8b8176",
        desc: `When wearing a relaxed or oversized top, grounding the look with straight-leg trousers or structured denim prevents visual clutter.`
      },
      {
        num: "03",
        title: `Calibrated for ${activeOccasion}`,
        color: "#3b3834",
        desc: `The outfit provides comfort while maintaining intentionality, perfectly suited for ${activeOccasion.toLowerCase()} without feeling over- or under-dressed.`
      },
      {
        num: "04",
        title: `The ${activeMood} Principle`,
        color: "#c6ac83",
        desc: `Style should feel like second nature. When high-touch textures (cashmere, calfskin leather) meet clean lines, the result is truly ${activeMood.toLowerCase()}.`
      }
    ]

    return (
      <div style={{ maxWidth: 820, margin: "40px auto" }}>
        <p className="eyebrow" style={{ textAlign: "center", marginBottom: 12 }}>STYLING INTELLIGENCE</p>
        <h2 style={{ font: "400 36px 'Playfair Display', Georgia, serif", textAlign: "center", margin: "0 0 32px" }}>
          Why this look works
        </h2>

        <div className="explanation-list">
          {principles.map(p => (
            <details key={p.num} open>
              <summary>
                <span>{p.num}</span>
                <i style={{ background: p.color }} />
                <strong>{p.title}</strong>
                <ChevronDown size={18} />
              </summary>
              <p>{p.desc}</p>
            </details>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/style/results" className="button button-dark">
            Back to your look <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  // 4. /looks - Saved Looks Gallery
  if (pathname === "/looks") {
    const availableTags = ["All", ...Array.from(new Set(savedLooks.map(l => l.occasion).filter(Boolean)))]

    const filteredLooks = looksFilter === "All"
      ? savedLooks
      : savedLooks.filter(l =>
          l.occasion.toLowerCase() === looksFilter.toLowerCase() ||
          l.tags?.some(t => t.toLowerCase() === looksFilter.toLowerCase())
        )

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, margin: "20px 0 24px" }}>
          <div className="filter-row">
            {availableTags.map(f => (
              <button
                type="button"
                key={f}
                className={`filter-chip ${looksFilter === f ? "selected" : ""}`}
                onClick={() => setLooksFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#716960" }}>
              <strong>{savedLooks.length}</strong> {savedLooks.length === 1 ? "look saved" : "looks saved"}
            </span>
            <Link href="/style" className="button button-dark" style={{ minHeight: 38, fontSize: 11 }}>
              <Plus size={15} /> Style a new look
            </Link>
          </div>
        </div>

        {savedLooks.length === 0 ? (
          <div className="saved-empty">
            <Bookmark size={34} />
            <h2>Your saved looks live here.</h2>
            <p>
              Save an outfit combination you love and return to it whenever you need inspiration or are planning your week.
            </p>
            <Link href="/style" className="button button-dark" style={{ marginTop: 18 }}>
              Create a look <ArrowRight size={15} />
            </Link>
          </div>
        ) : filteredLooks.length === 0 ? (
          <div className="empty-note" style={{ textAlign: "center", padding: "40px" }}>
            <p>No looks match the "{looksFilter}" filter.</p>
            <button className="text-link" onClick={() => setLooksFilter("All")}>
              View all {savedLooks.length} looks
            </button>
          </div>
        ) : (
          <div className="clothing-grid">
            {filteredLooks.map(look => (
              <article key={look.id} className="clothing-card" style={{ paddingBottom: 12 }}>
                <img src={look.image} alt={look.title} style={{ aspectRatio: "4/5" }} />
                <div style={{ padding: "12px 14px 6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#81776B", textTransform: "uppercase" }}>
                    <span>{look.occasion}</span>
                    <span>{look.mood}</span>
                  </div>
                  <h3 style={{ margin: "6px 0", fontSize: 15 }}>{look.title}</h3>
                  <p style={{ fontSize: 10, color: "#716960", margin: "4px 0" }}>
                    {look.items.slice(0, 3).join(", ")}
                    {look.items.length > 3 && ` +${look.items.length - 3} more`}
                  </p>
                  <small style={{ fontSize: 9, color: "#81776B" }}>Saved on {look.dateSaved}</small>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 14px", marginTop: 8 }}>
                  <Link
                    href={`/calendar?lookTitle=${encodeURIComponent(look.title)}`}
                    className="text-link"
                    style={{ fontSize: 10 }}
                  >
                    <Calendar size={13} /> Plan in Calendar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemoveSavedLook(look.id, look.title)}
                    style={{ border: 0, background: "none", cursor: "pointer", color: "#81776B", padding: 4 }}
                    title="Remove look"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}
