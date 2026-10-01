import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../api"

export function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed")
      }

      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[calc(100dvh-4rem)] flex justify-center w-full px-6 py-6 md:px-10 lg:px-16">
      <form
        onSubmit={handleSubmit}
        className="flex max-w-70 flex-col gap-4"
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="font-bold"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="John Doe"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="font-bold"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="font-bold"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>


        {/* Error */}
        {error && (
          <p
            role="alert"
            className="text-sm text-red-500"
          >
            {error}
          </p>
        )}

        {/* Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 font-bold text-white outline outline-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div> 
  )
}

export default Register