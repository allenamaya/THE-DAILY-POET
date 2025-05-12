"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, PenLine, Search, Bell, Settings, BarChart2, BookMarked } from "lucide-react"
import { Button } from "./ui/button"
import { ModeToggle } from "./ModeToggle"
import { useUser } from "../contexts/UserContext"
import { useNotifications } from "../contexts/NotificationContext"
import { cn } from "../lib/utils"
import NotificationDropdown from "./NotificationDropdown"

const Navbar: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useUser()
  const { unreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Search", href: "/search", icon: Search },
  ]

  const userNavItems = [
    { name: "New Post", href: "/create", icon: PenLine },
    { name: "Collections", href: "/collections", icon: BookMarked },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setShowNotifications(false)
  }, [location.pathname])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-serif text-xl font-medium">
              The Daily Poet
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground/80",
                  location.pathname === item.href ? "text-foreground font-medium" : "text-foreground/60",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                  {showNotifications && <NotificationDropdown />}
                </div>

                <div className="relative group">
                  <Button asChild variant="ghost" size="icon">
                    <Link to={`/profile/${user?.username}`}>
                      <span className="sr-only">Profile</span>
                      {user?.avatar ? (
                        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">{user?.name.charAt(0)}</span>
                        </div>
                      )}
                    </Link>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border hidden group-hover:block z-50">
                    <div className="py-1">
                      {userNavItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                        >
                          {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted w-full text-left"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>

                <Button asChild variant="default" size="sm" className="hidden lg:flex">
                  <Link to="/create" className="flex items-center gap-2">
                    <PenLine className="h-4 w-4" /> New Post
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/sign-up">Sign up</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            )}
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile notifications dropdown */}
      {showNotifications && (
        <div className="md:hidden border-t">
          <NotificationDropdown isMobile />
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground/80 py-2",
                    location.pathname === item.href ? "text-foreground font-medium" : "text-foreground/60",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {userNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center gap-2 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />} {item.name}
                    </Link>
                  ))}
                  <Link to={`/profile/${user?.username}`} className="py-2" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Button variant="outline" onClick={logout} className="mt-2">
                    Sign out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button asChild>
                    <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
