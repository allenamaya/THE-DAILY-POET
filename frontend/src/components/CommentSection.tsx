"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Heart } from "lucide-react"
import { api } from "../lib/api"
import { useUser } from "../contexts/UserContext"
import { useToast } from "../hooks/useToast"

interface Author {
  id: number
  name: string
  username: string
  avatar: string | null
}

interface Comment {
  id: number
  content: string
  created_at: string
  author: Author
  likes_count: number
  liked_by_current_user: boolean
}

interface CommentSectionProps {
  postId: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/posts/${postId}/comments`)
        setComments(response.data)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchComments()
    }
  }, [postId, toast])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        comment: { content: newComment },
      })

      // Add the new comment to the list
      setComments([response.data, ...comments])
      setNewComment("")

      toast({
        title: "Success",
        description: "Your comment has been posted",
      })
    } catch (error) {
      console.error("Error posting comment:", error)
      toast({
        title: "Error",
        description: "Failed to post your comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: number, index: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like comments",
        variant: "destructive",
      })
      return
    }

    try {
      const comment = comments[index]

      if (comment.liked_by_current_user) {
        await api.delete(`/comments/${commentId}/unlike`)

        // Update the comment in the state
        const updatedComments = [...comments]
        updatedComments[index] = {
          ...comment,
          likes_count: comment.likes_count - 1,
          liked_by_current_user: false,
        }
        setComments(updatedComments)
      } else {
        await api.post(`/comments/${commentId}/like`)

        // Update the comment in the state
        const updatedComments = [...comments]
        updatedComments[index] = {
          ...comment,
          likes_count: comment.likes_count + 1,
          liked_by_current_user: true,
        }
        setComments(updatedComments)
      }
    } catch (error) {
      console.error("Error liking/unliking comment:", error)
      toast({
        title: "Error",
        description: "Failed to process your like",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60))
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <div className="w-full space-y-6">
      <h3 className="font-medium">Comments</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar || "/placeholder.svg?height=32&width=32"}
              alt={user?.name || "Your avatar"}
            />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={!newComment.trim() || isSubmitting}>
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-2">Sign in to add a comment</p>
          <Button asChild size="sm">
            <Link to="/sign-in">Sign in</Link>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="py-4 text-center">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.author.avatar || "/placeholder.svg?height=32&width=32"}
                  alt={comment.author.name}
                />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${comment.author.username}`} className="font-medium text-sm hover:underline">
                    {comment.author.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 ${comment.liked_by_current_user ? "text-red-500" : ""}`}
                    onClick={() => handleLikeComment(comment.id, index)}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${comment.liked_by_current_user ? "fill-current" : ""}`} />
                    <span className="text-xs">{comment.likes_count}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
