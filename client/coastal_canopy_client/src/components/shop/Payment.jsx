import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import {ArrowUp} from "lucide-react"

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState("0.00")
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Get cart data from location state or localStorage
  useEffect(() => {
    if (location.state?.cartItems && location.state?.totalAmount) {
      setCartItems(location.state.cartItems)
      setTotalAmount(location.state.totalAmount)
    } else {
      // Fallback to localStorage if no state is passed
      try {
        const savedCartItems = localStorage.getItem("mangroveCartItems")
        if (savedCartItems) {
          const parsedItems = JSON.parse(savedCartItems)
          setCartItems(parsedItems)

          // Calculate total amount
          const total = parsedItems
            .reduce((total, item) => {
              const price = Number.parseFloat(item.price.replace("Rs. ", "").replace(",", "").replace(".00", ""))
              return total + price
            }, 0)
            .toFixed(2)

          setTotalAmount(total)
        } else {
          // If no items in cart, redirect back to cart
          navigate("/shop/cartList")
        }
      } catch (error) {
        console.error("Error loading cart items from localStorage:", error)
        navigate("/shop/cartList")
      }
    }
  }, [location.state, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCardSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      // Clear cart after successful payment
      localStorage.setItem("mangroveCartItems", JSON.stringify([]))
    }, 2000)
  }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalAmount,
          },
        },
      ],
    })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      setIsSuccess(true)
      // Clear cart after successful payment
      localStorage.setItem("mangroveCartItems", JSON.stringify([]))
    })
  }

  if (isSuccess) {
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
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center mt-16">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
              <Link to="/" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-semibold">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
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
          <div className="w-full max-w-3xl mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <Link to="/shop/cartList" className="text-gray-600 hover:text-gray-800 mr-4">
                  <ArrowLeft size={20} />
                </Link>
                <h2 className="text-2xl font-bold">Checkout</h2>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.description}</span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>Rs. {totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                {/* Payment method buttons removed as requested */}
              </div>

              {paymentMethod === "paypal" ? (
                <div className="mb-6">
                  <PayPalScriptProvider
                    options={{
                      "client-id": "ASWSqzAfL5BGaI0wWhQe2ggkNz9YaGvMiScBT0m6tbQzRrtTpLYNNHKd6XpQuKdCXdkdD9NOcWT-azlB",
                      currency: "USD",
                    }}
                  >
                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} style={{ layout: "vertical" }} />
                  </PayPalScriptProvider>
                </div>
              ) : (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-2 border rounded-md"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Billing Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Address"
                          className="w-full px-4 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className="w-full px-4 py-2 border rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className="w-full px-4 py-2 border rounded-md"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-semibold"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </button>
                </form>
              )}
            </div>
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

export default Payment

