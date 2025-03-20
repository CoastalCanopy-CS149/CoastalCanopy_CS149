import { createContext, useState, useEffect, useContext } from "react"

// Create a context for the cart
const CartContext = createContext()

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart items from localStorage on initial render
  useEffect(() => {
    try {
      const savedCartItems = localStorage.getItem("mangroveCartItems")
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems))
      }
    } catch (error) {
      console.error("Error loading cart items from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      // Only save after initial load
      try {
        localStorage.setItem("mangroveCartItems", JSON.stringify(cartItems))
      } catch (error) {
        console.error("Error saving cart items to localStorage:", error)
      }
    }
  }, [cartItems, isLoaded])

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item])
  }

  // Remove item from cart
  const removeFromCart = (id, index) => {
    setCartItems((prevItems) => prevItems.filter((item, i) => !(item.id === id && i === index)))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}