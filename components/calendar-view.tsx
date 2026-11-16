"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Check, ChevronLeft, ChevronRight, Plus, Sparkles, Trash2, X } from "lucide-react"
import { ClothingItem, PlannedEvent, SavedLook } from "@/lib/types"

interface CalendarProps {
  wardrobe: ClothingItem[]
  savedLooks: SavedLook[]
  plannedEvents: PlannedEvent[]
  onUpdatePlannedEvents: (events: PlannedEvent[]) => void
  announce: (msg: string) => void
}

export function CalendarView({
  wardrobe,
  savedLooks,
  plannedEvents,
  onUpdatePlannedEvents,
  announce
}: CalendarProps) {
  const searchParams = useSearchParams()
  const lookTitleFromQuery = searchParams.get("lookTitle")

  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(10) // 0-indexed: 10 is November
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Selected plan fields inside modal
  const [chosenLookId, setChosenLookId] = useState<string>("")
  const [planOccasion, setPlanOccasion] = useState("Dinner")
  const [planNotes, setPlanNotes] = useState("")

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Month stats
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay() // 0 = Sunday

  // Format date helper: YYYY-MM-DD
  function formatDateKey(day: number): string {
    const m = String(currentMonth + 1).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    return `${currentYear}-${m}-${d}`
  }

  // Find plan for a given day
  function getPlanForDay(day: number): PlannedEvent | undefined {
    const key = formatDateKey(day)
    return plannedEvents.find(p => p.date === key)
  }

  // Open planning modal
  function handleOpenDayModal(day: number) {
    setSelectedDayNumber(day)
    const existing = getPlanForDay(day)
    if (existing) {
      setChosenLookId(existing.lookId || "")
      setPlanOccasion(existing.occasion || "Dinner")
      setPlanNotes(existing.notes || "")
    } else {
      // Default to query param look if present
      const preLook = savedLooks.find(l => l.title === lookTitleFromQuery)
      setChosenLookId(preLook ? preLook.id : (savedLooks[0]?.id || ""))
      setPlanOccasion(preLook?.occasion || "Dinner")
      setPlanNotes("")
    }
    setModalOpen(true)
  }

  // Save plan for selected day
  function handleSavePlan() {
    if (!selectedDayNumber) return
    const dateKey = formatDateKey(selectedDayNumber)
    const matchedLook = savedLooks.find(l => l.id === chosenLookId)

    const lookTitle = matchedLook ? matchedLook.title : (lookTitleFromQuery || "Curated Capsule Look")
    const lookImage = matchedLook?.image || wardrobe[0]?.photo || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80"

    const newEvent: PlannedEvent = {
      id: "plan-" + Date.now(),
      date: dateKey,
      lookId: matchedLook?.id,
      lookTitle,
      lookImage,
      occasion: planOccasion,
      notes: planNotes.trim() || undefined
    }

    const updated = [...plannedEvents.filter(p => p.date !== dateKey), newEvent]
    onUpdatePlannedEvents(updated)
    setModalOpen(false)
    announce(`Planned outfit for ${monthNames[currentMonth]} ${selectedDayNumber}!`)
  }

  // Clear plan for day
  function handleClearPlan() {
    if (!selectedDayNumber) return
    const dateKey = formatDateKey(selectedDayNumber)
    const updated = plannedEvents.filter(p => p.date !== dateKey)
    onUpdatePlannedEvents(updated)
    setModalOpen(false)
    announce(`Cleared plan for ${monthNames[currentMonth]} ${selectedDayNumber}`)
  }

  return (
    <div className="calendar-demo" style={{ maxWidth: 840 }}>
      <div className="calendar-top" style={{ marginBottom: 20 }}>
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>OUTFIT SCHEDULER</p>
          <h2>{monthNames[currentMonth]} {currentYear}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            className="button button-outline"
            style={{ minHeight: 34, padding: "0 10px" }}
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11)
                setCurrentYear(prev => prev - 1)
              } else {
                setCurrentMonth(prev => prev - 1)
              }
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: 11, color: "#716960", fontWeight: 500 }}>
            {monthNames[currentMonth]}
          </span>
          <button
            type="button"
            className="button button-outline"
            style={{ minHeight: 34, padding: "0 10px" }}
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0)
                setCurrentYear(prev => prev + 1)
              } else {
                setCurrentMonth(prev => prev + 1)
              }
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {lookTitleFromQuery && (
        <div style={{ background: "#FAF7F0", border: "1px solid #C6AC83", padding: "10px 14px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11 }}>
            <strong>Selected Look:</strong> {lookTitleFromQuery}. Click a day below to schedule it!
          </div>
          <Link href="/calendar" className="text-link" style={{ fontSize: 10 }}>Clear</Link>
        </div>
      )}

      {/* Days of week header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, textAlign: "center", marginBottom: 6 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} style={{ fontSize: 10, color: "#81776B", textTransform: "uppercase", padding: "4px 0", fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {/* Leading blanks */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`blank-${i}`} style={{ background: "transparent" }} />
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const plan = getPlanForDay(day)
          const isToday = currentYear === 2026 && currentMonth === 10 && day === 16

          return (
            <button
              type="button"
              key={day}
              className={`calendar-day-btn ${plan ? "has-plan" : ""} ${isToday ? "is-today" : ""}`}
              onClick={() => handleOpenDayModal(day)}
              title={plan ? `${plan.occasion}: ${plan.lookTitle}` : `Schedule look for day ${day}`}
            >
              <span>{day}</span>
              {plan && (
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <span className="calendar-plan-dot" />
                  <span style={{ fontSize: 7, color: "#9B7F55", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 45, whiteSpace: "nowrap" }}>
                    {plan.occasion}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, borderTop: "1px solid var(--otd-border)", paddingTop: 16 }}>
        <p style={{ margin: 0, fontSize: 11, color: "#716960" }}>
          Select any day to assign a look, set an occasion, or review your schedule.
        </p>
        <span style={{ fontSize: 10, color: "#81776B" }}>
          {plannedEvents.length} {plannedEvents.length === 1 ? "Outfit Scheduled" : "Outfits Scheduled"}
        </span>
      </div>

      {/* Day Planning Modal */}
      {modalOpen && selectedDayNumber && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
              <X size={18} />
            </button>

            <p className="eyebrow">PLAN YOUR LOOK</p>
            <h3 style={{ font: "400 24px 'Playfair Display', Georgia, serif", margin: "6px 0 16px" }}>
              {monthNames[currentMonth]} {selectedDayNumber}, {currentYear}
            </h3>

            {getPlanForDay(selectedDayNumber) && (
              <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#FAF7F0", border: "1px solid #C6AC83", padding: 10, marginBottom: 16 }}>
                <img
                  src={getPlanForDay(selectedDayNumber)?.lookImage}
                  alt="Planned look"
                  style={{ width: 48, height: 48, objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 8, color: "#81776B", textTransform: "uppercase" }}>CURRENTLY PLANNED</span>
                  <strong style={{ fontSize: 11, display: "block" }}>{getPlanForDay(selectedDayNumber)?.lookTitle}</strong>
                  <span style={{ fontSize: 10, color: "#716960" }}>{getPlanForDay(selectedDayNumber)?.occasion}</span>
                </div>
              </div>
            )}

            <label className="field-label" htmlFor="plan-look" style={{ marginTop: 0 }}>
              Choose a Look
            </label>
            <select
              id="plan-look"
              className="field"
              value={chosenLookId}
              onChange={e => setChosenLookId(e.target.value)}
            >
              {savedLooks.map(l => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.occasion})
                </option>
              ))}
              {savedLooks.length === 0 && (
                <option value="">No saved looks yet - will create default capsule look</option>
              )}
            </select>

            <div className="field-row" style={{ marginTop: 12 }}>
              <div>
                <label className="field-label" htmlFor="plan-occ">Occasion</label>
                <select
                  id="plan-occ"
                  className="field"
                  value={planOccasion}
                  onChange={e => setPlanOccasion(e.target.value)}
                >
                  {["Dinner", "Work", "Date", "Casual", "Weekend", "Party", "Travel", "Presentation"].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="plan-time">Time (optional)</label>
                <input
                  id="plan-time"
                  className="field"
                  placeholder="e.g. 7:30 PM"
                />
              </div>
            </div>

            <label className="field-label" htmlFor="plan-note" style={{ marginTop: 12 }}>
              Notes or Venue (optional)
            </label>
            <textarea
              id="plan-note"
              className="field"
              rows={2}
              placeholder="e.g. Balthazar Soho with Sarah"
              value={planNotes}
              onChange={e => setPlanNotes(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                type="button"
                className="button button-dark"
                style={{ flex: 1 }}
                onClick={handleSavePlan}
              >
                Save outfit plan <Check size={14} />
              </button>

              {getPlanForDay(selectedDayNumber) && (
                <button
                  type="button"
                  className="button button-outline"
                  onClick={handleClearPlan}
                  style={{ color: "#B91C1C" }}
                >
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
