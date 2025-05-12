"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Mic, MicOff, Play, Pause, Save } from "lucide-react"
import { useToast } from "../hooks/useToast"
import { api } from "../lib/api"

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        setAudioBlob(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Error",
        description: "Could not access your microphone. Please check your permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please provide both title and content for your post.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("post[title]", title)
      formData.append("post[content]", content)

      if (audioBlob) {
        formData.append("post[audio]", audioBlob)
      }

      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "Success!",
        description: "Your post has been published.",
      })

      navigate(`/post/${response.data.id}`)
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error",
        description: "Failed to publish your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
                      <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" /> {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default CreatePost
