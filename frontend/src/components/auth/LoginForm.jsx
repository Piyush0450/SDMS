import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LogIn, Loader2 } from "lucide-react"

export function LoginForm({ onSubmit, loading }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !password) return
    onSubmit(username, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">User ID (A_001, F_001, S_001)</Label>
        <Input
          id="username"
          type="text"
          placeholder="e.g. A_001 or S_001"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password (DOB: YYYY-MM-DD)</Label>
        <Input
          id="password"
          type="password"
          placeholder="YYYY-MM-DD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-10 font-semibold cursor-pointer">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In with Credentials
          </>
        )}
      </Button>
    </form>
  )
}
