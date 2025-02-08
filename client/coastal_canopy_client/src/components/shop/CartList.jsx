import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Payment from './Payment';  // Import Payment component

const cartList = ({ cartItems, setCartItems }) => {
  const [showPayment, setShowPayment] = useState(false); // Toggle payment form

  const saveToLocalStorage = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const removeItem = (id, index) => {
    const updatedCartItems = cartItems.filter((item, i) => !(item.id === id && i === index));
    setCartItems(updatedCartItems);
    saveToLocalStorage(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const totalAmount = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('Rs. ', '').replace(',', '').replace('.00', ''));
    return total + price;
  }, 0).toFixed(2);

  useEffect(() => {
    saveToLocalStorage(cartItems);
  }, [cartItems]);

  // If showPayment is true, display Payment.jsx instead of cart
  if (showPayment) {
    return <Payment cartItems={cartItems} totalAmount={totalAmount} />;
  }

  return (
    <div className="mt-8 w-full">
      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-white">Your cart is empty</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto"> {/* Increased max-width */}
          <div className="flex justify-end mb-4">
            <button className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600" onClick={clearCart}>
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center mb-5">
                  <img src={item.image} alt={item.description} className="w-12 h-12 object-cover mr-5 rounded-md" />
                  <div>
                    <h3 className="text-md text-black">{item.description}</h3>
                    <p className="text-green-700 font-bold">{item.price}</p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-600" onClick={() => removeItem(item.id, index)}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <hr className="my-4 border-gray-800" />

          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-lg text-black">
              Total Amount: <span className="font-bold text-red-700">Rs. {totalAmount}</span>
            </h3>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-semibold"
              onClick={() => setShowPayment(true)} // Switch to payment form
            >
              BUY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default cartList;
