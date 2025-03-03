import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronRight } from "lucide-react";  // Import ChevronRight icon for right arrow
import CartList from './CartList';

const shop = () => {
  const items = [
    { id: 1, description: 'Thermal Long Sleeve Jersey', price: 'Rs. 1500.00', image: '/imgs/shop/jersey.png' },
    { id: 2, description: 'Shirt', price: 'Rs. 1000.00', image: '/imgs/shop/shirt.png' },
    { id: 3, description: 'Green Cap', price: 'Rs. 500.00', image: '/imgs/shop/green_cap.png' },
    { id: 4, description: 'Silicon Wristband', price: 'Rs. 200.00', image: '/imgs/shop/wristband.png' },
    { id: 5, description: 'Resin Key Tag', price: 'Rs. 100.00', image: '/imgs/shop/keytag.png' },
    { id: 6, description: 'Tote Bag Set', price: 'Rs. 750.00', image: '/imgs/shop/bagset.png' },
    { id: 7, description: 'Earth Day Keychain', price: 'Rs. 110.00', image: '/imgs/shop/keychain.jpg' },
    { id: 8, description: 'Tote Bag Shoulder Hand Bag', price: 'Rs. 500.00', image: '/imgs/shop/bag.png' },
    { id: 9, description: 'Environmental Sticker Pack', price: 'Rs. 100.00', image: '/imgs/shop/pack1.jpg' },
    { id: 10, description: 'Sticker Pack 1', price: 'Rs. 120.00', image: '/imgs/shop/pack2.png' },
    { id: 11, description: 'Sticker Pack 3', price: 'Rs. 100.00', image: '/imgs/shop/pack4.png' },
    { id: 12, description: 'Sticker Pack 4', price: 'Rs. 100.00', image: '/imgs/shop/pack3.jpg' },
  ];

  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);  // Track which item was added

  const addToCart = (item) => {
    setCartItems((prevCartItems) => {
      return [...prevCartItems, item];
    });

    // Show success message next to the added item
    setShowSuccessMessage(item.id);

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen w-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-screen min-h-screen"
        style={{
          backgroundImage: "url('/imgs/shop/mangrove_background.jpg')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          backgroundAttachment: 'fixed', /* Prevents zooming or scrolling effects */
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-start py-16 px-4">
          <div className="bg-green-100 bg-opacity-25 backdrop-blur-sm p-8 rounded-3xl w-11/12 md:w-4/5 max-w-7xl flex flex-col items-center my-12">
            <h1 className="text-3xl font-bold mb-4 text-white">
          {showCart ? 'Guarding Green Roots 🍃' : 'Hope Grows With Every Click !'}
            </h1>

            <h5 className="text-2xl font-semibold mb-4 text-white">
          {showCart
            ? ''
            : 'Every purchase plants a seed of hope - support mangroves, sustain life'
          }
            </h5>

            <button 
          className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 mb-4 mt-5 flex items-center transform transition-transform duration-300 hover:scale-105"
          onClick={() => setShowCart(!showCart)}  // Toggle cart visibility
          >
            {showCart ? 'Go to Shop' : 'View Shopping Cart'}
            <ShoppingCart size={20} className="ml-2" />              
          </button>

          {/* Conditional Rendering */}
          {showCart ? (
            <CartList cartItems={cartItems} setCartItems={setCartItems} />  // Pass cart items and setCartItems
          ) : (
            // Grid for Items
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 w-full">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-full transform transition-transform duration-300 hover:scale-105 relative"
                >
                  <img 
                    src={item.image} 
                    alt={`Item ${item.id}`} 
                    className="w-full h-56 object-cover mb-1 rounded-md"
                  />
                  
                  <p className="text-gray-700 mb-4 mt-7 text-center text-lg">{item.description}</p>
                  <p className="text-green-700 font-bold mb-4 text-lg">{item.price}</p>

                  <button 
                    className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 ml-48"
                    onClick={() => addToCart(item)}  // Add item to cart
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
          )}
        </div>
      </div>
    </div>
  );
};

export default shop;
