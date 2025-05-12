import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Repeat2, Play } from "lucide-react"
import Link from "next/link"

// This would normally come from a database
const posts = [
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
    tags: ["nature", "seasons"],
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
    tags: ["urban", "dreams"],
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
    tags: ["ocean", "memories"],
  },
  {
    id: "4",
    title: "Midnight Thoughts",
    excerpt: "When the world falls silent and the stars illuminate the sky...",
    author: {
      name: "James Wilson",
      username: "jamesw",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 19,
    comments: 3,
    reposts: 1,
    hasAudio: true,
    tags: ["night", "reflection"],
  },
  {
    id: "5",
    title: "Mountain Solitude",
    excerpt: "Standing atop the peak, breathing in the crisp air of solitude...",
    author: {
      name: "Elena Rodriguez",
      username: "elenapoet",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 31,
    comments: 6,
    reposts: 2,
    hasAudio: false,
    tags: ["nature", "mountains"],
  },
  {
    id: "6",
    title: "Rainy Day Musings",
    excerpt: "Droplets race down the windowpane, each one carrying a story...",
    author: {
      name: "David Kim",
      username: "davidverse",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 24,
    comments: 4,
    reposts: 1,
    hasAudio: true,
    tags: ["rain", "reflection"],
  },
]

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-medium">Explore</h1>
          <p className="text-muted-foreground">Discover poetry and stories from the community</p>
        </div>

        <div className="relative">
          <Input placeholder="Search for posts, authors, or tags..." className="pl-10" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <Tabs defaultValue="trending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="trending" className="space-y-6 pt-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>
          <TabsContent value="recent" className="space-y-6 pt-4">
            {[...posts].reverse().map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>
          <TabsContent value="following" className="space-y-6 pt-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">Sign in to see posts from people you follow</p>
              <Button asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PostCard({ post }: { post: (typeof posts)[0] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${post.author.username}`} className="font-medium hover:underline">
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">@{post.author.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Link href={`/post/${post.id}`} className="block group">
          <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
          <p className="text-muted-foreground">{post.excerpt}</p>
        </Link>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/explore?tag=${tag}`}
              className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
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
        {post.hasAudio && (
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-1" /> Listen
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
