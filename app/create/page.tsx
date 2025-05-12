"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Play, Pause, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // This would be implemented with the Web Audio API in a real application
  const startRecording = () => {
    setIsRecording(true)
    // Actual recording logic would go here
  }

  const stopRecording = () => {
    setIsRecording(false)
    // In a real app, this would save the recording and set the URL
    setAudioURL("dummy-audio-url")
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // Actual audio playback logic would go here
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic would go here
    console.log({ title, content, audioURL })
    alert("Post created successfully!")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Create New Post</CardTitle>
          <CardDescription>Share your poetry or story with the community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter the title of your work"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your poetry or story here..."
                className="min-h-[200px] resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Audio Reading (Optional)</Label>
              <Tabs defaultValue="record" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="record">Record</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="record" className="space-y-4">
                  <div className="flex justify-center py-8 border rounded-md bg-muted/30">
                    <Button
                      type="button"
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      className="rounded-full h-16 w-16"
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      <span className="sr-only">{isRecording ? "Stop Recording" : "Start Recording"}</span>
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {isRecording
                      ? "Recording... Click to stop"
                      : audioURL
                        ? "Recording saved. You can re-record if needed."
                        : "Click to start recording your reading"}
                  </p>
                </TabsContent>
                <TabsContent value="preview">
                  {audioURL ? (
                    <div className="flex flex-col items-center gap-4 py-8 border rounded-md bg-muted/30">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="rounded-full h-16 w-16"
                        onClick={togglePlayback}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {isPlaying ? "Playing audio..." : "Click to play your recording"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-center py-8 border rounded-md bg-muted/30">
                      <p className="text-muted-foreground">No audio recording yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" /> Publish Post
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
