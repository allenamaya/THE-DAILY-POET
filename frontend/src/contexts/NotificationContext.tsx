"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { api } from "../lib/api"
import { useUser } from "./UserContext"

interface Notification {
  id: number
  content: string
  read: boolean
  created_at: string
  action_type: string
  actor: {
    id: number
    name: string
    username: string
    avatar: string | null
  }
  target_type: string
  target_id: number
  target_url: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  fetchNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { isAuthenticated } = useUser()

  const fetchNotifications = async () => {
    if (!isAuthenticated) return

    try {
      const response = await api.get("/notifications")
      setNotifications(response.data)
      setUnreadCount(response.data.filter((notification: Notification) => !notification.read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`)

      // Update local state
      setNotifications(
        notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/mark_all_read")

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Fetch notifications on initial load and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated])

  // Poll for new notifications every minute
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, 60000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
