import React from 'react';
import background from "/imgs/aim/aim_background.jpg";

function aim_mission_vision() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style= {{ backgroundImage: `url(${background})` }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Backdrop div with glass effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl bg-white/20 rounded-3xl  mx-auto text-center space-y-20 text-white backdrop-blur-md p-12">
          
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
