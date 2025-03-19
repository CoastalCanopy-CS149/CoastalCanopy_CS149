import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./cartContext"
import ShopMain from "./ShopMain"
import CartList from "./CartList"
import Payment from "./Payment"


// This assumes your shop.jsx is handling sub-routes
const Shop = () => {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<ShopMain />} />
        <Route path="/cartList" element={<CartList />} />
        <Route path="/payment" element={<Payment />} />
        {/* Add other shop sub-routes as needed */}
      </Routes>
    </CartProvider>
  )
}

export default Shop