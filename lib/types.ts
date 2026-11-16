export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  styleBio?: string
  preferredStyles: string[]
  preferredColors: string[]
  sizes: {
    tops: string
    bottoms: string
    shoes: string
  }
  joinedDate: string
}

export type CategoryType = "Tops" | "Bottoms" | "Outerwear" | "Shoes" | "Dresses" | "Accessories"

export interface ClothingItem {
  id: string
  name: string
  category: CategoryType
  color: string
  photo: string
  isCustomPhoto?: boolean
  notes?: string
  isFavorite?: boolean
  dateAdded: string
}

export interface SavedLook {
  id: string
  title: string
  occasion: string
  mood: string
  destination?: string
  image: string
  items: string[]
  notes?: string
  dateSaved: string
  tags: string[]
}

export interface PlannedEvent {
  id: string
  date: string // YYYY-MM-DD
  lookId?: string
  lookTitle: string
  lookImage?: string
  occasion: string
  destination?: string
  notes?: string
}

export interface ShopProduct {
  id: string
  name: string
  category: string
  price: number
  photo: string
  description: string
  colors: string[]
  sizes: string[]
  tag?: string
}

export interface CartItem {
  product: ShopProduct
  size: string
  color: string
  quantity: number
}

export interface StylistMessage {
  id: string
  sender: "user" | "stylist"
  text: string
  timestamp: string
  suggestedLook?: {
    title: string
    image: string
    items: string[]
  }
}
