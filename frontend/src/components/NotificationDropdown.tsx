"use client"

import type React from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useNotifications } from "../contexts/NotificationContext"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface NotificationDropdownProps {
  isMobile?: boolean
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isMobile = false }) => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleNotificationClick = (id: number) => {
    markAsRead(id)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️"
      case "comment":
        return "💬"
      case "follow":
        return "👤"
      case "repost":
        return "🔄"
      default:
        return "📣"
    }
  }

  return (
    <div
      className={`${
        isMobile ? "w-full border-b" : "absolute right-0 mt-2 w-80 rounded-md shadow-lg border border-border z-50"
      } bg-card`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              to={notification.target_url}
              className={`block p-4 hover:bg-muted border-b last:border-0 ${!notification.read ? "bg-muted/50" : ""}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={notification.actor.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={notification.actor.name}
                  />
                  <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="text-sm">
                      <span className="mr-2">{getNotificationIcon(notification.action_type)}</span>
                      <span className="font-medium">{notification.actor.name}</span> {notification.content}
                    </p>
                    {!notification.read && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="p-2 border-t text-center">
        <Button variant="ghost" size="sm" asChild className="w-full">
          <Link to="/notifications">View all notifications</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotificationDropdown
