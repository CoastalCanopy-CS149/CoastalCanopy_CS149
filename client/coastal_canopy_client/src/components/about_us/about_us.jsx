import DinayaImage from "/imgs/about_us/Dinaya_Guruge.jpg";
import MalshaImage from "/imgs/about_us/Malsha_Gamage.jpg";
import DilkiImage from "/imgs/about_us/Dilki_Attanayak.jpg";
import DevinImage from "/imgs/about_us/Devin_Nanayakkara.png";
import LawanyaImage from "/imgs/about_us/Lawanya_Malawige.png";
import background from "/imgs/about_us/bg3.jpg";

const teamMembers = [
  {
    name: "Dilki Wathsala(Leader)",
    bio: "A visionary leader driving the development of CoastalCanopy.lk, ensuring seamless collaboration and impactful outcomes.",
    imageUrl: DilkiImage,
  },
  {
    name: "Devin Nanayakkara",
    bio: "An aspiring computer science enthusiast with a keen interest in environmental sustainability.",
    imageUrl: DevinImage,
  },
  {
    name: "Dinaya Guruge",
    bio: "A forward-thinking team member with expertise in project management and system integration.",
    imageUrl: DinayaImage,
  },
  {
    name: "Lawanya Malawige",
    bio: "A motivated team member with a passion for community engagement and environmental conservation.",
    imageUrl: LawanyaImage,
  },
  {
    name: "Malsha Gamage",
    bio: "A dedicated and passionate computer science student with a focus on software development and sustainable technologies.",
    imageUrl: MalshaImage,
  },
];

const cwImages = [
    "/imgs/about_us/cw1_1.jpg",
    "/imgs/about_us/cw1_2.jpg",
]

const coastalD = [
    "/imgs/about_us/coastalD_1.jpg",
    "/imgs/about_us/coastalD_2.jpg",
    "/imgs/about_us/coastalD_3.jpg",
    "/imgs/about_us/coastalD_4.jpg",
    "/imgs/about_us/coastalD_5.jpg",
]

export default function AboutUs() {
  return (
    <div className="bg-cover min-h-screen flex justify-center items-center bg-fixed py-10"
      style={{ backgroundImage: `url(${background})` }}
    >
        <div className="bg-gray-50 bg-opacity-25 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto grid">
            <div className="max-w-7xl mx-auto grid grid-rows-1 ">
                <h1 className="text-4xl font-bold text-center text-wrap text-black mb-12">
                Meet The Team
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                    {teamMembers.map((member, index) => (
                        <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 text-center"
                        >
                        <img
                            src={member.imageUrl || "/placeholder.svg"}
                            alt={member.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-6 border-t-2">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {member.name}
                            </h2>
                            <p className="text-gray-600">{member.bio}</p>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-rows-1 mt-10">  
                <h1 className="text-4xl font-bold text-center text-black mb-12">Our Journey</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    <div className="border-2 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cwImages.map((image, index) => (
                                <img key={index} src={image} alt="CoastalD" className="w-full h-64 object-cover rounded-md"/>
                            ))}
                        </div>
                        <h1 className="text-xl font-semibold text-black p-4 rounded-b-md bg-gray-50">Finished Course Work I Successfully</h1>
                    </div>

                    <div className="border-2 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {coastalD.map((image, index) => (
                                <img key={index} src={image} alt="cw" className="w-full h-64 object-cover rounded-md"/>
                            ))}
                        </div>
                        <h1 className="text-xl font-semibold text-black p-4 rounded-b-md bg-gray-50">Went to Coast Conservation and Coastal Resourse Management Department, and Forest department to get some geographical layers from them.</h1>
                    </div>
                </div>  
            </div>
        </div>
    </div>
  );
};


