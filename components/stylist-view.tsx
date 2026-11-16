"use client"

import { useState } from "react"
import { ArrowRight, Bookmark, RotateCcw, Send, Sparkles } from "lucide-react"
import { ClothingItem, SavedLook, StylistMessage } from "@/lib/types"

interface StylistProps {
  wardrobe: ClothingItem[]
  savedLooks: SavedLook[]
  stylistMessages: StylistMessage[]
  onUpdateMessages: (messages: StylistMessage[]) => void
  onUpdateSavedLooks: (looks: SavedLook[]) => void
  announce: (msg: string) => void
}

const PROMPT_CHIPS = [
  "Style an outfit for a rainy evening",
  "How to pair my wide-leg trousers?",
  "Dinner date in Soho: polished yet relaxed",
  "Make my camel coat feel more casual",
  "What shoes match raw indigo denim?"
]

export function StylistView({
  wardrobe,
  savedLooks,
  stylistMessages,
  onUpdateMessages,
  onUpdateSavedLooks,
  announce
}: StylistProps) {
  const [inputText, setInputText] = useState("")
  const [isThinking, setIsThinking] = useState(false)

  // Dynamic response generator using the user's actual wardrobe items
  function generateStylistReply(query: string): { text: string; look?: { title: string; image: string; items: string[] } } {
    const q = query.toLowerCase()

    // Find pieces from wardrobe
    const top = wardrobe.find(w => w.category === "Tops")?.name || "Soft ivory knit"
    const bottom = wardrobe.find(w => w.category === "Bottoms")?.name || "Everyday straight jean"
    const coat = wardrobe.find(w => w.category === "Outerwear")?.name || "Tailored camel coat"
    const shoes = wardrobe.find(w => w.category === "Shoes")?.name || "Leather ankle boots"

    if (q.includes("rain") || q.includes("weather") || q.includes("warmer") || q.includes("cold")) {
      return {
        text: `For wet or cooler weather, layer the ${top} under your ${coat}. Anchor the silhouette with ${bottom} rolled slightly above the ankle, and finish with ${shoes} to keep the hem crisp and dry.`,
        look: {
          title: "Weather-Resistant Tonal Layering",
          image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=700&q=80",
          items: [top, coat, bottom, shoes]
        }
      }
    }

    if (q.includes("trouser") || q.includes("wide-leg")) {
      return {
        text: `With pleated wide-leg trousers, volume balance is key. Tuck in a clean, fitted ${top} to accentuate the waistline. Throw your ${coat} casually over the shoulders for an architectural drape.`,
        look: {
          title: "Architectural Drape & Tailored Trousers",
          image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
          items: [top, "Pleated wide-leg trouser", coat]
        }
      }
    }

    if (q.includes("dinner") || q.includes("date") || q.includes("evening")) {
      return {
        text: `For dinner, quiet contrast does the work. Pair your ${top} with refined tailoring. The warmth of the ${coat} gives instant polish when entering the venue, while ${shoes} maintain effortless comfort.`,
        look: {
          title: "Intimate Dinner Neutral Silhouette",
          image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
          items: [top, bottom, coat, shoes]
        }
      }
    }

    if (q.includes("shoes") || q.includes("boot") || q.includes("sneaker")) {
      return {
        text: `For your ${bottom}, a sleek espresso boot or minimalist leather sneaker keeps the look timeless. The slight crop at the ankle highlights the silhouette of ${shoes}.`
      }
    }

    // Default intelligent fashion advice
    return {
      text: `Looking across your ${wardrobe.length} closet pieces, I suggest building around the ${top}. Layer it with the ${coat} and ${bottom}. The textural play between cashmere and structured wool creates an elevated everyday uniform.`,
      look: {
        title: "The Signature Capsule Edit",
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
        items: [top, bottom, coat, shoes]
      }
    }
  }

  function handleSendMessage(textToSend?: string) {
    const text = (textToSend || inputText).trim()
    if (!text) return

    const userMsg: StylistMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const updatedWithUser = [...stylistMessages, userMsg]
    onUpdateMessages(updatedWithUser)
    setInputText("")
    setIsThinking(true)

    // Simulate thoughtful stylist response
    setTimeout(() => {
      const replyData = generateStylistReply(text)
      const stylistMsg: StylistMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "stylist",
        text: replyData.text,
        suggestedLook: replyData.look,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      onUpdateMessages([...updatedWithUser, stylistMsg])
      setIsThinking(false)
    }, 500)
  }

  function handleSaveStylistLook(look: { title: string; image: string; items: string[] }) {
    const newLook: SavedLook = {
      id: "look-" + Date.now(),
      title: look.title,
      occasion: "Stylist Recommendation",
      mood: "Curated",
      destination: "Wardrobe Edit",
      image: look.image,
      items: look.items,
      dateSaved: new Date().toISOString().split("T")[0],
      tags: ["Stylist", "Curated"]
    }
    onUpdateSavedLooks([newLook, ...savedLooks])
    announce(`Saved "${look.title}" to your looks!`)
  }

  function handleUndoLast() {
    if (stylistMessages.length <= 1) {
      announce("Already at the start of your consultation.")
      return
    }
    const updated = stylistMessages.slice(0, -2)
    onUpdateMessages(updated)
    announce("Undid last conversation turn")
  }

  return (
    <div className="stylist-layout">
      <div style={{ position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85"
          alt="Personal Stylist Visual Guidance"
          style={{ width: "100%", height: "100%", minHeight: 480, objectFit: "cover" }}
        />
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, background: "rgba(31,29,26,0.85)", color: "white", padding: "12px 16px", backdropFilter: "blur(6px)" }}>
          <p style={{ margin: 0, fontSize: 9, letterSpacing: ".15em", color: "#C6AC83" }}>OTD INTELLIGENCE</p>
          <strong style={{ fontSize: 13, display: "block", marginTop: 4 }}>
            Tailored to your {wardrobe.length} closet pieces
          </strong>
        </div>
      </div>

      <div className="chat-demo" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--otd-border)", paddingBottom: 12 }}>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>PERSONAL STYLE CONSULTATION</p>
            <h3 style={{ font: "400 20px 'Playfair Display', Georgia, serif", margin: "4px 0 0" }}>
              OTD Senior Stylist
            </h3>
          </div>
          <span style={{ fontSize: 9, color: "#81776B", background: "#EAE4D9", padding: "3px 8px" }}>
            LIVE ASSISTANT
          </span>
        </div>

        {/* Message Thread */}
        <div className="chat-bubble-container" style={{ flex: 1, minHeight: 280 }}>
          {stylistMessages.map(msg => (
            <div
              key={msg.id}
              className={msg.sender === "stylist" ? "chat-bubble-stylist" : "chat-bubble-user"}
            >
              <p style={{ margin: 0 }}>{msg.text}</p>

              {msg.suggestedLook && (
                <div style={{ marginTop: 12, borderTop: "1px solid #D9D1C6", paddingTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                      src={msg.suggestedLook.image}
                      alt={msg.suggestedLook.title}
                      style={{ width: 44, height: 44, objectFit: "cover" }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 11, display: "block" }}>{msg.suggestedLook.title}</strong>
                      <span style={{ fontSize: 9, color: "#716960" }}>
                        {msg.suggestedLook.items.join(" · ")}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-dark"
                    style={{ minHeight: 30, fontSize: 10, padding: "0 10px", marginTop: 8 }}
                    onClick={() => handleSaveStylistLook(msg.suggestedLook!)}
                  >
                    <Bookmark size={12} /> Add to Saved Looks
                  </button>
                </div>
              )}

              <small style={{ fontSize: 8, opacity: 0.7, display: "block", marginTop: 4, textAlign: msg.sender === "user" ? "right" : "left" }}>
                {msg.timestamp}
              </small>
            </div>
          ))}

          {isThinking && (
            <div className="chat-bubble-stylist" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Sparkles size={13} color="#9B7F55" />
              <span style={{ fontSize: 11, color: "#716960" }}>Stylist is considering your wardrobe...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="prompt-chips" style={{ margin: "10px 0" }}>
          {PROMPT_CHIPS.map(chip => (
            <button
              type="button"
              key={chip}
              onClick={() => handleSendMessage(chip)}
              style={{ fontSize: 10, padding: "6px 10px", cursor: "pointer" }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat input form */}
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSendMessage()
          }}
          style={{ display: "flex", border: "1px solid var(--otd-border)", padding: 4, background: "#FFFEFA" }}
        >
          <input
            aria-label="Message your stylist"
            placeholder="Ask about combinations, weather, or an upcoming event..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{ flex: 1, border: 0, outline: 0, padding: "8px 10px", fontSize: 11, background: "transparent" }}
          />
          <button
            type="submit"
            aria-label="Send message"
            className="button button-dark"
            style={{ minHeight: 36, padding: "0 14px" }}
          >
            <Send size={14} />
          </button>
        </form>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <button
            type="button"
            className="text-link"
            style={{ fontSize: 10, color: "#81776B" }}
            onClick={handleUndoLast}
          >
            <RotateCcw size={12} /> Undo last prompt
          </button>
          <span style={{ fontSize: 9, color: "#81776B" }}>
            Personalized with your closet items
          </span>
        </div>
      </div>
    </div>
  )
}
