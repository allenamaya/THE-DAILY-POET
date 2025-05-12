"use client"

import Link from "next/link"

import type React from "react"
import { useState, useEffect } from "react"
import { api } from "../lib/api"
import { useToast } from "../hooks/useToast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Eye, Heart, MessageSquare, Repeat2, TrendingUp, Users } from "lucide-react"

interface AnalyticsData {
  overview: {
    total_posts: number
    total_views: number
    total_likes: number
    total_comments: number
    total_reposts: number
    followers_count: number
  }
  engagement_rate: number
  posts_by_day: {
    date: string
    posts: number
  }[]
  views_by_day: {
    date: string
    views: number
  }[]
  engagement_by_day: {
    date: string
    likes: number
    comments: number
    reposts: number
  }[]
  top_posts: {
    id: number
    title: string
    views: number
    likes: number
    comments: number
    reposts: number
  }[]
  engagement_distribution: {
    name: string
    value: number
  }[]
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("30days")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const COLORS = ["#ff4d6d", "#4361ee", "#4cc9f0"]

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/analytics?range=${timeRange}`)
        setAnalyticsData(response.data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-8">Analytics</h1>
          <div className="text-center py-12">Loading analytics data...</div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-8">Analytics</h1>
          <div className="text-center py-12 text-muted-foreground">No analytics data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-medium">Analytics</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Posts</CardDescription>
              <CardTitle className="text-3xl flex items-center">{analyticsData.overview.total_posts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Your lifetime published posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-3xl flex items-center">
                {analyticsData.overview.total_views}
                <Eye className="ml-2 h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">How many times your posts have been viewed</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Engagement Rate</CardDescription>
              <CardTitle className="text-3xl flex items-center">
                {(analyticsData.engagement_rate * 100).toFixed(1)}%
                <TrendingUp className="ml-2 h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Average engagement per post view</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Likes</CardDescription>
              <CardTitle className="text-3xl flex items-center">
                {analyticsData.overview.total_likes}
                <Heart className="ml-2 h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">How many likes your posts have received</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Comments</CardDescription>
              <CardTitle className="text-3xl flex items-center">
                {analyticsData.overview.total_comments}
                <MessageSquare className="ml-2 h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">How many comments your posts have received</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Followers</CardDescription>
              <CardTitle className="text-3xl flex items-center">
                {analyticsData.overview.followers_count}
                <Users className="ml-2 h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">People following your profile</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="views">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="posts">Top Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="views" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
                <CardDescription>How many people viewed your posts during this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.views_by_day}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#ff4d6d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="engagement" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Over Time</CardTitle>
                  <CardDescription>Likes, comments, and reposts during this period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.engagement_by_day}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="likes" fill="#ff4d6d" name="Likes" />
                        <Bar dataKey="comments" fill="#4361ee" name="Comments" />
                        <Bar dataKey="reposts" fill="#4cc9f0" name="Reposts" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Distribution</CardTitle>
                  <CardDescription>How your engagement is distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.engagement_distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.engagement_distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Your posts with the highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {analyticsData.top_posts.map((post, index) => (
                    <div key={post.id} className="flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="font-bold text-lg mr-2">#{index + 1}</span>
                          <Link to={`/post/${post.id}`} className="font-medium hover:underline">
                            {post.title}
                          </Link>
                        </div>
                        <div className="text-sm text-muted-foreground">{post.views} views</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1 text-primary" />
                            <span className="text-sm">{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-primary" />
                            <span className="text-sm">{post.comments}</span>
                          </div>
                          <div className="flex items-center">
                            <Repeat2 className="h-4 w-4 mr-1 text-primary" />
                            <span className="text-sm">{post.reposts}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          Engagement rate:{" "}
                          {(((post.likes + post.comments + post.reposts) / post.views) * 100).toFixed(1)}%
                        </div>
                      </div>
                      {index < analyticsData.top_posts.length - 1 && (
                        <div className="mt-4 border-b border-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Analytics
