import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import { useCart } from "./cartContext"

const ShopMain = () => {
  const items = [
    { id: 1, description: "Thermal Long Sleeve Jersey", price: "Rs. 1500.00", image: "/imgs/shop/jersey.png" },
    { id: 2, description: "Shirt", price: "Rs. 1000.00", image: "/imgs/shop/shirt.png" },
    { id: 3, description: "Green Cap", price: "Rs. 500.00", image: "/imgs/shop/green_cap.png" },
    { id: 4, description: "Silicon Wristband", price: "Rs. 200.00", image: "/imgs/shop/wristband.png" },
    { id: 5, description: "Resin Key Tag", price: "Rs. 100.00", image: "/imgs/shop/keytag.png" },
    { id: 6, description: "Gift Basket", price: "Rs. 900.00", image: "/imgs/shop/basket.png" },
    { id: 7, description: "Earth Day Keychain", price: "Rs. 110.00", image: "/imgs/shop/keychain.jpg" },
    { id: 8, description: "Tote Bag Shoulder Hand Bag", price: "Rs. 500.00", image: "/imgs/shop/bag.png" },
    { id: 9, description: "Environmental Sticker Pack", price: "Rs. 100.00", image: "/imgs/shop/pack1.jpg" },
    { id: 10, description: "Sticker Pack 1", price: "Rs. 120.00", image: "/imgs/shop/pack2.png" },
    { id: 11, description: "Sticker Pack 3", price: "Rs. 100.00", image: "/imgs/shop/pack4.png" },
    { id: 12, description: "Sticker Pack 4", price: "Rs. 100.00", image: "/imgs/shop/pack3.jpg" },
    { id: 12, description: "Cofee Mug", price: "Rs. 400.00", image: "/imgs/shop/mug.png" },
    { id: 12, description: "Submarine Bracelet", price: "Rs. 300.00", image: "/imgs/shop/bracelet.jpg" },
    { id: 12, description: "Glass Water Bottle", price: "Rs. 700.00", image: "/imgs/shop/bottle.png" },
    { id: 12, description: "Suviniour", price: "Rs. 200.00", image: "/imgs/shop/suviniour.png" },
  ]

  const { cartItems, addToCart } = useCart()
  const [showSuccessMessage, setShowSuccessMessage] = useState(null)

  const handleAddToCart = (item) => {
    addToCart(item)

    // Show success message next to the added item
    setShowSuccessMessage(item.id)

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(null)
    }, 3000)
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background Image */}
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-start py-16 px-4">
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen flex flex-col items-center my-12">
          <h1 className="text-3xl font-bold mb-4 text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}>Hope Grows With Every Click !</h1>

          <h5 className="text-xl font-semibold mb-4 text-white">
            Every purchase plants a seed of hope - support mangroves, sustain life
          </h5>

          <Link
            to="cartList"
            className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 mb-4 mt-5 flex items-center transform transition-transform duration-300 hover:scale-105"
          >
            View Shopping Cart ({cartItems.length})
            <ShoppingCart size={20} className="ml-2" />
          </Link>

          {/* Grid for Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 w-full">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-full transform transition-transform duration-300 hover:scale-105 relative"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={`Item ${item.id}`}
                  className="w-full h-56 object-cover mb-1 rounded-md"
                />

                <p className="text-gray-700 mb-4 mt-7 text-center text-lg">{item.description}</p>
                <p className="text-green-700 font-bold mb-4 text-lg">{item.price}</p>

                <button
                  className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 ml-auto"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart size={18} />
                </button>

                {/* Success Message */}
                {showSuccessMessage === item.id && (
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white text-green-600 text-sm px-3 py-1 rounded-md shadow-md flex items-center space-x-2">
                    <p>Added to cart successfully!</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ShopMain