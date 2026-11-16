import { ClothingItem, SavedLook, PlannedEvent, ShopProduct, StylistMessage, User } from "./types"

export const defaultUser: User = {
  id: "user-1",
  name: "Emma Vance",
  email: "emma.vance@otdstyle.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  styleBio: "Curating a capsule wardrobe of timeless neutrals, sculptural silhouettes, and relaxed tailoring.",
  preferredStyles: ["Minimal", "Effortless", "Tailored"],
  preferredColors: ["Ivory", "Camel", "Indigo", "Charcoal", "Black"],
  sizes: {
    tops: "S",
    bottoms: "27 / S",
    shoes: "38 EU / 7.5 US"
  },
  joinedDate: "October 2026"
}

export const initialWardrobe: ClothingItem[] = [
  {
    id: "item-1",
    name: "Soft ivory knit",
    category: "Tops",
    color: "Ivory",
    photo: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",
    notes: "100% Mongolian Cashmere. Perfect for easy tonal layering.",
    isFavorite: true,
    dateAdded: "2026-10-15"
  },
  {
    id: "item-2",
    name: "Everyday straight jean",
    category: "Bottoms",
    color: "Indigo",
    photo: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
    notes: "Classic high-rise mid-weight denim with natural fading.",
    isFavorite: true,
    dateAdded: "2026-10-18"
  },
  {
    id: "item-3",
    name: "Tailored camel coat",
    category: "Outerwear",
    color: "Camel",
    photo: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=700&q=80",
    notes: "Double-faced wool blend with belted waist and notched lapel.",
    isFavorite: true,
    dateAdded: "2026-10-20"
  },
  {
    id: "item-4",
    name: "Leather ankle boots",
    category: "Shoes",
    color: "Espresso",
    photo: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
    notes: "Soft calfskin leather with sleek 45mm block heel.",
    isFavorite: false,
    dateAdded: "2026-10-22"
  },
  {
    id: "item-5",
    name: "Pleated wide-leg trouser",
    category: "Bottoms",
    color: "Charcoal",
    photo: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
    notes: "Flowy draped wool trousers with deep front pleats.",
    isFavorite: false,
    dateAdded: "2026-10-25"
  },
  {
    id: "item-6",
    name: "Crisp oversized poplin shirt",
    category: "Tops",
    color: "Chalk White",
    photo: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80",
    notes: "Pure organic cotton with mother-of-pearl buttons.",
    isFavorite: true,
    dateAdded: "2026-10-29"
  },
  {
    id: "item-7",
    name: "Bias-cut silk slip dress",
    category: "Dresses",
    color: "Champagne",
    photo: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    notes: "19mm silk satin, falls gracefully at mid-calf.",
    isFavorite: false,
    dateAdded: "2026-11-02"
  },
  {
    id: "item-8",
    name: "Structured leather tote",
    category: "Accessories",
    color: "Cognac",
    photo: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
    notes: "Italian vegetable-tanned leather with suede lining.",
    isFavorite: true,
    dateAdded: "2026-11-05"
  }
]

export const initialSavedLooks: SavedLook[] = [
  {
    id: "look-1",
    title: "Tonal Evening in the City",
    occasion: "Dinner",
    mood: "Effortless",
    destination: "West Village Bistro",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
    items: ["Soft ivory knit", "Tailored camel coat", "Everyday straight jean", "Leather ankle boots"],
    notes: "Understated elegance with tactile warmth. The camel coat anchors the neutral cream palette.",
    dateSaved: "2026-11-10",
    tags: ["Dinner", "Warm Neutrals", "Effortless"]
  },
  {
    id: "look-2",
    title: "Relaxed Architectural Tailoring",
    occasion: "Work",
    mood: "Minimal",
    destination: "Studio & Gallery Meetings",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85",
    items: ["Crisp oversized poplin shirt", "Pleated wide-leg trouser", "Structured leather tote"],
    notes: "Crisp shirting juxtaposed against fluid trousers. Professional yet unforced.",
    dateSaved: "2026-11-12",
    tags: ["Work", "Minimal", "Tailored"]
  }
]

export const shopProducts: ShopProduct[] = [
  {
    id: "prod-1",
    name: "Cashmere Mockneck Sweater",
    category: "Tops",
    price: 220,
    photo: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",
    description: "Spun from ethically sourced Grade-A Mongolian cashmere with ribbed trims and relaxed raglan sleeves.",
    colors: ["Ivory", "Oatmeal", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tag: "Core Essential"
  },
  {
    id: "prod-2",
    name: "Double-Faced Wool Tailored Coat",
    category: "Outerwear",
    price: 440,
    photo: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=700&q=80",
    description: "An unlined luxury drape coat made from 100% fine wool with hand-finished interior seams.",
    colors: ["Camel", "Black", "Sand"],
    sizes: ["XS", "S", "M", "L"],
    tag: "The Edit"
  },
  {
    id: "prod-3",
    name: "Pleated Wide-Leg Wool Trousers",
    category: "Bottoms",
    price: 195,
    photo: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
    description: "Tailored high waist with double inverted pleats and a relaxed pooling hemline.",
    colors: ["Charcoal", "Cream", "Espresso"],
    sizes: ["25", "26", "27", "28", "29", "30"],
    tag: "Best Seller"
  },
  {
    id: "prod-4",
    name: "Silk Satin Bias Midi Dress",
    category: "Dresses",
    price: 260,
    photo: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    description: "Cut on the bias for fluid movement that skims the silhouette. Finished with delicate rolled straps.",
    colors: ["Champagne", "Noir", "Sage"],
    sizes: ["XS", "S", "M", "L"],
    tag: "Evening"
  },
  {
    id: "prod-5",
    name: "Calfskin Leather Ankle Boot",
    category: "Shoes",
    price: 320,
    photo: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
    description: "Handcrafted in Florence using supple vegetable-tanned calfskin with a sculpted heel.",
    colors: ["Espresso", "Black", "Cognac"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    tag: "Handmade"
  },
  {
    id: "prod-6",
    name: "Structured Minimalist Leather Tote",
    category: "Accessories",
    price: 290,
    photo: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
    description: "Architectural proportions designed to carry a 14” laptop, notebook, and daily essentials with ease.",
    colors: ["Cognac", "Noir", "Ivory"],
    sizes: ["One Size"],
    tag: "Timeless"
  }
]

export const initialStylistMessages: StylistMessage[] = [
  {
    id: "msg-1",
    sender: "stylist",
    text: "Hello Emma! I'm your OTD style companion. Whether you're heading to dinner, prepping for an important presentation, or looking to rethink a favorite piece in your closet, I'm here to build outfits around what you already own.",
    timestamp: "10:00 AM"
  }
]
