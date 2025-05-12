import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Repeat2, Play, Share } from "lucide-react"
import CommentSection from "@/components/comment-section"

// This would normally come from a database based on the post ID
const post = {
  id: "1",
  title: "Whispers of Autumn",
  content: `The leaves fall gently,
painting the ground with hues of amber and gold.
A crisp breeze carries whispers of change,
as summer's warmth fades into memory.

The scent of cinnamon and spice fills the air,
mingling with the earthy aroma of fallen leaves.
Nature prepares for its seasonal slumber,
a reminder that all things must rest before renewal.

In this transition, there is beauty to behold,
a symphony of colors playing their final notes.
Autumn teaches us to embrace the changing seasons,
finding peace in the cycle of letting go.`,
  createdAt: "October 15, 2024",
  author: {
    name: "Emily Chen",
    username: "emilypoet",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  likes: 42,
  comments: 7,
  reposts: 3,
  hasAudio: true,
}

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${post.author.username}`} className="font-medium hover:underline">
                {post.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                @{post.author.username} · {post.createdAt}
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-medium">{post.title}</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="whitespace-pre-line leading-relaxed">{post.content}</div>

          {post.hasAudio && (
            <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/30">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Play className="h-5 w-5" />
                <span className="sr-only">Play audio</span>
              </Button>
              <div className="flex-1">
                <div className="h-2 bg-muted-foreground/20 rounded-full">
                  <div className="h-2 w-1/3 bg-primary rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0:45</span>
                  <span>2:15</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex items-center justify-between w-full py-2">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Heart className="h-5 w-5" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-5 w-5" />
                <span>{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Repeat2 className="h-5 w-5" />
                <span>{post.reposts}</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <Separator className="my-4" />

          <CommentSection postId={params.id} />
        </CardFooter>
      </Card>
    </div>
  )
}
// Make sure this file doesn't use any client components directly
// Add 'use client' directive if it's using client components directly
// Otherwise, create separate client components for interactive elements
