import { MapContainer, TileLayer, Rectangle, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const mangroveLocations = [
  { id: 1, name: "Kochchikade Mangroves", bounds: [[7.205, 79.985], [7.21, 79.99]], labelPos: [7.2075, 79.9875] },
  { id: 2, name: "Negombo Lagoon Mangroves", bounds: [[7.185, 79.870], [7.19, 79.875]], labelPos: [7.1875, 79.8725] },
  { id: 3, name: "Peliyagoda Mangroves", bounds: [[7.195, 79.875], [7.20, 79.88]], labelPos: [7.1975, 79.8775] },
  { id: 4, name: "Thimbiri Uyana Mangroves", bounds: [[7.165, 79.840], [7.17, 79.845]], labelPos: [7.1675, 79.8425] },
  { id: 5, name: "Pamunugama Mangroves", bounds: [[7.215, 79.890], [7.22, 79.895]], labelPos: [7.2175, 79.8925] },
  { id: 6, name: "Wattala Mangroves", bounds: [[7.175, 79.950], [7.18, 79.955]], labelPos: [7.1775, 79.9525] },
  { id: 7, name: "Muthurajawela Mangroves", bounds: [[7.075, 79.975], [7.08, 79.98]], labelPos: [7.0775, 79.9775] },
  { id: 8, name: "Bopitiya Mangroves", bounds: [[7.155, 79.945], [7.16, 79.95]], labelPos: [7.1575, 79.9475] },
  { id: 9, name: "Seeduwa Mangroves", bounds: [[7.105, 79.925], [7.11, 79.93]], labelPos: [7.1075, 79.9275] },
  { id: 10, name: "Katunayake Mangroves", bounds: [[7.130, 79.980], [7.135, 79.985]], labelPos: [7.1325, 79.9825] }
];

function Mapping() {
return (
    <main
        className="relative flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/imgs/mapping/background.jpg')" }}
    >
        {/* Centered Blur Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl h-4/5 bg-white/20 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-4">
                <h1 
                className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
                >
                Negombo Lagoon Mangrove Ecosystems
                </h1>
                
                {/* Map Component */}
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white p-4">

                <MapContainer 
                    center={[7.18, 79.84]} 
                    zoom={14} 
                    minZoom={7} // Prevents zooming out too far
                    className="w-full h-full rounded-2xl"
                    maxBounds={[[5.85, 79.65], [9.85, 81.9]]} // Restricts view to Sri Lanka
                    maxBoundsViscosity={1.0} // Ensures strict bounds adherence
                >

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mangroveLocations.map((location) => (
                        <>
                            <Rectangle 
                                key={location.id} 
                                bounds={location.bounds} 
                                color="green" 
                                fillColor="green" 
                                fillOpacity={0.6}
                            >
                                <Popup>{location.name}</Popup>
                            </Rectangle>
                            <Marker position={location.labelPos}>
                                <Popup>{location.name}</Popup>
                            </Marker>
                        </>
                    ))}
                </MapContainer>
            </div>
        </div>
    </main>
);
}

export default Mapping;
