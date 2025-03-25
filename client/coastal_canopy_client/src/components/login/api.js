import axios from "axios"

// Create an Axios instance with the backend URL
const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
