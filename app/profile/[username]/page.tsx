import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, MessageSquare, Repeat2, Play } from "lucide-react"
import Link from "next/link"

// This would normally come from a database based on the username
const profile = {
  name: "Emily Chen",
  username: "emilypoet",
  bio: "Poet, storyteller, and lover of words. I write about nature, emotions, and the human experience.",
  avatar: "/placeholder.svg?height=120&width=120",
  followers: 245,
  following: 132,
  posts: 37,
  joined: "March 2023",
}

// This would normally come from a database
const userPosts = [
  {
    id: "1",
    title: "Whispers of Autumn",
    excerpt: "The leaves fall gently, painting the ground with hues of amber and gold...",
    likes: 42,
    comments: 7,
    reposts: 3,
    hasAudio: true,
  },
  {
    id: "2",
    title: "Morning Dew",
    excerpt: "Droplets of crystal clear water rest upon emerald blades, catching the first light...",
    likes: 31,
    comments: 5,
    reposts: 2,
    hasAudio: true,
  },
  {
    id: "3",
    title: "City at Dawn",
    excerpt: "The city awakens, stretching its concrete limbs as the sun peeks over the horizon...",
    likes: 28,
    comments: 4,
    reposts: 1,
    hasAudio: false,
  },
]

export default function ProfilePage({ params }: { params: { username: string } }) {
  // In a real app, we would fetch the profile data based on the username

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-serif font-medium">{profile.name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>

            <p className="mt-4 mb-4">{profile.bio}</p>

            <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm">
              <div>
                <span className="font-medium">{profile.posts}</span> posts
              </div>
              <div>
                <span className="font-medium">{profile.followers}</span> followers
              </div>
              <div>
                <span className="font-medium">{profile.following}</span> following
              </div>
              <div className="text-muted-foreground">Joined {profile.joined}</div>
            </div>
          </div>

          <div>
            <Button>Follow</Button>
          </div>
        </div>

        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="space-y-6 pt-4">
            {userPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <Link href={`/post/${post.id}`} className="block group">
                    <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </Link>
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
            ))}
          </TabsContent>
          <TabsContent value="audio" className="space-y-6 pt-4">
            {userPosts
              .filter((post) => post.hasAudio)
              .map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <Link href={`/post/${post.id}`} className="block group">
                      <h3 className="text-xl font-serif mb-2 group-hover:underline">{post.title}</h3>
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    </Link>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Play className="h-4 w-4 mr-1" /> Listen to audio
                    </Button>
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
                  </CardFooter>
                </Card>
              ))}
          </TabsContent>
          <TabsContent value="likes" className="pt-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No liked posts to display</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
