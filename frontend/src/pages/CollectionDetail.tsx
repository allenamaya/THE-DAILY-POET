"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "../lib/api"
import { useToast } from "../hooks/useToast"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Heart, MessageSquare, Repeat2, Play, Lock, Globe, Plus, ArrowLeft, Search } from "lucide-react"

interface Collection {
  id: number
  name: string
  description: string | null
  is_private: boolean
  posts_count: number
  created_at: string
  updated_at: string
}

interface Post {
  id: number
  title: string
  excerpt: string
  author: {
    id: number
    name: string
    username: string
    avatar: string | null
  }
  likes_count: number
  comments_count: number
  reposts_count: number
  has_audio: boolean
  tags: string[]
}

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchCollection()
    }
  }, [id])

  const fetchCollection = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/collections/${id}`)
      setCollection(response.data.collection)
      setPosts(response.data.posts)
    } catch (error) {
      console.error("Error fetching collection:", error)
      toast({
        title: "Error",
        description: "Failed to load collection",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      const response = await api.get(`/search?query=${encodeURIComponent(searchQuery)}&exclude_collection=${id}`)
      setSearchResults(response.data.posts)
    } catch (error) {
      console.error("Error searching:", error)
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddToCollection = async (postId: number) => {
    try {
      await api.post(`/collections/${id}/add_post`, { post_id: postId })

      // Find the post in search results and add it to the collection posts
      const postToAdd = searchResults.find((post) => post.id === postId)
      if (postToAdd) {
        setPosts([...posts, postToAdd])
        // Remove from search results
        setSearchResults(searchResults.filter((post) => post.id !== postId))
      }

      toast({
        title: "Success",
        description: "Post added to collection",
      })
    } catch (error) {
      console.error("Error adding post to collection:", error)
      toast({
        title: "Error",
        description: "Failed to add post to collection",
        variant: "destructive",
      })
    }
  }

  const handleRemoveFromCollection = async (postId: number) => {
    try {
      await api.delete(`/collections/${id}/remove_post/${postId}`)

      // Remove the post from the collection posts
      setPosts(posts.filter((post) => post.id !== postId))

      toast({
        title: "Success",
        description: "Post removed from collection",
      })
    } catch (error) {
      console.error("Error removing post from collection:", error)
      toast({
        title: "Error",
        description: "Failed to remove post from collection",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">Loading collection...</div>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12 text-muted-foreground">Collection not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/collections">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Collections
            </Link>
          </Button>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-serif font-medium">{collection.name}</h1>
              {collection.is_private ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            {collection.description && <p className="text-muted-foreground mt-2">{collection.description}</p>}
            <p className="text-sm mt-4">
              {collection.posts_count} {collection.posts_count === 1 ? "post" : "posts"}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Posts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add Posts to Collection</DialogTitle>
                <DialogDescription>Search for posts to add to your "{collection.name}" collection.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSearch} className="space-y-4 py-4">
                <div className="relative">
                  <Input
                    placeholder="Search for posts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </form>
              <div className="max-h-[400px] overflow-y-auto space-y-4">
                {searchResults.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {searchQuery ? "No posts found" : "Search for posts to add to your collection"}
                  </div>
                ) : (
                  searchResults.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={post.author.avatar || "/placeholder.svg?height=24&width=24"}
                                  alt={post.author.name}
                                />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{post.author.name}</span>
                            </div>
                            <h3 className="font-medium">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.excerpt}</p>
                          </div>
                          <Button size="sm" onClick={() => handleAddToCollection(post.id)}>
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h2 className="text-xl font-medium mb-2">No posts in this collection yet</h2>
            <p className="text-muted-foreground mb-6">Add posts to your collection to see them here</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Posts
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={post.author.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={post.author.name}
                      />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/profile/${post.author.username}`} className="font-medium hover:underline">
                        {post.author.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">@{post.author.username}</p>
                    </div>
                  </div>
                  <Link to={`/post/${post.id}`} className="block group">
                    <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/search?tag=${tag}`}
                        className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-between">
                  <div className="flex items-center gap-4">
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
                  <div className="flex gap-2">
                    {post.has_audio && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/post/${post.id}`}>
                          <Play className="h-4 w-4 mr-1" /> Listen
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleRemoveFromCollection(post.id)}>
                      Remove
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionDetail
