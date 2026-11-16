import { ClothingItem, SavedLook, PlannedEvent, CartItem, StylistMessage, User } from "./types"
import { defaultUser, initialWardrobe, initialSavedLooks, initialStylistMessages } from "./data"

const KEYS = {
  USER: "otd_active_user",
  ALL_USERS: "otd_all_users",
  WARDROBE: "otd_wardrobe",
  SAVED_LOOKS: "otd_saved_looks",
  CART: "otd_cart",
  CALENDAR: "otd_calendar_events",
  STYLIST: "otd_stylist_messages",
  INSPIRATION: "otd_saved_inspirations"
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error("Storage error:", e)
  }
}

// User & Auth
export function getActiveUser(): User | null {
  return safeGet<User | null>(KEYS.USER, defaultUser)
}

export function setActiveUser(user: User | null): void {
  safeSet(KEYS.USER, user)
}

export function getAllUsers(): User[] {
  const users = safeGet<User[]>(KEYS.ALL_USERS, [])
  if (users.length === 0) {
    users.push(defaultUser)
    safeSet(KEYS.ALL_USERS, users)
  }
  return users
}

export function registerUser(newUser: User): void {
  const users = getAllUsers()
  const exists = users.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase())
  if (exists >= 0) {
    users[exists] = newUser
  } else {
    users.push(newUser)
  }
  safeSet(KEYS.ALL_USERS, users)
  setActiveUser(newUser)
}

// Wardrobe
export function getWardrobe(): ClothingItem[] {
  return safeGet<ClothingItem[]>(KEYS.WARDROBE, initialWardrobe)
}

export function saveWardrobe(items: ClothingItem[]): void {
  safeSet(KEYS.WARDROBE, items)
}

export function addWardrobeItem(item: ClothingItem): ClothingItem[] {
  const items = getWardrobe()
  const updated = [item, ...items]
  saveWardrobe(updated)
  return updated
}

export function removeWardrobeItem(id: string): ClothingItem[] {
  const items = getWardrobe()
  const updated = items.filter(x => x.id !== id)
  saveWardrobe(updated)
  return updated
}

export function toggleItemFavorite(id: string): ClothingItem[] {
  const items = getWardrobe()
  const updated = items.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)
  saveWardrobe(updated)
  return updated
}

// Saved Looks
export function getSavedLooks(): SavedLook[] {
  return safeGet<SavedLook[]>(KEYS.SAVED_LOOKS, initialSavedLooks)
}

export function saveSavedLooks(looks: SavedLook[]): void {
  safeSet(KEYS.SAVED_LOOKS, looks)
}

export function saveLook(look: SavedLook): SavedLook[] {
  const looks = getSavedLooks()
  const updated = [look, ...looks.filter(l => l.id !== look.id)]
  safeSet(KEYS.SAVED_LOOKS, updated)
  return updated
}

export function removeLook(id: string): SavedLook[] {
  const looks = getSavedLooks()
  const updated = looks.filter(l => l.id !== id)
  safeSet(KEYS.SAVED_LOOKS, updated)
  return updated
}

// Cart
export function getCart(): CartItem[] {
  return safeGet<CartItem[]>(KEYS.CART, [])
}

export function saveCart(items: CartItem[]): void {
  safeSet(KEYS.CART, items)
}

// Calendar Events
export function getPlannedEvents(): PlannedEvent[] {
  const today = new Date().toISOString().split("T")[0]
  const defaultEvents: PlannedEvent[] = [
    {
      id: "plan-1",
      date: today,
      lookTitle: "Tonal Evening in the City",
      lookImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
      occasion: "Dinner",
      destination: "West Village Bistro",
      notes: "Reservation at 8:00 PM. Camel coat for breezy night."
    }
  ]
  return safeGet<PlannedEvent[]>(KEYS.CALENDAR, defaultEvents)
}

export function savePlannedEvents(events: PlannedEvent[]): void {
  safeSet(KEYS.CALENDAR, events)
}

// Stylist Messages
export function getStylistMessages(): StylistMessage[] {
  return safeGet<StylistMessage[]>(KEYS.STYLIST, initialStylistMessages)
}

export function saveStylistMessages(messages: StylistMessage[]): void {
  safeSet(KEYS.STYLIST, messages)
}

// Inspirations
export function getSavedInspirations(): string[] {
  return safeGet<string[]>(KEYS.INSPIRATION, ["A quiet morning in the city"])
}

export function saveInspirations(list: string[]): void {
  safeSet(KEYS.INSPIRATION, list)
}
