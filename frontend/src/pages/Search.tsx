"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import { useToast } from "../hooks/useToast"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Heart, MessageSquare, Repeat2, Play, SearchIcon, User, Hash } from "lucide-react"

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

interface UserProfile {
  id: number
  name: string
  username: string
  avatar: string | null
  bio: string | null
  followers_count: number
  following_count: number
  posts_count: number
}

interface Tag {
  name: string
  posts_count: number
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    posts: Post[]
    users: UserProfile[]
    tags: Tag[]
  }>({
    posts: [],
    users: [],
    tags: [],
  })
  const [activeTab, setActiveTab] = useState("posts")
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return

    const updatedSearches = [query, ...recentSearches.filter((search) => search !== query)].slice(0, 5)

    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsSearching(true)
    saveRecentSearch(searchQuery)

    try {
      const response = await api.get(`/search?query=${encodeURIComponent(searchQuery)}`)
      setSearchResults(response.data)
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

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query)
    // Trigger search immediately
    const searchForm = document.getElementById("search-form") as HTMLFormElement
    if (searchForm) {
      searchForm.dispatchEvent(new Event("submit", { cancelable: true }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-serif font-medium">Search</h1>

        <form id="search-form" onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search for posts, users, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        {recentSearches.length > 0 &&
          !searchResults.posts.length &&
          !searchResults.users.length &&
          !searchResults.tags.length && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button key={index} variant="outline" size="sm" onClick={() => handleRecentSearchClick(search)}>
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

        {(searchResults.posts.length > 0 || searchResults.users.length > 0 || searchResults.tags.length > 0) && (
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts ({searchResults.posts.length})</TabsTrigger>
              <TabsTrigger value="users">Users ({searchResults.users.length})</TabsTrigger>
              <TabsTrigger value="tags">Tags ({searchResults.tags.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6 space-y-4">
              {searchResults.posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No posts found</div>
              ) : (
                searchResults.posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
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
                            to={`/search?tag=${tag}`}
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
                          <Heart className="h-4 w-4 mr-1" /> {post.likes_count}
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
                ))
              )}
            </TabsContent>

            <TabsContent value="users" className="mt-6 space-y-4">
              {searchResults.users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No users found</div>
              ) : (
                searchResults.users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg?height=48&width=48"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Link to={`/profile/${user.username}`} className="font-medium hover:underline text-lg">
                            {user.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          {user.bio && <p className="mt-2 text-sm line-clamp-2">{user.bio}</p>}
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>{user.posts_count} posts</span>
                            <span>{user.followers_count} followers</span>
                            <span>{user.following_count} following</span>
                          </div>
                        </div>
                        <Button asChild>
                          <Link to={`/profile/${user.username}`}>
                            <User className="h-4 w-4 mr-2" /> View Profile
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="tags" className="mt-6 space-y-4">
              {searchResults.tags.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tags found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.tags.map((tag) => (
                    <Card key={tag.name} className="overflow-hidden">
                      <Link to={`/search?tag=${tag.name}`} className="block p-6 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary rounded-full p-3">
                            <Hash className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">#{tag.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {tag.posts_count} {tag.posts_count === 1 ? "post" : "posts"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default Search
