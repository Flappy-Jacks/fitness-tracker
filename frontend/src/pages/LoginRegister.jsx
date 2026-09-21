import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:8000"

export function LoginRegister() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Login failed")
      }

      console.log("Logged in:", data)

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate("/log")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full px-6 py-6 md:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">

        {/* Top row */}
        <header className="flex w-full items-center justify-between">
          <p className="font-montserrat font-black text-lg">
            TrackStar
          </p>

          <p className="text-sm text-gray-500">
            date
          </p>
        </header>

        {/* Middle row */}
        <main className="grid flex-1 grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:gap-20">

          {/* Left: Hero */}
          <section className="flex h-full flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="font-montserrat text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Reconnect with yourself and choose your health.{" "}
                <span className="text-primary">
                  Stay fit. Stay Consistent.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
                Achieve your fitness goals through intuitive, practical,
                and reliable tracking features designed to let you focus
                on the work.
              </p>
            </div>
          </section>

          {/* Right: Login */}
          <section className="flex h-full items-center justify-center">
            <div className="w-full max-w-md">

              <div className="mb-6 text-center">
                <p className="text-3xl font-bold">
                  Jump back in
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Keep the streak going or start today!
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-4"
              >
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

                {/* Remember / Forgot */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <label
                    htmlFor="remember-me"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id="remember-me"
                      className="h-4 w-4"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
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
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Register */}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  disabled={loading}
                  className="w-full rounded-lg border border-black py-2.5 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Create an account
                </button>
              </form>
            </div>
          </section>
        </main>

        {/* Bottom row */}
        <footer className="flex w-full items-end justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">
              Developed by
            </p>

            <p className="font-bold">
              John Domingo
            </p>
          </div>

          <p>dot</p>
        </footer>
      </div>
    </div>
  )
}

export default LoginRegister
