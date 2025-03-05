import {Routes, Route} from 'react-router-dom';
import ShopMain from './ShopMain';
import CartList from './CartList';
import Payment from './Payment';
import ThankYou from './thankyou';

export default function Shop() {

  return (
    <Routes>

      <Route index element={<ShopMain />} />
      <Route path="/CartList" element={<CartList />} />
      <Route path="/Payment" element={<Payment />} />
      <Route path="/thankyou" element={<ThankYou />} />
    </Routes>
  );
}