"use client"

import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart } from "lucide-react"
import Link from "next/link"

// This would normally come from a database
const initialComments = [
  {
    id: "1",
    content: "This is absolutely beautiful! The imagery of autumn leaves really resonated with me.",
    createdAt: "2 days ago",
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 5,
  },
  {
    id: "2",
    content:
      "I love how you captured the essence of the season. The line about 'finding peace in the cycle of letting go' is particularly moving.",
    createdAt: "1 day ago",
    author: {
      name: "Michael Lee",
      username: "mikepoet",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 3,
  },
  {
    id: "3",
    content: "Your words paint such a vivid picture. I can almost smell the cinnamon and spice!",
    createdAt: "12 hours ago",
    author: {
      name: "Aisha Patel",
      username: "aishaverse",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    likes: 2,
  },
]

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    // In a real app, this would send the comment to an API
    const comment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      createdAt: "Just now",
      author: {
        name: "You",
        username: "user",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  return (
    <div className="w-full space-y-6">
      <h3 className="font-medium">Comments</h3>

      <form onSubmit={handleSubmitComment} className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!newComment.trim()}>
              Post
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${comment.author.username}`} className="font-medium text-sm hover:underline">
                  {comment.author.name}
                </Link>
                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
              <div className="mt-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs">{comment.likes}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
