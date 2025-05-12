import axios from "axios"

// Create an axios instance with default config
export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // Important for cookies/authentication
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add CSRF token if needed
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle session timeouts or authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to login or dispatch an event
      window.location.href = "/sign-in"
    }
    return Promise.reject(error)
  },
)
