"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useNotifications } from "../contexts/NotificationContext"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { formatDistanceToNow } from "date-fns"

const Notifications: React.FC = () => {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotifications()
  const [activeTab, setActiveTab] = useState("all")
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredNotifications(notifications)
    } else if (activeTab === "unread") {
      setFilteredNotifications(notifications.filter((notification) => !notification.read))
    } else {
      setFilteredNotifications(notifications.filter((notification) => notification.action_type === activeTab))
    }
  }, [activeTab, notifications])

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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-medium">Notifications</h1>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
            <TabsTrigger value="follow">Follows</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No notifications to display</div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.target_url}
                    className={`block p-4 rounded-md border hover:bg-muted ${!notification.read ? "bg-muted/50" : ""}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.actor.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={notification.actor.name}
                        />
                        <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p>
                            <span className="mr-2">{getNotificationIcon(notification.action_type)}</span>
                            <span className="font-medium">{notification.actor.name}</span> {notification.content}
                          </p>
                          {!notification.read && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Notifications
