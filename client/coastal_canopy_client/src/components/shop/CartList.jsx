import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import {ArrowUp} from "lucide-react"

const CartList = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Load cart items from localStorage on component mount
  useEffect(() => {

    // Small delay to ensure localStorage has been updated
    const timer = setTimeout(() => {
      try {
        const savedCartItems = localStorage.getItem("mangroveCartItems")
        if (savedCartItems) {
          const parsedItems = JSON.parse(savedCartItems)
          setCartItems(parsedItems)
          console.log("Loaded cart items:", parsedItems)
        }
      } catch (error) {
        console.error("Error loading cart items from localStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      // Only save after initial load
      try {
        localStorage.setItem("mangroveCartItems", JSON.stringify(cartItems))
        console.log("Saved cart items:", cartItems)
      } catch (error) {
        console.error("Error saving cart items to localStorage:", error)
      }
    }
  }, [cartItems, isLoading])

  const removeItem = (id, index) => {
    const updatedCartItems = cartItems.filter((item, i) => !(item.id === id && i === index))
    setCartItems(updatedCartItems)
    // Immediately update localStorage
    try {
      localStorage.setItem("mangroveCartItems", JSON.stringify(updatedCartItems))
    } catch (error) {
      console.error("Error saving cart items to localStorage:", error)
    }
  }

  const clearCart = () => {
    setCartItems([])
    // Immediately update localStorage
    try {
      localStorage.setItem("mangroveCartItems", JSON.stringify([]))
    } catch (error) {
      console.error("Error clearing cart items in localStorage:", error)
    }
  }

  const totalAmount = cartItems
    .reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace("Rs. ", "").replace(",", "").replace(".00", ""))
      return total + price
    }, 0)
    .toFixed(2)

  const handleCheckout = () => {
    // Navigate to payment page with state
    navigate("/shop/payment", {
      state: {
        cartItems: cartItems,
        totalAmount: totalAmount,
      },
    })
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="relative z-20">
        <Navbar />
      </div>

      <div
        className="absolute inset-0 w-full min-h-screen"
        style={{
          backgroundImage: "url('/imgs/shop/mangrove_background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start py-16 px-4">
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen flex flex-col items-center my-12">
          <h1 className="text-3xl font-bold mb-8 text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}>Your Shopping Cart</h1>

          <div className="w-full max-w-3xl">
            {isLoading ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-lg">Loading your cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-lg mb-4">Your cart is empty</p>
                <Link
                  to="/shop"
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Your Items</h2>
                  <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600" onClick={clearCart}>
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.description}
                          className="w-16 h-16 object-cover mr-5 rounded-md"
                        />
                        <div>
                          <h3 className="text-md font-medium">{item.description}</h3>
                          <p className="text-green-700 font-bold">{item.price}</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-600" onClick={() => removeItem(item.id, index)}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <h3 className="text-lg">
                    Total Amount: <span className="font-bold text-red-700">Rs. {totalAmount}</span>
                  </h3>

                  {/* Using React Router navigation instead of state */}
                  <button
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-semibold"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="z-20 fixed bottom-8 right-5">
      <a 
        href="#top" 
        className="flex items-center justify-center w-12 h-12 bg-green-600/90 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </a>
    </div>
    
      <Footer />
    </div>
  )
}

export default CartList

