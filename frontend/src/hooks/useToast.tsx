"use client"

import type React from "react"
import { useContext, createContext, useState, type ReactNode } from "react"

type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  toast: () => {},
  removeToast: () => {},
})

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast: addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useContext(ToastContext)

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-72">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md border ${
            toast.variant === "destructive"
              ? "bg-red-500 text-white border-red-600"
              : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{toast.title}</h3>
            <button onClick={() => removeToast(toast.id)} className="text-sm font-medium ml-2">
              ✕
            </button>
          </div>
          {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
        </div>
      ))}
    </div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
