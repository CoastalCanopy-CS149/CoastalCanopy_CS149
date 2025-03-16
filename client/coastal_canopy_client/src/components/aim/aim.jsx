import React from 'react';
import background from "/imgs/aim/aim_background.jpg";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";


function aim_mission_vision() {
  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center "
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="relative z-10 w-full">
        <Navbar />
      </div>
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        {/* Backdrop div with glass effect */}
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 text-center space-y-20 text-white ">
          <ContentSection
            title="OUR AIM"
            description="Create a comprehensive, community-oriented web application, CoastalCanopy.lk, dedicated to the monitoring, protection, and sustainable management of mangrove ecosystems in Sri Lanka."
          />

          <ContentSection
            title="OUR MISSION"
            description="To educate communities and promote sustainable practices that protect and restore mangrove ecosystems."
          />

          <ContentSection
            title="OUR VISION"
            description="A Sri Lanka where mangrove forests thrive, safeguarding biodiversity, livelihoods, and the planet."
          />
        </div>
      </div>
      <div className="relative z-10 ">
        {" "}
        <Footer />{" "}
      </div>
    </div>
  );
}

function ContentSection({ title, description }) {
  return (
    <div className="space-y-6">
      <h2 className="text-5xl font-bold tracking-wide">{title}</h2>
      <p className="text-xl leading-relaxed max-w-2xl mx-auto">{description}</p>
    </div>
  );
}

export default aim_mission_vision;
