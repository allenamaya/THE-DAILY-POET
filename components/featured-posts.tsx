import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Repeat2, Play } from "lucide-react"

// This would normally come from a database
const featuredPosts = [
  {
    id: "1",
    title: "Whispers of Autumn",
    excerpt: "The leaves fall gently, painting the ground with hues of amber and gold...",
    author: {
      name: "Emily Chen",
      username: "emilypoet",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 42,
    comments: 7,
    reposts: 3,
    hasAudio: true,
  },
  {
    id: "2",
    title: "City Lights",
    excerpt: "In the concrete jungle where dreams are made of, there's nothing you can't do...",
    author: {
      name: "Marcus Johnson",
      username: "mjpoetry",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 28,
    comments: 5,
    reposts: 2,
    hasAudio: true,
  },
  {
    id: "3",
    title: "Ocean Memories",
    excerpt: "The waves crash against the shore, memories washing away with the tide...",
    author: {
      name: "Sophia Williams",
      username: "sophiaverse",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 35,
    comments: 9,
    reposts: 4,
    hasAudio: false,
  },
]

export default function FeaturedPosts() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredPosts.map((post) => (
        <Card key={post.id} className="flex flex-col h-full">
          <CardContent className="flex-grow pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/profile/${post.author.username}`} className="text-sm font-medium hover:underline">
                  {post.author.name}
                </Link>
                <p className="text-xs text-muted-foreground">@{post.author.username}</p>
              </div>
            </div>
            <Link href={`/post/${post.id}`} className="block group">
              <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
              <p className="text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
            </Link>
            {post.hasAudio && (
              <Button variant="outline" size="sm" className="mb-4">
                <Play className="h-4 w-4 mr-2" /> Listen
              </Button>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-1" /> {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" /> {post.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Repeat2 className="h-4 w-4 mr-1" /> {post.reposts}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
