"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  CloudSun,
  Heart,
  LogOut,
  Menu,
  Plus,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  Upload,
  User as UserIcon,
  X
} from "lucide-react"

import { CartItem, ClothingItem, PlannedEvent, SavedLook, StylistMessage, User } from "@/lib/types"
import { defaultUser, initialSavedLooks, initialStylistMessages, initialWardrobe } from "@/lib/data"
import {
  getActiveUser,
  getCart,
  getPlannedEvents,
  getSavedInspirations,
  getSavedLooks,
  getStylistMessages,
  getWardrobe,
  saveCart,
  saveInspirations,
  savePlannedEvents,
  saveSavedLooks,
  saveStylistMessages,
  saveWardrobe,
  setActiveUser
} from "@/lib/storage"

import { AuthView } from "./auth-views"
import { ClosetView } from "./closet-view"
import { StylingView } from "./styling-view"
import { StylistView } from "./stylist-view"
import { CalendarView } from "./calendar-view"
import { TryOnView } from "./tryon-view"
import { ShopView } from "./shop-view"
import { ProfileView } from "./profile-view"

const heroImage = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1500&q=85"

const navItems = [
  ["Home", "/home"],
  ["My Closet", "/closet"],
  ["Style Me", "/style"],
  ["Saved Looks", "/looks"],
  ["Stylist", "/stylist"],
  ["Calendar", "/calendar"],
  ["Try-On", "/virtual-try-on"],
  ["Shop", "/shop"],
  ["Profile", "/profile"]
]

const publicLinks = [
  ["How it works", "/how-it-works"],
  ["Features", "/features"],
  ["Explore", "/explore"],
  ["Shop", "/shop"],
  ["Our story", "/about"]
]

