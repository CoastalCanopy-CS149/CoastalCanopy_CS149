import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutUs from "./components/about_us/about_us";
import AR from "./components/AR/AR";
import Reporting from "./components/community_reporting/community_reporting";
import Education from "./components/education/education";
import Footer from "./components/footer/footer";
import Gamification from "./components/gamification/gamification";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Mapping from "./components/mapping/mapping";
import Monitoring from "./components/monitoring/monitoring";
import Navbar from "./components/navbar/navbar";
import Shop from "./components/shop/shop";
import SignUp from "./components/sign_up/sign_up";
import SocialMedia from "./components/social_media/social_media";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/education" element={<Education />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/ar" element={<AR />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/socialMedia" element={<SocialMedia />} />
            <Route path="/mapping" element={<Mapping />} />  
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
