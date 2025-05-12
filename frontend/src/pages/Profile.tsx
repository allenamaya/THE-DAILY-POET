"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Heart, MessageSquare, Repeat2, Play } from "lucide-react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import { useToast } from "../hooks/useToast"
import { useUser } from "../contexts/UserContext"

interface Profile {
  id: number
  name: string
  username: string
  bio: string | null
  avatar: string | null
  followers_count: number
  following_count: number
  posts_count: number
  joined_at: string
  is_following: boolean
  is_current_user: boolean
}

interface Post {
  id: number
  title: string
  excerpt: string
  likes_count: number
  comments_count: number
  reposts_count: number
  has_audio: boolean
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [audioPostsCount, setAudioPostsCount] = useState(0)
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState("posts")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { isAuthenticated } = useUser()

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/profiles/${username}`)
        setProfile(response.data.profile)
        setPosts(response.data.posts)
        setAudioPostsCount(response.data.posts.filter((post: Post) => post.has_audio).length)
        // Liked posts will be fetched when the tab is clicked
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  useEffect(() => {
    if (activeTab === "likes" && likedPosts.length === 0 && profile && isAuthenticated) {
      const fetchLikedPosts = async () => {
        try {
          const response = await api.get(`/profiles/${username}/liked_posts`)
          setLikedPosts(response.data)
        } catch (error) {
          console.error("Error fetching liked posts:", error)
          toast({
            title: "Error",
            description: "Failed to load liked posts",
            variant: "destructive",
          })
        }
      }

      fetchLikedPosts()
    }
  }, [activeTab, username, likedPosts.length, profile, isAuthenticated, toast])

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "destructive",
      })
      return
    }

    if (!profile) return

    try {
      if (profile.is_following) {
        await api.delete(`/profiles/${profile.username}/unfollow`)
        setProfile({
          ...profile,
          followers_count: profile.followers_count - 1,
          is_following: false,
        })
        toast({
          title: "Success",
          description: `You unfollowed ${profile.name}`,
        })
      } else {
        await api.post(`/profiles/${profile.username}/follow`)
        setProfile({
          ...profile,
          followers_count: profile.followers_count + 1,
          is_following: true,
        })
        toast({
          title: "Success",
          description: `You are now following ${profile.name}`,
        })
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12 flex justify-center">Loading profile...</div>
  }

  if (error || !profile) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error || "Profile not found"}</div>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={profile.avatar || "/placeholder.svg?height=120&width=120"} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-serif font-medium">{profile.name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>

            <p className="mt-4 mb-4">{profile.bio || "No bio provided"}</p>

            <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm">
              <div>
                <span className="font-medium">{profile.posts_count}</span> posts
              </div>
              <div>
                <span className="font-medium">{profile.followers_count}</span> followers
              </div>
              <div>
                <span className="font-medium">{profile.following_count}</span> following
              </div>
              <div className="text-muted-foreground">Joined {formatDate(profile.joined_at)}</div>
            </div>
          </div>

          <div>
            {!profile.is_current_user && (
              <Button onClick={handleFollow}>{profile.is_following ? "Unfollow" : "Follow"}</Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="space-y-6 pt-4">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No posts to display</p>
                {profile.is_current_user && (
                  <Button asChild className="mt-4">
                    <Link to="/create">Create your first post</Link>
                  </Button>
                )}
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </TabsContent>
          <TabsContent value="audio" className="space-y-6 pt-4">
            {audioPostsCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No audio posts to display</p>
                {profile.is_current_user && (
                  <Button asChild className="mt-4">
                    <Link to="/create">Create your first audio post</Link>
                  </Button>
                )}
              </div>
            ) : (
              posts
                .filter((post) => post.has_audio)
                .map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <Link to={`/post/${post.id}`} className="block group">
                        <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
                        <p className="text-muted-foreground">{post.excerpt}</p>
                      </Link>
                      <Button variant="outline" size="sm" className="mt-4" asChild>
                        <Link to={`/post/${post.id}`}>
                          <Play className="h-4 w-4 mr-1" /> Listen to audio
                        </Link>
                      </Button>
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
                    </CardFooter>
                  </Card>
                ))
            )}
          </TabsContent>
          <TabsContent value="likes" className="pt-4">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">Sign in to see liked posts</p>
                <Button asChild>
                  <Link to="/sign-in">Sign in</Link>
                </Button>
              </div>
            ) : likedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No liked posts to display</p>
              </div>
            ) : (
              <div className="space-y-6">
                {likedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Link to={`/post/${post.id}`} className="block group">
          <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
          <p className="text-muted-foreground">{post.excerpt}</p>
        </Link>
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
  )
}

export default Profile