export function OtdApp() {
  const pathname = usePathname()
  const router = useRouter()

  // Dynamic application state
  const [user, setUser] = useState<User | null>(defaultUser)
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(initialWardrobe)
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(initialSavedLooks)
  const [cart, setCart] = useState<CartItem[]>([])
  const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([])
  const [stylistMessages, setStylistMessages] = useState<StylistMessage[]>(initialStylistMessages)
  const [savedInspirations, setSavedInspirations] = useState<string[]>([])

  // UI state
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState("")
  const [homeDestination, setHomeDestination] = useState("")
  const [homeOccasion, setHomeOccasion] = useState("Dinner")
  const [homeMood, setHomeMood] = useState("Effortless")

  // Load from localStorage on client mount
  useEffect(() => {
    setUser(getActiveUser())
    setWardrobe(getWardrobe())
    setSavedLooks(getSavedLooks())
    setCart(getCart())
    setPlannedEvents(getPlannedEvents())
    setStylistMessages(getStylistMessages())
    setSavedInspirations(getSavedInspirations())
  }, [])

  function announce(text: string) {
    setNotice(text)
    window.setTimeout(() => setNotice(""), 2800)
  }

  // Update handlers with persistence
  function handleUpdateWardrobe(items: ClothingItem[]) {
    setWardrobe(items)
    saveWardrobe(items)
  }

  function handleUpdateSavedLooks(looks: SavedLook[]) {
    setSavedLooks(looks)
    saveSavedLooks(looks)
  }

  function handleUpdateCart(items: CartItem[]) {
    setCart(items)
    saveCart(items)
  }

  function handleUpdatePlannedEvents(events: PlannedEvent[]) {
    setPlannedEvents(events)
    savePlannedEvents(events)
  }

  function handleUpdateStylistMessages(msgs: StylistMessage[]) {
    setStylistMessages(msgs)
    saveStylistMessages(msgs)
  }

  function handleToggleInspiration(card: { title: string; photo: string; tag: string }) {
    let updatedInspo: string[]
    const isSaved = savedInspirations.includes(card.title)
    if (isSaved) {
      updatedInspo = savedInspirations.filter(t => t !== card.title)
      const updatedLooks = savedLooks.filter(l => l.title !== card.title)
      handleUpdateSavedLooks(updatedLooks)
      announce(`Removed "${card.title}" from Saved Looks`)
    } else {
      updatedInspo = [...savedInspirations, card.title]
      const newLook: SavedLook = {
        id: "inspo-" + Date.now(),
        title: card.title,
        occasion: card.tag || "Inspiration",
        mood: "Effortless",
        destination: card.title,
        image: card.photo,
        items: ["Curated Editorial Ensemble", "Seasonal Neutrals"],
        notes: "Saved from OTD Explore & Editorial Inspo collection.",
        dateSaved: new Date().toISOString().split("T")[0],
        tags: ["Inspiration", card.tag || "Explore"]
      }
      handleUpdateSavedLooks([newLook, ...savedLooks.filter(l => l.title !== card.title)])
      announce(`Saved "${card.title}" to your Saved Looks collection!`)
    }
    setSavedInspirations(updatedInspo)
    saveInspirations(updatedInspo)
  }

  const isApp = ["/home", "/closet", "/style", "/looks", "/profile", "/calendar", "/stylist", "/virtual-try-on", "/avatar"].some(
    p => pathname.startsWith(p)
  )

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const title = pathname === "/" ? "" : pathname.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? ""

  function pageHeading() {
    if (pathname === "/home") return "Where are you going?"
    if (pathname === "/closet") return "Your Digital Closet"
    if (pathname === "/closet/add") return "Add to Your Digital Closet"
    if (pathname === "/style/results") return "Your look for tonight."
    if (pathname === "/style/why-this-works") return "Why this look works"
    if (pathname === "/style") return "Let’s make getting dressed easier."
    if (pathname === "/looks") return "Looks worth wearing again."
    if (pathname === "/profile") return "Your style, your way."
    if (pathname === "/calendar") return "Make plans. Plan your looks."
    if (pathname === "/stylist") return "A second opinion, whenever you need one."
    if (pathname === "/virtual-try-on" || pathname === "/avatar") return "Digital Silhouette & Try-On"
    if (pathname.startsWith("/shop")) return "Considered pieces, thoughtfully chosen."

    const names: Record<string, string> = {
      "how-it-works": "Good style starts with what you own.",
      features: "A little more you, every day.",
      explore: "Find a feeling. Make it yours.",
      about: "Style should feel like you.",
      contact: "We’re here to help.",
      privacy: "Your closet is yours.",
      terms: "Terms of use",
      login: "Welcome back.",
      register: "Make room for better mornings.",
      onboarding: "Let’s get to know your style.",
      help: "How can we help?",
      collections: "The edit",
      cart: "Your bag",
      business: "Style intelligence for a more personal retail experience."
    }
    return names[title] ?? "Your style, every place."
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1F1D1A]">
      {/* Header */}
      <header className="site-header">
        <Link href="/" aria-label="OTD home" className="brand">
          <img
            src="/apple-icon.png"
            alt="OTD"
            className="brand-logo-img"
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--otd-ink)", background: "#F7F4EE" }}
          />
          <span>
            OTD<small>OWN THE DAY</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {(isApp || user ? navItems : publicLinks).map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href || pathname.startsWith(href + "/") ? "nav-active" : ""}
            >
              {label}
              {label === "Saved Looks" && (
                <span
                  style={{
                    marginLeft: 6,
                    background: "#3B3834",
                    color: "#FFFEFA",
                    borderRadius: "999px",
                    padding: "1px 6px",
                    fontSize: 9,
                    fontWeight: 600
                  }}
                >
                  {savedLooks.length}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* Cart Icon with Live Count */}
          <Link href="/shop/cart" className="cart-trigger-btn" aria-label="View shopping bag" title="Shopping Bag">
            <ShoppingBag size={17} />
            {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
          </Link>

          {/* User Logged In / Logged Out status */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/profile" className="user-menu-pill" title="View profile & preferences">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={user.name}
                  className="user-avatar-mini"
                />
                <span style={{ fontSize: 11, fontWeight: 500, color: "#1F1D1A" }}>{user.name.split(" ")[0]}</span>
              </Link>

              <button
                type="button"
                className="header-signin"
                style={{ border: 0, background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
                onClick={() => {
                  setActiveUser(null)
                  setUser(null)
                  announce("Signed out successfully.")
                  router.push("/")
                }}
                title="Sign out of account"
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          ) : (
            <Link className="header-signin" href="/login">
              Sign in
            </Link>
          )}

          <Link href="/style" className="button button-dark header-cta">
            Start styling <ArrowRight size={15} />
          </Link>

          <button
            className="menu-button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="mobile-menu">
          {(user ? navItems : [...publicLinks, ...navItems.slice(0, 3)]).map(([label, href]) => (
            <Link key={href} onClick={() => setMenuOpen(false)} href={href}>
              {label}
              <ArrowRight size={15} />
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                setActiveUser(null)
                setUser(null)
                setMenuOpen(false)
                announce("Signed out successfully.")
                router.push("/")
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: "1px solid var(--otd-border)",
                border: 0,
                background: "none",
                fontSize: 13,
                color: "#B91C1C",
                textAlign: "left",
                cursor: "pointer"
              }}
            >
              Sign out ({user.name})
              <LogOut size={15} />
            </button>
          ) : (
            <Link onClick={() => setMenuOpen(false)} href="/login">
              Sign in / Register
              <ArrowRight size={15} />
            </Link>
          )}
        </nav>
      )}

      {/* Landing Page (/) */}
      {pathname === "/" ? (
        <>
          <main>
            <section className="hero wrap">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="eyebrow-line" /> A PERSONAL STYLE COMPANION
                </p>
                <h1>
                  Your wardrobe.
                  <br />
                  Your world.
                  <br />
                  <em>Your look.</em>
                </h1>
                <p className="hero-description">
                  Meet the fashion companion that styles what you already own for wherever life takes you.
                </p>
                <div className="hero-buttons">
                  <Link className="button button-dark" href="/style">
                    Create my look <ArrowRight size={16} />
                  </Link>
                  <Link className="text-link" href="/how-it-works">
                    See how it works <ArrowDown size={15} />
                  </Link>
                </div>
                <div className="hero-note">
                  <span className="note-rule" />
                  A better outfit begins with what’s already yours.
                </div>
              </div>

              <div className="hero-image-wrap">
                <img className="hero-image" src={heroImage} alt="Editorial portrait in a warm neutral setting" />
                <div className="image-caption">
                  <span>01 / EVERYDAY, ELEVATED</span>
                  <span>YOUR STYLE, EVERY PLACE</span>
                </div>
                <div className="image-stamp" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src="/apple-icon.png"
                    alt="OTD"
                    style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", border: "1px solid #C6AC83" }}
                  />
                  <span>Styled around you</span>
                </div>
              </div>
              <div className="hero-index">
                01 <span /> 04
              </div>
            </section>

            <section className="statement wrap">
              <p className="eyebrow">THE EVERYDAY QUESTION</p>
              <h2>
                A full closet.
                <br />
                <em>Nothing to wear?</em>
              </h2>
              <p className="statement-text">
                Your clothes deserve more than a crowded rail and a rushed decision. OTD brings the pieces you love together for the moments that matter.
              </p>
            </section>

            <section className="how-section">
              <div className="wrap how-grid">
                <div className="section-intro">
                  <p className="eyebrow">A MORE PERSONAL WAY TO GET DRESSED</p>
                  <h2>
                    From your closet
                    <br />
                    to <em>out the door.</em>
                  </h2>
                  <p>Considered outfits, built from your own wardrobe and the plans in your calendar.</p>
                  <Link href="/how-it-works" className="text-link">
                    Get to know OTD <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="steps-list">
                  {[
                    ["01", "Add what you own", "A digital closet that starts with your real wardrobe."],
                    ["02", "Tell us where you’re going", "Occasion, destination and the feeling you’re after."],
                    ["03", "Meet your next look", "Thoughtful outfit ideas, made from your pieces."],
                    ["04", "Make it your own", "Swap, save and wear it your way."]
                  ].map(([n, h, d]) => (
                    <Link href={n === "01" ? "/closet/add" : "/style"} className="step-row" key={n}>
                      <span>{n}</span>
                      <div>
                        <h3>{h}</h3>
                        <p>{d}</p>
                      </div>
                      <ArrowRight size={17} />
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <section className="editorial wrap">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=80"
                alt="Friends enjoying a city afternoon in their own style"
              />
              <div>
                <p className="eyebrow">YOUR PLANS, YOUR WAY</p>
                <h2>
                  From first coffee
                  <br />
                  to <em>last call.</em>
                </h2>
                <p>
                  Weather, occasion and your own point of view come together in a look that feels like you. No new wardrobe required.
                </p>
                <Link className="button button-outline" href="/style">
                  Find your look <ArrowRight size={15} />
                </Link>
              </div>
            </section>

            {/* Dynamic Closet Preview (Uses Real Wardrobe Pieces) */}
            <section className="closet-preview wrap">
              <div>
                <p className="eyebrow">A CLOSET THAT KNOWS YOU</p>
                <h2>
                  See your wardrobe
                  <br />
                  in a <em>new light.</em>
                </h2>
                <p>Keep the pieces you already love in one considered, easy-to-browse place.</p>
                <Link href="/closet" className="text-link">
                  Explore your Digital Closet ({wardrobe.length} pieces) <ArrowRight size={15} />
                </Link>
              </div>
              <div className="mini-wardrobe">
                {wardrobe.slice(0, 3).map((item, i) => (
                  <img
                    key={item.id}
                    style={{ transform: `translateY(${i % 2 ? 24 : 0}px)` }}
                    src={item.photo}
                    alt={item.name}
                  />
                ))}
              </div>
            </section>

            <section className="quote-band">
              <img
                src="/apple-icon.png"
                alt="OTD Opportunity Emblem"
                style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px", border: "2px solid #C6AC83", display: "block", background: "#F7F4EE" }}
              />
              <p className="eyebrow">THE OTD OPPORTUNITY</p>
              <blockquote>
                “The best new thing in your wardrobe
                <br />
                might be a way to wear what you have.”
              </blockquote>
              <span>STYLE, WITH WHAT’S ALREADY YOURS</span>
            </section>

            <section className="faq-section wrap">
              <div>
                <p className="eyebrow">A FEW GOOD QUESTIONS</p>
                <h2>
                  Good to <em>know.</em>
                </h2>
              </div>
              <div className="faq-list">
                {[
                  ["Do I need to buy new clothes?", "Not at all. OTD is designed primarily to help you style the clothes you already own."],
                  ["Does OTD know my weather or location?", "No location is assumed without your permission. Weather and destination are flexible inputs you control."],
                  ["Can I save and schedule my outfits?", "Yes. You can save any look to your collection and schedule it onto your interactive weekly/monthly calendar."]
                ].map(([q, a]) => (
                  <details key={q}>
                    <summary>
                      {q}
                      <Plus size={17} />
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="final-cta">
              <p className="eyebrow">YOUR STYLE. EVERY PLACE.</p>
              <h2>
                Make today
                <br />
                <em>feel like yours.</em>
              </h2>
              <Link href="/style" className="button button-light">
                Create my look <ArrowRight size={15} />
              </Link>
            </section>
          </main>
          <Footer />
        </>
      ) : (
        /* Inner Pages */
        <>
          <main className="inner-page wrap">
            <div className="page-kicker">
              <Link href="/">OTD</Link>
              <span>/</span>
              <span>{title}</span>
            </div>

            <div className="page-title-row">
              <div>
                <p className="eyebrow">
                  {isApp ? "YOUR PERSONAL STYLE SPACE" : "OWN THE DAY · YOUR STYLE, EVERY PLACE"}
                </p>
                <h1>{pageHeading()}</h1>
              </div>
              {pathname === "/closet" && (
                <Link className="button button-dark" href="/closet/add">
                  <Plus size={15} /> Add clothing
                </Link>
              )}
            </div>

            {/* /home - Interactive Dashboard */}
            {pathname === "/home" && (
              <div className="app-home">
                <div className="styling-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">LET’S GET YOU READY</p>
                      <h2>Make a little plan.</h2>
                    </div>
                    <CloudSun />
                    <span>Weather is optional</span>
                  </div>

                  <label className="field-label" htmlFor="destination">
                    Where are you headed?
                  </label>
                  <input
                    id="destination"
                    className="field"
                    placeholder="A place, a neighborhood, a feeling…"
                    value={homeDestination}
                    onChange={e => setHomeDestination(e.target.value)}
                  />

                  <div className="field-row">
                    <div>
                      <label className="field-label" htmlFor="occasion">
                        The occasion
                      </label>
                      <select
                        className="field"
                        id="occasion"
                        value={homeOccasion}
                        onChange={e => setHomeOccasion(e.target.value)}
                      >
                        {["Dinner", "Work", "College", "Date", "Wedding", "Party", "Casual", "Travel"].map(x => (
                          <option key={x} value={x}>{x}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="mood">
                        The mood
                      </label>
                      <select
                        className="field"
                        id="mood"
                        value={homeMood}
                        onChange={e => setHomeMood(e.target.value)}
                      >
                        {["Effortless", "Elegant", "Relaxed", "Bold", "Romantic", "Minimal"].map(x => (
                          <option key={x} value={x}>{x}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Link
                    href={`/style?destination=${encodeURIComponent(homeDestination)}&occasion=${homeOccasion}&mood=${homeMood}`}
                    className="button button-dark full-button"
                  >
                    Create my look <ArrowRight size={15} />
                  </Link>
                </div>

                {/* Dashboard Side Widgets */}
                <div className="home-side" style={{ display: "flex", flexDirection: "column" }}>
                  <img src={heroImage} alt="Considered everyday outfit inspiration" />
                  <div className="side-copy" style={{ flex: 1 }}>
                    <p className="eyebrow">YOUR CAPSULE OVERVIEW</p>
                    <h3>{user ? `${user.name}'s Wardrobe` : "Your Wardrobe"}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 0" }}>
                      <div style={{ background: "#FFFEFA", padding: 10, border: "1px solid var(--otd-border)" }}>
                        <span style={{ fontSize: 9, color: "#81776B" }}>CLOSET</span>
                        <strong style={{ fontSize: 18, display: "block" }}>{wardrobe.length} Pieces</strong>
                      </div>
                      <div style={{ background: "#FFFEFA", padding: 10, border: "1px solid var(--otd-border)" }}>
                        <span style={{ fontSize: 9, color: "#81776B" }}>SAVED LOOKS</span>
                        <strong style={{ fontSize: 18, display: "block" }}>{savedLooks.length} Looks</strong>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <Link href="/closet" className="text-link" style={{ fontSize: 11 }}>
                        <Shirt size={14} /> Open Closet
                      </Link>
                      <Link href="/stylist" className="text-link" style={{ fontSize: 11 }}>
                        <Sparkles size={14} /> Talk to Stylist
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* /closet & /closet/add */}
            {(pathname === "/closet" || pathname === "/closet/add") && (
              <ClosetView
                pathname={pathname}
                wardrobe={wardrobe}
                savedLooks={savedLooks}
                onUpdateWardrobe={handleUpdateWardrobe}
                onUpdateSavedLooks={handleUpdateSavedLooks}
                announce={announce}
              />
            )}

            {/* /style, /style/results, /style/why-this-works, /looks */}
            {["/style", "/style/results", "/style/why-this-works", "/looks"].includes(pathname) && (
              <StylingView
                pathname={pathname}
                wardrobe={wardrobe}
                savedLooks={savedLooks}
                onUpdateSavedLooks={handleUpdateSavedLooks}
                announce={announce}
              />
            )}

            {/* /stylist */}
            {pathname === "/stylist" && (
              <StylistView
                wardrobe={wardrobe}
                savedLooks={savedLooks}
                stylistMessages={stylistMessages}
                onUpdateMessages={handleUpdateStylistMessages}
                onUpdateSavedLooks={handleUpdateSavedLooks}
                announce={announce}
              />
            )}

            {/* /calendar */}
            {pathname === "/calendar" && (
              <CalendarView
                wardrobe={wardrobe}
                savedLooks={savedLooks}
                plannedEvents={plannedEvents}
                onUpdatePlannedEvents={handleUpdatePlannedEvents}
                announce={announce}
              />
            )}

            {/* /virtual-try-on & /avatar */}
            {(pathname === "/virtual-try-on" || pathname === "/avatar") && (
              <TryOnView
                wardrobe={wardrobe}
                savedLooks={savedLooks}
                onUpdateSavedLooks={handleUpdateSavedLooks}
                announce={announce}
              />
            )}

            {/* /shop & /cart */}
            {(pathname.startsWith("/shop") || pathname === "/cart") && (
              <ShopView
                pathname={pathname}
                wardrobe={wardrobe}
                cart={cart}
                onUpdateCart={handleUpdateCart}
                announce={announce}
              />
            )}

            {/* /login, /register, /forgot-password */}
            {["/login", "/register", "/forgot-password"].includes(pathname) && (
              <AuthView
                pathname={pathname}
                heading={pageHeading()}
                onUserChange={setUser}
                announce={announce}
              />
            )}

            {/* /profile & /onboarding */}
            {(pathname === "/profile" || pathname === "/onboarding") && (
              <ProfileView
                pathname={pathname}
                user={user}
                wardrobe={wardrobe}
                savedLooks={savedLooks}
                onUpdateUser={setUser}
                announce={announce}
              />
            )}

            {/* Other routes: /explore, /contact, policies, etc. */}
            {!["/home", "/closet", "/closet/add", "/style", "/style/results", "/style/why-this-works", "/looks", "/stylist", "/calendar", "/virtual-try-on", "/avatar", "/login", "/register", "/forgot-password", "/profile", "/onboarding"].includes(pathname) && !pathname.startsWith("/shop") && pathname !== "/cart" && (
              <RouteContent
                pathname={pathname}
                title={title}
                heading={pageHeading()}
                savedInspirations={savedInspirations}
                onToggleInspiration={handleToggleInspiration}
                announce={announce}
              />
            )}
          </main>
          <Footer />
        </>
      )}

      {/* Floating Notice Toast */}
      {notice && (
        <div className="toast" role="status">
          <Check size={16} color="#C6AC83" />
          <span>{notice}</span>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isApp && (
        <nav className="mobile-bottom" aria-label="App navigation">
          {[
            ["Home", "/home", <Sparkles key="home" size={17} />],
            ["Closet", "/closet", <Shirt key="closet" size={17} />],
            ["Style", "/style", <Plus key="style" size={17} />],
            ["Looks", "/looks", <Bookmark key="looks" size={17} />],
            ["Stylist", "/stylist", <CalendarIcon key="stylist" size={17} />]
          ].map(([n, h, icon]) => (
            <Link
              key={String(h)}
              href={String(h)}
              className={pathname === h ? "mobile-active" : ""}
            >
              <span>{icon as React.ReactNode}</span>
              {String(n)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}

function RouteContent({
  pathname,
  title,
  heading,
  savedInspirations,
  onToggleInspiration,
  announce
}: {
  pathname: string
  title: string
  heading: string
  savedInspirations: string[]
  onToggleInspiration: (card: { title: string; photo: string; tag: string }) => void
  announce: (s: string) => void
}) {
  const router = useRouter()
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [messageSent, setMessageSent] = useState(false)

  const cards = [
    { title: "A quiet morning in the city", photo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80", tag: "Minimal City" },
    { title: "Dinner, without the fuss", photo: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80", tag: "Evening Neutrals" },
    { title: "Weekend with nowhere to be", photo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80", tag: "Relaxed Tailoring" }
  ]

  if (pathname === "/contact" || pathname === "/business" || pathname === "/business/demo") {
    return (
      <div className="contact-layout">
        <div>
          <h2>Tell us what’s on your mind.</h2>
          <p>
            Whether you’re interested in style intelligence for your retail brand or need assistance with your personal closet, we’d love to connect.
          </p>
        </div>

        {messageSent ? (
          <div style={{ background: "#FFFEFA", padding: 32, border: "1px solid var(--otd-border)" }}>
            <p className="eyebrow">MESSAGE RECEIVED</p>
            <h3 style={{ font: "400 24px 'Playfair Display', Georgia, serif", margin: "6px 0 12px" }}>
              Thank you, {contactName}.
            </h3>
            <p style={{ color: "#716960", fontSize: 12, lineHeight: 1.8 }}>
              Our styling and partnership team has received your note and will be in touch shortly.
            </p>
            <button
              type="button"
              className="button button-outline"
              onClick={() => setMessageSent(false)}
              style={{ marginTop: 14 }}
            >
              Send another note
            </button>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault()
              setMessageSent(true)
              announce("Thanks — your note has been sent!")
            }}
          >
            <label className="field-label" htmlFor="contact-name">Name *</label>
            <input
              className="field"
              id="contact-name"
              required
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              placeholder="Your name"
            />

            <label className="field-label" htmlFor="contact-email">Email *</label>
            <input
              className="field"
              id="contact-email"
              type="email"
              required
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <label className="field-label" htmlFor="contact-message">Message *</label>
            <textarea
              className="field"
              id="contact-message"
              required
              rows={4}
              value={contactMessage}
              onChange={e => setContactMessage(e.target.value)}
              placeholder="Tell us what you have in mind..."
            />

            <button type="submit" className="button button-dark">
              Send a note <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    )
  }

  if (["/privacy", "/terms"].includes(pathname)) {
    return (
      <div className="policy-copy">
        <p className="demo-label">PRIVACY & CONTROL · CLIENT COMMITMENT</p>
        <h2>A considered approach to your personal style data.</h2>
        <p>
          Your clothing photos, personal sizing, and outfit notes stay securely in your browser and personal account. OTD never sells or shares your personal wardrobe with third-party advertisers.
        </p>
        <h3>Your choices matter</h3>
        <p>
          You have full ownership to export, edit, or delete any piece from your closet at any time with one click.
        </p>
      </div>
    )
  }

  // Explore & General editorial content
  return (
    <>
      <div className="route-intro">
        <p>
          OTD is a personal fashion companion built around the wardrobe you already have. The product starts with your clothes, your plans, and your point of view.
        </p>
        <Link href={pathname === "/features" ? "/style" : "/how-it-works"} className="button button-dark">
          {pathname === "/features" ? "Create my look" : "See how it works"} <ArrowRight size={15} />
        </Link>
      </div>

      <div className="editorial-cards">
        {cards.map((x, i) => {
          const isSaved = savedInspirations.includes(x.title)
          return (
            <article key={x.title}>
              <img src={x.photo} alt={x.title} />
              <span>YOUR STYLE · {String(i + 1).padStart(2, "0")} · {x.tag}</span>
              <h3>{x.title}</h3>
              <p>Made for your wardrobe and the places life takes you.</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 15px 0" }}>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => onToggleInspiration(x)}
                >
                  <Bookmark size={13} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved in My Looks" : "Save to My Looks"}
                </button>

                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    announce(`Recreating "${x.title}" with your closet pieces...`)
                    router.push(`/style?mood=Effortless&destination=${encodeURIComponent(x.title)}`)
                  }}
                >
                  Recreate <ArrowRight size={12} />
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <div className="route-footer-cta">
        <p className="eyebrow">YOUR STYLE. EVERY PLACE.</p>
        <h2>
          Start with what
          <br />
          <em>you already own.</em>
        </h2>
        <Link className="button button-dark" href="/style">
          Create my look <ArrowRight size={15} />
        </Link>
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" className="brand">
          <img
            src="/apple-icon.png"
            alt="OTD"
            className="brand-logo-img"
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--otd-ink)", background: "#F7F4EE" }}
          />
          <span>
            OTD<small>OWN THE DAY</small>
          </span>
        </Link>
        <p>
          Your style.
          <br />
          Every place.
        </p>
        <Link href="/style" className="button button-outline">
          Create my look <ArrowRight size={14} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© OTD · OWN THE DAY</span>
        <div>
          {[
            ["Our story", "/about"],
            ["Help", "/help"],
            ["Contact", "/contact"],
            ["Privacy", "/privacy"],
            ["Terms", "/terms"]
          ].map(([x, y]) => (
            <Link href={y} key={y}>
              {x}
            </Link>
          ))}
        </div>
        <span>MADE FOR YOUR EVERYDAY</span>
      </div>
    </footer>
  )
}
