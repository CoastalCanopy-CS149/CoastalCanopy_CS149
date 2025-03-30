import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Aim from "./components/aim/aim";
import AboutUs from "./components/about_us/about_us";
import AR from "./components/AR/AR";
import Reporting from "./components/community_reporting/community_reporting";
import Education from "./components/education/education";
import Gamification from "./components/gamification/gamification";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Mapping from "./components/mapping/mapping";
import Monitoring from "./components/monitoring/monitoring";
import Shop from "./components/shop/shop";
import SignUp from "./components/sign_up/sign_up";
import SocialMedia from "./components/social_media/social_media";
import ProtectedRoute from "./helper/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aim" element={<Aim />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/monitoring/*" element={<Monitoring />} />
        <Route path="/ar" element={<AR />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signUp/*" element={<SignUp />} />
        <Route path="/mapping/*" element={<Mapping />} />
        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/socialMedia/*" element={<SocialMedia />} />
          <Route path="/shop/*" element={<Shop />} />
          <Route path="/gamification/*" element={<Gamification />} />
          <Route path="/education/*" element={<Education />} />
          <Route path="/reporting/*" element={<Reporting />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
