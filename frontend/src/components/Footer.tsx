import type React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Home
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Daily Poet. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
