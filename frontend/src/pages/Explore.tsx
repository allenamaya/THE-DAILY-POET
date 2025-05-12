"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Heart, MessageSquare, Repeat2, Play, Search } from "lucide-react"
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
  excerpt: string
  author: Author
  likes_count: number
  comments_count: number
  reposts_count: number
  has_audio: boolean
  tags: string[]
  liked_by_current_user: boolean
}

const Explore: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("trending")
  const { isAuthenticated } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        let endpoint = "/posts"

        if (activeTab === "trending") {
          endpoint = "/posts/trending"
        } else if (activeTab === "recent") {
          endpoint = "/posts/recent"
        } else if (activeTab === "following") {
          endpoint = "/posts/following"
        }

        if (searchQuery) {
          endpoint = `/posts/search?query=${encodeURIComponent(searchQuery)}`
        }

        const response = await api.get(endpoint)
        setPosts(response.data)
      } catch (error) {
        console.error("Error fetching posts:", error)
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [activeTab, searchQuery, toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is already triggered by the useEffect when searchQuery changes
  }

  const handleLike = async (postId: number, index: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      const post = posts[index]

      if (post.liked_by_current_user) {
        await api.delete(`/posts/${postId}/unlike`)

        // Update the post in the state
        const updatedPosts = [...posts]
        updatedPosts[index] = {
          ...post,
          likes_count: post.likes_count - 1,
          liked_by_current_user: false,
        }
        setPosts(updatedPosts)
      } else {
        await api.post(`/posts/${postId}/like`)

        // Update the post in the state
        const updatedPosts = [...posts]
        updatedPosts[index] = {
          ...post,
          likes_count: post.likes_count + 1,
          liked_by_current_user: true,
        }
        setPosts(updatedPosts)
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-medium">Explore</h1>
          <p className="text-muted-foreground">Discover poetry and stories from the community</p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Search for posts, authors, or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </form>

        <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="trending" className="space-y-6 pt-4">
            {loading ? (
              <div className="py-8 text-center">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No posts found. Try a different search term or category.
              </div>
            ) : (
              posts.map((post, index) => (
                <PostCard key={post.id} post={post} onLike={() => handleLike(post.id, index)} />
              ))
            )}
          </TabsContent>
          <TabsContent value="recent" className="space-y-6 pt-4">
            {loading ? (
              <div className="py-8 text-center">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No recent posts found.</div>
            ) : (
              posts.map((post, index) => (
                <PostCard key={post.id} post={post} onLike={() => handleLike(post.id, index)} />
              ))
            )}
          </TabsContent>
          <TabsContent value="following" className="space-y-6 pt-4">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">Sign in to see posts from people you follow</p>
                <Button asChild>
                  <Link to="/sign-in">Sign in</Link>
                </Button>
              </div>
            ) : loading ? (
              <div className="py-8 text-center">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No posts from people you follow. Start following some authors!
              </div>
            ) : (
              posts.map((post, index) => (
                <PostCard key={post.id} post={post} onLike={() => handleLike(post.id, index)} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface PostCardProps {
  post: Post
  onLike: () => void
}

function PostCard({ post, onLike }: PostCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar || "/placeholder.svg?height=40&width=40"} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/profile/${post.author.username}`} className="font-medium hover:underline">
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">@{post.author.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Link to={`/post/${post.id}`} className="block group">
          <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
          <p className="text-muted-foreground">{post.excerpt}</p>
        </Link>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/explore?tag=${tag}`}
              className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={post.liked_by_current_user ? "text-red-500" : ""}
            onClick={onLike}
          >
            <Heart className={`h-4 w-4 mr-1 ${post.liked_by_current_user ? "fill-current" : ""}`} /> {post.likes_count}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" /> {post.comments_count}
          </Button>
          <Button variant="ghost" size="sm">
            <Repeat2 className="h-4 w-4 mr-1" /> {post.reposts_count}
          </Button>
        </div>
        {post.has_audio && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/post/${post.id}`}>
              <Play className="h-4 w-4 mr-1" /> Listen
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default Explore
