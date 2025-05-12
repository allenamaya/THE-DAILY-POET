import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import CreatePost from "./pages/CreatePost"
import PostDetail from "./pages/PostDetail"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Search from "./pages/Search"
import Notifications from "./pages/Notifications"
import Analytics from "./pages/Analytics"
import Collections from "./pages/Collections"
import CollectionDetail from "./pages/CollectionDetail"
import { UserProvider } from "./contexts/UserContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import ProtectedRoute from "./components/ProtectedRoute"

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="daily-poet-theme">
      <UserProvider>
        <NotificationProvider>
          <Router>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/profile/:username" element={<Profile />} />
                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute>
                        <CreatePost />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/collections"
                    element={
                      <ProtectedRoute>
                        <Collections />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/collections/:id"
                    element={
                      <ProtectedRoute>
                        <CollectionDetail />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
