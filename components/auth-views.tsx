"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Lock, Mail, Sparkles, User as UserIcon } from "lucide-react"
import { User } from "@/lib/types"
import { defaultUser } from "@/lib/data"
import { getAllUsers, registerUser, setActiveUser } from "@/lib/storage"

interface AuthProps {
  pathname: string
  heading: string
  onUserChange: (user: User | null) => void
  announce: (msg: string) => void
}

export function AuthView({ pathname, heading, onUserChange, announce }: AuthProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [error, setError] = useState("")

  // Quick 1-click demo login
  function handleQuickLogin() {
    setActiveUser(defaultUser)
    onUserChange(defaultUser)
    announce(`Welcome back, ${defaultUser.name}!`)
    router.push("/home")
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in both email and password.")
      return
    }

    const allUsers = getAllUsers()
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())

    const loggedInUser: User = found || {
      id: "user-" + Date.now(),
      name: email.split("@")[0].replace(/[^a-zA-Z]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Fashion Enthusiast",
      email: email,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      styleBio: "Curating timeless, versatile everyday looks.",
      preferredStyles: ["Minimal", "Effortless"],
      preferredColors: ["Ivory", "Camel", "Indigo"],
      sizes: { tops: "S", bottoms: "27", shoes: "38" },
      joinedDate: "November 2026"
    }

    setActiveUser(loggedInUser)
    onUserChange(loggedInUser)
    announce(`Welcome back, ${loggedInUser.name}!`)
    router.push("/home")
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      setError("Please complete all required fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const newUser: User = {
      id: "user-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      styleBio: "Defining a personal capsule wardrobe tailored to my lifestyle.",
      preferredStyles: ["Minimal", "Effortless"],
      preferredColors: ["Ivory", "Camel", "Charcoal"],
      sizes: { tops: "M", bottoms: "28", shoes: "39" },
      joinedDate: "November 2026"
    }

    registerUser(newUser)
    onUserChange(newUser)
    announce(`Account created! Welcome to OTD, ${newUser.name}.`)
    router.push("/onboarding")
  }

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address.")
      return
    }
    setResetSent(true)
    announce("Password reset instructions sent to your email.")
  }

  if (pathname === "/forgot-password") {
    return (
      <div className="auth-panel">
        <p className="eyebrow">ACCOUNT RECOVERY</p>
        <h2>Reset your password</h2>
        {resetSent ? (
          <div style={{ padding: "16px 0" }}>
            <p style={{ color: "#716960", lineHeight: 1.8, fontSize: 13 }}>
              We have sent password reset instructions to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Link href="/login" className="button button-dark full-button" style={{ marginTop: 20 }}>
              Return to Sign In <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <p style={{ color: "#716960", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              Enter the email associated with your OTD account and we’ll send you a link to reset your password.
            </p>
            {error && <p style={{ color: "#b91c1c", fontSize: 11, marginBottom: 12 }}>{error}</p>}
            <label className="field-label" htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              className="field"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" className="button button-dark full-button" style={{ marginTop: 24 }}>
              Send reset instructions <ArrowRight size={15} />
            </button>
            <p className="auth-switch" style={{ marginTop: 20 }}>
              Remember your password? <Link href="/login">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    )
  }

  if (pathname === "/register") {
    return (
      <div className="auth-panel">
        <p className="eyebrow">JOIN OWN THE DAY</p>
        <h2>{heading || "Make room for better mornings."}</h2>
        <p style={{ color: "#716960", fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>
          Create an account to digitize your closet, generate thoughtful looks, and plan outfits effortlessly.
        </p>

        {error && <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "10px 14px", fontSize: 11, marginBottom: 14, borderRadius: 2 }}>{error}</div>}

        <form onSubmit={handleRegisterSubmit}>
          <label className="field-label" htmlFor="reg-name">Full name</label>
          <input
            id="reg-name"
            className="field"
            required
            placeholder="e.g. Emma Vance"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label className="field-label" htmlFor="reg-email">Email address</label>
          <input
            id="reg-email"
            type="email"
            className="field"
            required
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div className="field-row" style={{ marginTop: 4 }}>
            <div>
              <label className="field-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                minLength={6}
                className="field"
                required
                placeholder="At least 6 chars"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="reg-confirm">Confirm password</label>
              <input
                id="reg-confirm"
                type="password"
                minLength={6}
                className="field"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <label className="terms-check" style={{ marginTop: 18, cursor: "pointer" }}>
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
            <span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link></span>
          </label>

          <button type="submit" className="button button-dark full-button">
            Create account <ArrowRight size={15} />
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    )
  }

  // Login view
  return (
    <div className="auth-panel">
      <p className="eyebrow">YOUR PERSONAL STYLE SPACE</p>
      <h2>{heading || "Welcome back."}</h2>

      {/* 1-Click Quick Demo Sign In Button */}
      <button
        type="button"
        className="quick-signin-btn"
        onClick={handleQuickLogin}
        title="Sign in instantly with sample closet data"
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={16} color="#9B7F55" />
          <span>
            <strong style={{ display: "block", color: "#1F1D1A" }}>1-Click Instant Demo Login</strong>
            <small style={{ color: "#716960" }}>Sign in as Emma Vance (preloaded capsule closet)</small>
          </span>
        </span>
        <ArrowRight size={15} color="#9B7F55" />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
        <span style={{ flex: 1, borderTop: "1px solid var(--otd-border)" }} />
        <span style={{ fontSize: 9, letterSpacing: ".15em", color: "#81776B" }}>OR SIGN IN WITH EMAIL</span>
        <span style={{ flex: 1, borderTop: "1px solid var(--otd-border)" }} />
      </div>

      {error && <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "10px 14px", fontSize: 11, marginBottom: 14, borderRadius: 2 }}>{error}</div>}

      <form onSubmit={handleLoginSubmit}>
        <label className="field-label" htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          className="field"
          required
          placeholder="emma.vance@otdstyle.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
          <label className="field-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
          <Link href="/forgot-password" style={{ fontSize: 10, color: "#81776B", textDecoration: "underline" }}>
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          type="password"
          className="field"
          required
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit" className="button button-dark full-button">
          Sign in <ArrowRight size={15} />
        </button>
      </form>

      <p className="auth-switch">
        New to OTD? <Link href="/register">Create an account</Link>
      </p>
    </div>
  )
}
