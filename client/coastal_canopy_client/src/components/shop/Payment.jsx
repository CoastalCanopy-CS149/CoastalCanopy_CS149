import React, { useState } from 'react';
import ThankYou from './thankyou';

const Payment = ({ cartItems, totalAmount }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    contactNo: '',
    paymentMethod: 'credit_card',
    cardHolderName: '',
    cardNumber: '',
    cardExpiration: '',
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
  };

  if (paymentSuccess) {
    return <ThankYou />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl"> {/* Increased max-width */}
        <h2 className="text-2xl font-bold mb-4 text-green-700 text-center mb-10">Payment Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4"> {/* Flex layout for two fields in one row */}
            <div className="w-1/2">
              <label className="block text-gray-700">Full Name</label>
              <input type="text" name="fullName" className="w-full p-2 border rounded" required onChange={handleChange} />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700">Email</label>
              <input type="email" name="email" className="w-full p-2 border rounded" required onChange={handleChange} />
            </div>
          </div>

          <div className="flex space-x-4"> {/* Flex layout for two fields in one row */}
            <div className="w-1/2">
              <label className="block text-gray-700">Address</label>
              <input type="text" name="address" className="w-full p-2 border rounded" required onChange={handleChange} />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700">Contact No</label>
              <input type="text" name="contactNo" className="w-full p-2 border rounded" required onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 ">Total No. of Items</label>
            <input type="text" value={cartItems.length} className="w-full p-2 border rounded bg-gray-200" readOnly />
          </div>

          <div>
            <label className="block text-gray-700">Item List</label>
            <div className="w-full p-2 border rounded bg-gray-200">
              <ul className="list-disc ml-5">
                {cartItems.map((item, index) => (
                  <li key={index}>{item.description} - {item.price}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Total Amount</label>
            <input type="text" value={`Rs. ${totalAmount}`} className="w-full p-2 border rounded bg-gray-200" readOnly />
          </div>

          <div>
            <label className="block text-gray-700">Payment Method</label>
            <select name="paymentMethod" className="w-full p-2 border rounded" onChange={handleChange}>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {formData.paymentMethod !== 'paypal' && (
            <>
              <div className="flex space-x-4"> {/* Flex layout for two fields in one row */}
                <div className="w-1/2">
                  <label className="block text-gray-700">Card Holder's Name</label>
                  <input type="text" name="cardHolderName" className="w-full p-2 border rounded" required onChange={handleChange} />
                </div>

                <div className="w-1/2">
                  <label className="block text-gray-700">Card Number</label>
                  <input type="text" name="cardNumber" className="w-full p-2 border rounded" required onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Card Expiry Date</label>
                <input type="month" name="cardDate" className="w-full p-2 border rounded" required onChange={handleChange} />
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-green-500 text-white text-lg p-3 rounded-md hover:bg-green-600 mb-4 mt-5 transform transition-transform duration-300">
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;