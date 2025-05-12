"use client"

import type React from "react"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/sign-in" }) => {
  const { isAuthenticated, loading } = useUser()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />
  }

  return <>{children}</>
}

export default ProtectedRoute
