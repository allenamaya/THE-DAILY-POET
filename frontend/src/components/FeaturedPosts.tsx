"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Heart, MessageSquare, Repeat2, Play } from "lucide-react"
import { api } from "../lib/api"

interface Author {
  id: number
  name: string
  username: string
  avatar: string | null
}

interface Post {
  id: number
  title: string
  excerpt: string
  author: Author
  likes_count: number
  comments_count: number
  reposts_count: number
  has_audio: boolean
  audio_url: string | null
}

const FeaturedPosts: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await api.get("/posts/featured")
        setFeaturedPosts(response.data)
      } catch (err) {
        setError("Failed to load featured posts")
        console.error("Error fetching featured posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col h-full animate-pulse">
            <CardContent className="flex-grow pt-6">
              <div className="h-10 bg-muted rounded mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredPosts.map((post) => (
        <Card key={post.id} className="flex flex-col h-full">
          <CardContent className="flex-grow pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg?height=40&width=40"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link to={`/profile/${post.author.username}`} className="text-sm font-medium hover:underline">
                  {post.author.name}
                </Link>
                <p className="text-xs text-muted-foreground">@{post.author.username}</p>
              </div>
            </div>
            <Link to={`/post/${post.id}`} className="block group">
              <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
              <p className="text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
            </Link>
            {post.has_audio && (
              <Button variant="outline" size="sm" className="mb-4">
                <Play className="h-4 w-4 mr-2" /> Listen
              </Button>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-1" /> {post.likes_count}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" /> {post.comments_count}
              </Button>
              <Button variant="ghost" size="sm">
                <Repeat2 className="h-4 w-4 mr-1" /> {post.reposts_count}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default FeaturedPosts
