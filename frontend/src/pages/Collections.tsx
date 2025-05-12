"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import { useToast } from "../hooks/useToast"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
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
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Switch } from "../components/ui/switch"
import { BookMarked, Plus, Pencil, Trash2, Lock, Globe } from "lucide-react"

interface Collection {
  id: number
  name: string
  description: string | null
  is_private: boolean
  posts_count: number
  created_at: string
  updated_at: string
}

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_private: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    setLoading(true)
    try {
      const response = await api.get("/collections")
      setCollections(response.data)
    } catch (error) {
      console.error("Error fetching collections:", error)
      toast({
        title: "Error",
        description: "Failed to load collections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_private: checked,
    })
  }

  const handleOpenDialog = (collection?: Collection) => {
    if (collection) {
      setIsEditMode(true)
      setCurrentCollection(collection)
      setFormData({
        name: collection.name,
        description: collection.description || "",
        is_private: collection.is_private,
      })
    } else {
      setIsEditMode(false)
      setCurrentCollection(null)
      setFormData({
        name: "",
        description: "",
        is_private: false,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsEditMode(false)
    setCurrentCollection(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required",
        variant: "destructive",
      })
      return
    }

    try {
      if (isEditMode && currentCollection) {
        await api.put(`/collections/${currentCollection.id}`, { collection: formData })
        toast({
          title: "Success",
          description: "Collection updated successfully",
        })
      } else {
        await api.post("/collections", { collection: formData })
        toast({
          title: "Success",
          description: "Collection created successfully",
        })
      }

      handleCloseDialog()
      fetchCollections()
    } catch (error) {
      console.error("Error saving collection:", error)
      toast({
        title: "Error",
        description: "Failed to save collection",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) {
      return
    }

    try {
      await api.delete(`/collections/${id}`)
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      })
      fetchCollections()
    } catch (error) {
      console.error("Error deleting collection:", error)
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-8">Collections</h1>
          <div className="text-center py-12">Loading collections...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-medium">Collections</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" /> Create Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{isEditMode ? "Edit Collection" : "Create Collection"}</DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update your collection details below."
                      : "Create a new collection to organize your posts."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="My Collection"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="A collection of my favorite poems..."
                      className="resize-none h-20"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="is_private" checked={formData.is_private} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="is_private">Make this collection private</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">{isEditMode ? "Save Changes" : "Create Collection"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No collections yet</h2>
            <p className="text-muted-foreground mb-6">Create your first collection to organize your posts</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Create Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center">
                      {collection.is_private ? (
                        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      )}
                      {collection.name}
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(collection)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(collection.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {collection.description || "No description provided"}
                  </p>
                  <p className="text-sm mt-4">
                    {collection.posts_count} {collection.posts_count === 1 ? "post" : "posts"}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/collections/${collection.id}`}>View Collection</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Collections
