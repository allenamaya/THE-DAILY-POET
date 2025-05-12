import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import FeaturedPosts from "@/components/featured-posts"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col items-center justify-center space-y-4 text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight">The Daily Poet</h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          A space to share your poetry, stories, and spoken word with the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button asChild size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-up">Create Account</Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-medium">Featured Works</h2>
          <Button variant="ghost" asChild>
            <Link href="/explore" className="flex items-center gap-2">
              Explore more <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <FeaturedPosts />
      </section>

      <section className="py-12 border-t">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-4">
            <h3 className="text-xl font-serif mb-2">Share Your Voice</h3>
            <p className="text-muted-foreground">
              Post your poetry and stories in a beautiful, distraction-free environment.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <h3 className="text-xl font-serif mb-2">Record Your Readings</h3>
            <p className="text-muted-foreground">Add depth to your work with audio recordings of your readings.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <h3 className="text-xl font-serif mb-2">Connect & Discover</h3>
            <p className="text-muted-foreground">Like, comment, and repost works that move you. Discover new voices.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
