"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { api } from "../lib/api"

interface User {
  id: number
  username: string
  name: string
  email: string
  avatar: string | null
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: SignupData) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<boolean>
  isAuthenticated: boolean
}

interface SignupData {
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  checkAuth: async () => false,
  isAuthenticated: false,
})

export const useUser = () => useContext(UserContext)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = async () => {
    try {
      setLoading(true)
      const response = await api.get("/me")
      if (response.status === 200) {
        setUser(response.data)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { user: { email, password } })
      if (response.status === 200) {
        await checkAuth()
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (userData: SignupData) => {
    try {
      const response = await api.post("/signup", { user: userData })
      if (response.status === 201) {
        await checkAuth()
        return true
      }
      return false
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await api.delete("/logout")
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        checkAuth,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
