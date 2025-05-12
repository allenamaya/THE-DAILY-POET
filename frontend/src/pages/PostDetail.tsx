"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { Heart, MessageSquare, Repeat2, Play, Pause, Share } from "lucide-react"
import CommentSection from "../components/CommentSection"
import { api } from "../lib/api"
import { useToast } from "../hooks/useToast"
import { useUser } from "../contexts/UserContext"

interface Author {
  id: number
  name: string
  username: string
  avatar: string | null
}

interface Post {
  id: number
  title: string
  content: string
  created_at: string
  author: Author
  likes_count: number
  comments_count: number
  reposts_count: number
  has_audio: boolean
  audio_url: string | null
  liked_by_current_user: boolean
  reposted_by_current_user: boolean
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()
  const { isAuthenticated } = useUser()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`)
        setPost(response.data)
      } catch (err) {
        setError("Failed to load post")
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  const handleTogglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleAudioLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      })
      return
    }

    if (!post) return

    try {
      if (post.liked_by_current_user) {
        await api.delete(`/posts/${post.id}/unlike`)
        setPost({
          ...post,
          likes_count: post.likes_count - 1,
          liked_by_current_user: false,
        })
      } else {
        await api.post(`/posts/${post.id}/like`)
        setPost({
          ...post,
          likes_count: post.likes_count + 1,
          liked_by_current_user: true,
        })
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error)
      toast({
        title: "Error",
        description: "Failed to process your like",
        variant: "destructive",
      })
    }
  }

  const handleRepost = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to repost",
        variant: "destructive",
      })
      return
    }

    if (!post) return

    try {
      if (post.reposted_by_current_user) {
        await api.delete(`/posts/${post.id}/unrepost`)
        setPost({
          ...post,
          reposts_count: post.reposts_count - 1,
          reposted_by_current_user: false,
        })
      } else {
        await api.post(`/posts/${post.id}/repost`)
        setPost({
          ...post,
          reposts_count: post.reposts_count + 1,
          reposted_by_current_user: true,
        })
      }
    } catch (error) {
      console.error("Error reposting/unreposting post:", error)
      toast({
        title: "Error",
        description: "Failed to process your repost",
        variant: "destructive",
      })
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12 flex justify-center">Loading...</div>
  }

  if (error || !post) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error || "Post not found"}</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar || "/placeholder.svg?height=40&width=40"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profile/${post.author.username}`} className="font-medium hover:underline">
                {post.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                @{post.author.username} ·{" "}
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-medium">{post.title}</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="whitespace-pre-line leading-relaxed">{post.content}</div>

          {post.has_audio && post.audio_url && (
            <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/30">
              <audio
                ref={audioRef}
                src={post.audio_url}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioLoaded}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={handleTogglePlay}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"} audio</span>
              </Button>
              <div className="flex-1">
                <div className="h-2 bg-muted-foreground/20 rounded-full">
                  <div
                    className="h-2 bg-primary rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex items-center justify-between w-full py-2">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${post.liked_by_current_user ? "text-red-500" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${post.liked_by_current_user ? "fill-current" : ""}`} />
                <span>{post.likes_count}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-5 w-5" />
                <span>{post.comments_count}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${post.reposted_by_current_user ? "text-green-500" : ""}`}
                onClick={handleRepost}
              >
                <Repeat2 className="h-5 w-5" />
                <span>{post.reposts_count}</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <Separator className="my-4" />

          <CommentSection postId={id || ""} />
        </CardFooter>
      </Card>
    </div>
  )
}

export default PostDetail
