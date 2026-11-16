"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react"
import { CartItem, ClothingItem, ShopProduct } from "@/lib/types"
import { shopProducts } from "@/lib/data"

interface ShopProps {
  pathname: string
  wardrobe: ClothingItem[]
  cart: CartItem[]
  onUpdateCart: (cart: CartItem[]) => void
  announce: (msg: string) => void
}

export function ShopView({
  pathname,
  wardrobe,
  cart,
  onUpdateCart,
  announce
}: ShopProps) {
  const [category, setCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)
  const [chosenSize, setChosenSize] = useState("S")
  const [chosenColor, setChosenColor] = useState("")

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1)
  const [promoCode, setPromoCode] = useState("")
  const [discountPercent, setDiscountPercent] = useState(0)

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (category === "All") return shopProducts
    return shopProducts.filter(p => p.category === category)
  }, [category])

  // Cart calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [cart])

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100
  }, [subtotal, discountPercent])

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount)
  }, [subtotal, discountAmount])

  // Add to cart
  function handleAddToCart(product: ShopProduct, size?: string, color?: string) {
    const s = size || chosenSize || product.sizes[0]
    const c = color || chosenColor || product.colors[0]

    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.size === s && item.color === c
    )

    let updated: CartItem[]
    if (existingIndex >= 0) {
      updated = [...cart]
      updated[existingIndex].quantity += 1
    } else {
      updated = [...cart, { product, size: s, color: c, quantity: 1 }]
    }

    onUpdateCart(updated)
    announce(`Added "${product.name}" to your shopping bag!`)
    setSelectedProduct(null)
  }

  // Update item quantity
  function handleUpdateQuantity(index: number, delta: number) {
    const updated = [...cart]
    const newQty = updated[index].quantity + delta
    if (newQty <= 0) {
      updated.splice(index, 1)
      announce("Removed item from bag")
    } else {
      updated[index].quantity = newQty
    }
    onUpdateCart(updated)
  }

  // Apply promo
  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === "OTD10") {
      setDiscountPercent(10)
      announce("Applied 10% wardrobe promo discount!")
    } else {
      announce("Invalid promo code. Try 'OTD10'")
    }
  }

  // Complete checkout
  function handleCompleteOrder() {
    setCheckoutStep(3)
    onUpdateCart([])
    announce("Order placed successfully! Confirmation sent to your email.")
  }

  const isCartPage = pathname.includes("/cart")

  // Cart Page View
  if (isCartPage) {
    return (
      <div style={{ maxWidth: 780, margin: "20px auto" }}>
        <p className="eyebrow" style={{ textAlign: "center" }}>YOUR CONSIDERED PIECES</p>
        <h2 style={{ font: "400 36px 'Playfair Display', Georgia, serif", textAlign: "center", margin: "8px 0 32px" }}>
          Shopping Bag
        </h2>

        {cart.length === 0 ? (
          <div className="saved-empty">
            <ShoppingBag size={34} />
            <h2>Your bag is currently empty.</h2>
            <p>Explore curated capsule pieces designed to effortlessly complement what you already own.</p>
            <Link href="/shop" className="button button-dark" style={{ marginTop: 18 }}>
              Explore Shop <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ background: "#FFFEFA", border: "1px solid var(--otd-border)", padding: "0 24px" }}>
              {cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="cart-item-row">
                  <img src={item.product.photo} alt={item.product.name} />
                  <div>
                    <span style={{ fontSize: 9, color: "#81776B", textTransform: "uppercase" }}>{item.product.category}</span>
                    <strong style={{ fontSize: 13, display: "block", margin: "2px 0 4px" }}>{item.product.name}</strong>
                    <span style={{ fontSize: 11, color: "#716960" }}>
                      Size: {item.size} · Color: {item.color}
                    </span>
                    <span style={{ display: "block", marginTop: 4, fontWeight: 600, fontSize: 12 }}>
                      ${item.product.price}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                    <div className="cart-qty-ctrl">
                      <button type="button" onClick={() => handleUpdateQuantity(idx, -1)}>
                        <Minus size={12} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => handleUpdateQuantity(idx, 1)}>
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(idx, -item.quantity)}
                      style={{ border: 0, background: "none", cursor: "pointer", color: "#81776B", fontSize: 10 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary & Checkout */}
            <div style={{ background: "#FAF7F0", border: "1px solid var(--otd-border)", borderTop: 0, padding: 24 }}>
              <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <input
                  className="field"
                  placeholder="Promo code (try 'OTD10')"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  style={{ minHeight: 38 }}
                />
                <button type="submit" className="button button-outline" style={{ minHeight: 38 }}>
                  Apply
                </button>
              </form>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, color: "#716960" }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountPercent > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, color: "#15803d" }}>
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, color: "#716960" }}>
                <span>Shipping</span>
                <span>Complimentary Luxury Ground</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, borderTop: "1px solid var(--otd-border)", paddingTop: 14, marginTop: 12 }}>
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="button button-dark full-button"
                style={{ marginTop: 20 }}
                onClick={() => {
                  setCheckoutStep(1)
                  setIsCheckoutOpen(true)
                }}
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {isCheckoutOpen && (
          <div className="modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setIsCheckoutOpen(false)}>
                <X size={18} />
              </button>

              {checkoutStep === 1 && (
                <div>
                  <p className="eyebrow">STEP 01 OF 02 · DELIVERY</p>
                  <h3 style={{ font: "400 24px 'Playfair Display', Georgia, serif", margin: "6px 0 18px" }}>
                    Shipping Address
                  </h3>
                  <label className="field-label" style={{ marginTop: 0 }}>Full Name</label>
                  <input className="field" defaultValue="Emma Vance" />
                  <label className="field-label">Street Address</label>
                  <input className="field" defaultValue="72 Mercer St, Apt 4B" />
                  <div className="field-row">
                    <div>
                      <label className="field-label">City</label>
                      <input className="field" defaultValue="New York" />
                    </div>
                    <div>
                      <label className="field-label">Postal Code</label>
                      <input className="field" defaultValue="10012" />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-dark full-button"
                    style={{ marginTop: 24 }}
                    onClick={() => setCheckoutStep(2)}
                  >
                    Continue to Payment <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div>
                  <p className="eyebrow">STEP 02 OF 02 · PAYMENT</p>
                  <h3 style={{ font: "400 24px 'Playfair Display', Georgia, serif", margin: "6px 0 18px" }}>
                    Select Payment Method
                  </h3>
                  <div style={{ background: "#FAF7F0", border: "1px solid #C6AC83", padding: 14, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>Apple Pay / Touch ID</strong>
                      <span style={{ fontSize: 10, color: "#15803d" }}>✓ Instant verification</span>
                    </div>
                  </div>
                  <label className="field-label">Or Card Number</label>
                  <input className="field" defaultValue="•••• •••• •••• 4242" />
                  <div className="field-row">
                    <div>
                      <label className="field-label">Expires</label>
                      <input className="field" defaultValue="12/28" />
                    </div>
                    <div>
                      <label className="field-label">CVC</label>
                      <input className="field" defaultValue="888" />
                    </div>
                  </div>

                  <div style={{ margin: "20px 0", borderTop: "1px solid var(--otd-border)", paddingTop: 14, display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                    <span>Total Charge</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    className="button button-dark full-button"
                    onClick={handleCompleteOrder}
                  >
                    Place Order (${total.toFixed(2)}) <Check size={15} />
                  </button>
                </div>
              )}

              {checkoutStep === 3 && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#1F1D1A", color: "white", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                    <Check size={26} />
                  </div>
                  <p className="eyebrow">ORDER CONFIRMED</p>
                  <h3 style={{ font: "400 28px 'Playfair Display', Georgia, serif", margin: "6px 0 12px" }}>
                    Thank you for your order.
                  </h3>
                  <p style={{ color: "#716960", fontSize: 12, lineHeight: 1.7, maxWidth: 380, margin: "0 auto 24px" }}>
                    Order <strong>#OTD-84920</strong> has been received. Your pieces will be carefully prepared in sustainable garment boxes.
                  </p>
                  <button
                    type="button"
                    className="button button-dark"
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    Return to Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Shop Catalog View
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, margin: "20px 0 28px" }}>
        <div className="filter-row">
          {["All", "Tops", "Bottoms", "Outerwear", "Dresses", "Shoes", "Accessories"].map(cat => (
            <button
              type="button"
              key={cat}
              className={`filter-chip ${category === cat ? "selected" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <Link href="/shop/cart" className="button button-outline" style={{ minHeight: 38, fontSize: 11 }}>
          <ShoppingBag size={14} /> View Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
        </Link>
      </div>

      <p className="demo-label">
        <span /> CONSIDERED CAPSULE COLLECTION · {filteredProducts.length} DESIGNS
      </p>

      <div className="clothing-grid">
        {filteredProducts.map(product => (
          <article
            key={product.id}
            className="clothing-card"
            style={{ cursor: "pointer", paddingBottom: 10 }}
            onClick={() => {
              setSelectedProduct(product)
              setChosenSize(product.sizes[0])
              setChosenColor(product.colors[0])
            }}
          >
            {product.tag && (
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "#FFFEFA",
                  padding: "4px 8px",
                  fontSize: 8,
                  letterSpacing: ".1em",
                  color: "#3B3834",
                  fontWeight: 600
                }}
              >
                {product.tag.toUpperCase()}
              </span>
            )}

            <img src={product.photo} alt={product.name} />

            <div style={{ padding: "12px 14px 6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#81776B", textTransform: "uppercase" }}>
                <span>{product.category}</span>
                <span style={{ fontWeight: 600, color: "#1F1D1A" }}>${product.price}</span>
              </div>
              <h3 style={{ margin: "6px 0 4px", fontSize: 15 }}>{product.name}</h3>
              <p style={{ fontSize: 10, color: "#716960", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {product.description}
              </p>
            </div>

            <div style={{ padding: "0 14px", marginTop: 8, display: "flex", gap: 8 }}>
              <button
                type="button"
                className="button button-dark"
                style={{ flex: 1, minHeight: 34, padding: "0 10px", fontSize: 10 }}
                onClick={e => {
                  e.stopPropagation()
                  handleAddToCart(product)
                }}
              >
                <Plus size={12} /> Add to Bag
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
              <X size={18} />
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 26 }}>
              <img
                src={selectedProduct.photo}
                alt={selectedProduct.name}
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }}
              />

              <div>
                <p className="eyebrow">{selectedProduct.category.toUpperCase()} · ${selectedProduct.price}</p>
                <h3 style={{ font: "400 28px 'Playfair Display', Georgia, serif", margin: "6px 0 12px" }}>
                  {selectedProduct.name}
                </h3>
                <p style={{ color: "#716960", fontSize: 12, lineHeight: 1.7, margin: "0 0 18px" }}>
                  {selectedProduct.description}
                </p>

                {/* Size options */}
                <label className="field-label" style={{ marginTop: 0 }}>Size</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {selectedProduct.sizes.map(s => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setChosenSize(s)}
                      style={{
                        padding: "6px 12px",
                        fontSize: 10,
                        border: chosenSize === s ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                        background: chosenSize === s ? "#3B3834" : "#FFFEFA",
                        color: chosenSize === s ? "#FFFEFA" : "#1F1D1A",
                        cursor: "pointer"
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Color options */}
                <label className="field-label" style={{ marginTop: 14 }}>Color Palette</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {selectedProduct.colors.map(col => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setChosenColor(col)}
                      style={{
                        padding: "6px 12px",
                        fontSize: 10,
                        border: chosenColor === col ? "2px solid #3B3834" : "1px solid var(--otd-border)",
                        background: chosenColor === col ? "#FAF7F0" : "#FFFEFA",
                        cursor: "pointer"
                      }}
                    >
                      {col}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="button button-dark"
                    style={{ flex: 1 }}
                    onClick={() => handleAddToCart(selectedProduct, chosenSize, chosenColor)}
                  >
                    Add to Bag (${selectedProduct.price}) <ShoppingBag size={14} />
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
