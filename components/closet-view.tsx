"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Heart, Plus, Search, Trash2, Upload, X, Sparkles, ArrowRight, Eye, Bookmark } from "lucide-react"
import { ClothingItem, CategoryType, SavedLook } from "@/lib/types"

interface ClosetProps {
  pathname: string
  wardrobe: ClothingItem[]
  savedLooks?: SavedLook[]
  onUpdateWardrobe: (items: ClothingItem[]) => void
  onUpdateSavedLooks?: (looks: SavedLook[]) => void
  announce: (msg: string) => void
}

const PRESET_PHOTOS = [
  { label: "Cashmere Knit", photo: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80", category: "Tops", color: "Ivory" },
  { label: "Straight Denim", photo: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80", category: "Bottoms", color: "Indigo" },
  { label: "Wool Camel Coat", photo: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=700&q=80", category: "Outerwear", color: "Camel" },
  { label: "Leather Ankle Boots", photo: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80", category: "Shoes", color: "Espresso" },
  { label: "Satin Slip Dress", photo: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80", category: "Dresses", color: "Champagne" },
  { label: "Leather Tote", photo: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80", category: "Accessories", color: "Cognac" }
]

export function ClosetView({ pathname, wardrobe, savedLooks = [], onUpdateWardrobe, onUpdateSavedLooks, announce }: ClosetProps) {
  const router = useRouter()
  const [category, setCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [viewingItem, setViewingItem] = useState<ClothingItem | null>(null)

  // Add Item form state
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState<CategoryType>("Tops")
  const [newItemColor, setNewItemColor] = useState("Ivory")
  const [newItemNotes, setNewItemNotes] = useState("")
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null)

  // Filter items dynamically
  const filteredItems = useMemo(() => {
    return wardrobe.filter(item => {
      const matchesCategory =
        category === "All"
          ? true
          : category === "Favorites"
          ? !!item.isFavorite
          : item.category === category

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.color.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [wardrobe, category, searchQuery])

  // Toggle favorite status
  function handleToggleFavorite(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    const updated = wardrobe.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    )
    onUpdateWardrobe(updated)
    const target = updated.find(i => i.id === id)
    announce(target?.isFavorite ? `Added "${target.name}" to favorites` : `Removed from favorites`)
  }

  // Delete item from closet
  function handleDeleteItem(id: string, name: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Remove "${name}" from your closet?`)) {
      const updated = wardrobe.filter(item => item.id !== id)
      onUpdateWardrobe(updated)
      setSelected(selected.filter(x => x !== id))
      if (viewingItem?.id === id) setViewingItem(null)
      announce(`Removed "${name}" from closet`)
    }
  }

  // Select / Deselect item
  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Style with selected
  function handleStyleWithSelected() {
    if (selected.length === 0) {
      announce("Select at least one piece to style.")
      return
    }
    const params = new URLSearchParams()
    params.set("selected", selected.join(","))
    router.push(`/style?${params.toString()}`)
  }

  // Save selected pieces directly as a new Look
  function handleSaveSelectedAsLook() {
    if (selected.length === 0) {
      announce("Select at least one piece to save as a look.")
      return
    }
    const chosenPieces = wardrobe.filter(w => selected.includes(w.id))
    const title = `Capsule Edit: ${chosenPieces.map(p => p.name).slice(0, 2).join(" & ")}`
    const newLook: SavedLook = {
      id: "look-" + Date.now(),
      title,
      occasion: "Capsule Selection",
      mood: "Curated",
      destination: "Personal Wardrobe Edit",
      image: chosenPieces[0]?.photo || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
      items: chosenPieces.map(p => p.name),
      notes: "Custom combination built directly in your Digital Closet.",
      dateSaved: new Date().toISOString().split("T")[0],
      tags: ["Closet", "Capsule"]
    }
    if (onUpdateSavedLooks) {
      onUpdateSavedLooks([newLook, ...savedLooks.filter(l => l.title !== title)])
    }
    announce(`Saved "${title}" to your Saved Looks!`)
  }

  // Handle file upload
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedPhoto(reader.result as string)
        setSelectedPresetIndex(null)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle preset photo selection
  function handleSelectPreset(index: number) {
    const preset = PRESET_PHOTOS[index]
    setSelectedPresetIndex(index)
    setUploadedPhoto(preset.photo)
    if (!newItemName) setNewItemName(preset.label)
    setNewItemCategory(preset.category as CategoryType)
    setNewItemColor(preset.color)
  }

  // Save new item
  function handleSaveNewItem() {
    if (!newItemName.trim()) {
      announce("Please provide a name for this piece.")
      return
    }

    const photoToUse =
      uploadedPhoto ||
      PRESET_PHOTOS[0].photo

    const newItem: ClothingItem = {
      id: "item-" + Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      color: newItemColor,
      photo: photoToUse,
      notes: newItemNotes.trim() || undefined,
      isFavorite: false,
      dateAdded: new Date().toISOString().split("T")[0]
    }

    const updated = [newItem, ...wardrobe]
    onUpdateWardrobe(updated)
    announce(`Added "${newItem.name}" to your digital closet!`)
    router.push("/closet")
  }

  if (pathname === "/closet/add") {
    return (
      <section className="upload-layout">
        <div className="upload-main">
          <p className="eyebrow" style={{ marginBottom: 12 }}>ADD A NEW PIECE</p>
          <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: 26, margin: "0 0 16px" }}>
            Add to your digital closet
          </h2>

          <label className="field-label" style={{ marginTop: 0 }}>Step 1: Choose or upload a photo</label>

          {/* Preset Photo Options for instant preview */}
          <p style={{ color: "#716960", fontSize: 10, margin: "4px 0 8px" }}>
            Pick from curated capsule pieces, or drag & drop your own photo below:
          </p>
          <div className="preset-photos-strip">
            {PRESET_PHOTOS.map((p, idx) => (
              <button
                type="button"
                key={p.label}
                className={`preset-thumb-btn ${selectedPresetIndex === idx ? "active-preset" : ""}`}
                onClick={() => handleSelectPreset(idx)}
                title={p.label}
              >
                <img src={p.photo} alt={p.label} />
              </button>
            ))}
          </div>

          <label className="upload-zone">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Upload size={22} />
            <strong>{uploadedPhoto ? "Change chosen photo" : "Drop a clothing photo here"}</strong>
            <span>or click to browse files from your computer</span>
          </label>

          {uploadedPhoto && (
            <div className="upload-preview">
              <img src={uploadedPhoto} alt="Clothing upload preview" />
              <div>
                <strong style={{ fontSize: 12 }}>Photo ready</strong>
                <p>Selected and ready to add to your collection</p>
              </div>
              <button
                type="button"
                onClick={() => { setUploadedPhoto(null); setSelectedPresetIndex(null); }}
                aria-label="Remove photo"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <label className="field-label" htmlFor="item-name" style={{ marginTop: 20 }}>
            Item name *
          </label>
          <input
            id="item-name"
            className="field"
            placeholder="e.g. The Oversized Poplin Shirt"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
          />

          <div className="field-row">
            <div>
              <label className="field-label" htmlFor="item-cat">Category</label>
              <select
                id="item-cat"
                className="field"
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value as CategoryType)}
              >
                {["Tops", "Bottoms", "Outerwear", "Shoes", "Dresses", "Accessories"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="item-color">Primary Color</label>
              <select
                id="item-color"
                className="field"
                value={newItemColor}
                onChange={e => setNewItemColor(e.target.value)}
              >
                {["Ivory", "Camel", "Indigo", "Charcoal", "Black", "Chalk White", "Champagne", "Espresso", "Cognac", "Olive", "Navy"].map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="field-label" htmlFor="notes">Fabrics & Styling Notes (optional)</label>
          <textarea
            className="field"
            id="notes"
            rows={3}
            placeholder="e.g. 100% fine wool, fits slightly oversized, pairs with cream knit"
            value={newItemNotes}
            onChange={e => setNewItemNotes(e.target.value)}
          />

          <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
            <button
              type="button"
              className="button button-dark"
              style={{ flex: 1 }}
              onClick={handleSaveNewItem}
            >
              Save to my closet <ArrowRight size={15} />
            </button>
            <Link href="/closet" className="button button-outline">
              Cancel
            </Link>
          </div>
        </div>

        <aside className="upload-aside">
          <p className="eyebrow">YOUR DIGITAL CAPSULE</p>
          <h3>Your clothes are personal.</h3>
          <p>
            Every piece you add becomes immediately available to the OTD outfit generator, AI stylist, and weekly planner.
          </p>
          <div style={{ margin: "20px 0", borderTop: "1px solid #D9D1C6", paddingTop: 16 }}>
            <strong style={{ fontSize: 11, display: "block", marginBottom: 6 }}>Capsule Wardrobe Tip:</strong>
            <p style={{ margin: 0, fontSize: 11, color: "#716960" }}>
              Focus on high-versatility foundation pieces that can easily mix with at least 3 other items in your closet.
            </p>
          </div>
          <span className="simulation-tag">
            <Sparkles size={14} /> Wardrobe automatically syncs to your profile
          </span>
        </aside>
      </section>
    )
  }

  // Closet main view
  return (
    <>
      <div className="closet-tools">
        <div className="search-wrap">
          <Search size={16} color="#81776B" />
          <input
            aria-label="Search your closet"
            placeholder="Search by name, color, or fabric..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ border: 0, background: "none", cursor: "pointer", color: "#81776B" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-row">
          {["All", "Favorites", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"].map(x => (
            <button
              key={x}
              className={`filter-chip ${category === x ? "selected" : ""}`}
              onClick={() => setCategory(x)}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 20px" }}>
        <p className="demo-label" style={{ margin: 0 }}>
          <span /> {filteredItems.length} {filteredItems.length === 1 ? "PIECE" : "PIECES"} IN CLOSET
          {selected.length > 0 && ` · ${selected.length} SELECTED`}
        </p>

        {selected.length > 0 && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="button button-dark"
              style={{ minHeight: 34, padding: "0 14px", fontSize: 10 }}
              onClick={handleStyleWithSelected}
            >
              Style with {selected.length} selected <Sparkles size={13} />
            </button>
            <button
              type="button"
              className="button button-outline"
              style={{ minHeight: 34, padding: "0 12px", fontSize: 10 }}
              onClick={handleSaveSelectedAsLook}
            >
              Save as Look <Bookmark size={13} />
            </button>
            <button
              type="button"
              className="button button-outline"
              style={{ minHeight: 34, padding: "0 10px", fontSize: 10 }}
              onClick={() => setSelected([])}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-note" style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ font: "400 20px 'Playfair Display', Georgia, serif", color: "#1F1D1A", marginBottom: 8 }}>
            No pieces match your search or filter.
          </p>
          <p style={{ fontSize: 12, color: "#716960", marginBottom: 20 }}>
            Try adjusting your search terms or add a new piece to expand your digital closet.
          </p>
          <Link href="/closet/add" className="button button-dark">
            <Plus size={15} /> Add clothing
          </Link>
        </div>
      ) : (
        <div className="clothing-grid">
          {filteredItems.map(item => {
            const isSelected = selected.includes(item.id)
            return (
              <article
                key={item.id}
                className={`clothing-card ${isSelected ? "chosen" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setViewingItem(item)}
              >
                <button
                  type="button"
                  className="select-item"
                  aria-label={`Select ${item.name}`}
                  onClick={e => toggleSelect(item.id, e)}
                >
                  {isSelected ? <Check size={15} color="#3B3834" /> : <span />}
                </button>

                <img src={item.photo} alt={item.name} />

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span>{item.category}</span>
                    <small style={{ color: "#81776B", fontSize: 9 }}>{item.color}</small>
                  </div>
                  <h3>{item.name}</h3>
                  {item.notes && (
                    <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.notes}
                    </p>
                  )}
                </div>

                <div style={{ position: "absolute", right: 10, top: 10, display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="heart-button"
                    style={{ position: "static" }}
                    aria-label={`Favorite ${item.name}`}
                    onClick={e => handleToggleFavorite(item.id, e)}
                  >
                    <Heart
                      size={16}
                      color={item.isFavorite ? "#B91C1C" : "#716960"}
                      fill={item.isFavorite ? "#B91C1C" : "none"}
                    />
                  </button>

                  <button
                    type="button"
                    className="heart-button"
                    style={{ position: "static" }}
                    aria-label={`Delete ${item.name}`}
                    onClick={e => handleDeleteItem(item.id, item.name, e)}
                    title="Remove item"
                  >
                    <Trash2 size={14} color="#716960" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {viewingItem && (
        <div className="modal-backdrop" onClick={() => setViewingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setViewingItem(null)}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "start" }}>
              <img
                src={viewingItem.photo}
                alt={viewingItem.name}
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }}
              />

              <div>
                <p className="eyebrow">{viewingItem.category.toUpperCase()} · {viewingItem.color.toUpperCase()}</p>
                <h2 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: 28, margin: "8px 0 14px" }}>
                  {viewingItem.name}
                </h2>

                <div style={{ background: "#F7F4EE", padding: 14, margin: "16px 0", fontSize: 12, lineHeight: 1.7, color: "#3B3834" }}>
                  <strong>Notes & Details:</strong>
                  <p style={{ margin: "4px 0 0", color: "#716960" }}>
                    {viewingItem.notes || "A foundational wardrobe staple with versatile styling options."}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    type="button"
                    className="button button-dark"
                    style={{ flex: 1 }}
                    onClick={() => {
                      router.push(`/style?selected=${viewingItem.id}`)
                      setViewingItem(null)
                    }}
                  >
                    Style this piece <Sparkles size={15} />
                  </button>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={e => handleToggleFavorite(viewingItem.id, e)}
                  >
                    <Heart
                      size={15}
                      color={viewingItem.isFavorite ? "#B91C1C" : "currentColor"}
                      fill={viewingItem.isFavorite ? "#B91C1C" : "none"}
                    />
                    {viewingItem.isFavorite ? "Favorited" : "Favorite"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
