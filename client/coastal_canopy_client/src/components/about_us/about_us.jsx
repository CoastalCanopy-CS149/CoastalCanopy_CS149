import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination, Autoplay } from "swiper/modules"
import { Linkedin, Github } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"  


import DinayaImage from "/imgs/about_us/Dinaya_Guruge.jpg"
import MalshaImage from "/imgs/about_us/Malsha_Gamage.jpg"
import DilkiImage from "/imgs/about_us/Dilki_Attanayake.jpg"
import DevinImage from "/imgs/about_us/Devin.jpg"
import LawanyaImage from "/imgs/about_us/Lawanya_Malawige.jpg"
import background from "/imgs/about_us/background2.jpg"

const teamMembers = [
  {
    name: "Dilki Wathsala",
    bio: "A visionary leader driving the development of CoastalCanopy.lk, ensuring seamless collaboration and impactful outcomes.",
    imageUrl: DilkiImage,
    role: "Leader/ Backend Developer",
    linkedin: "https://www.linkedin.com/in/dilki-attanayake",
    github:"https://github.com/DilkiAttanayake",
  },
  {
    name: "Dinaya Guruge",
    bio: "A forward-thinking team member with expertise in project management and system integration.",
    imageUrl: DinayaImage,
    role: "ML Engineer",
    linkedin: "https://www.linkedin.com/in/dinaya-guruge",
    github:"https://github.com/Dinaya1",
  },
  {
    name: "Lawanya Malawige",
    bio: "A motivated team member with a passion for community engagement and environmental conservation.",
    imageUrl: LawanyaImage,
    role: "Frontend Developer",
    linkedin:
      "https://www.linkedin.com/in/lawanya-malavige?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github:"https://github.com/LawanyaMalavige",
  },
  {
    name: "Malsha Gamage",
    bio: "A dedicated and passionate computer science student with a focus on software development and sustainable technologies.",
    imageUrl: MalshaImage,
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/malsha-gamage-633074293/",
    github:"https://github.com/MalshaPG",
  },
  {
    name: "Devin Nanayakkara",
    bio: "An aspiring computer science enthusiast with a keen interest in environmental sustainability.",
    imageUrl: DevinImage,
    role: "Frontend Developer",
    linkedin:
      "https://www.linkedin.com/in/devin-nanayakkara-2a134929b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github:"https://github.com/devinnanayakkara",
  },
]

const cwImages = ["/imgs/about_us/cw1_1.jpg", "/imgs/about_us/cw1_2.jpg"]

const coastalD = [
  "/imgs/about_us/coastalD_1.jpg",
  "/imgs/about_us/coastalD_2.jpg",
  "/imgs/about_us/coastalD_4.jpg",
  "/imgs/about_us/coastalD_5.jpg",
]

const diyatha = [
  "/imgs/about_us/diyatha1.jpg",
  "/imgs/about_us/diyatha2.jpg",
  "/imgs/about_us/diyatha3.jpg",
  "/imgs/about_us/diyatha4.jpg",
  "/imgs/about_us/diyatha5.jpg",
  "/imgs/about_us/diyatha6.jpg",
  "/imgs/about_us/diyatha7.jpg",
]

const hultprize = ["/imgs/about_us/hultprize1.jpg", "/imgs/about_us/hultprize2.jpg", "/imgs/about_us/hultprize3.png"]

const Carousel = ({ images }) => {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="w-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full aspect-video">
              <img
                src={src || "/placeholder.svg"}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-t-lg"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default function AboutUs() {
  return (
    <div
      className="bg-cover min-h-screen bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="z-20 relative">
        <Navbar />
      </div>

      <div className="flex justify-center items-center py-10 sm:py-5 m-5">
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen">
          {/* Team Members Section */}
          <section className="mb-12">
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Meet The Team
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-items-center">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300 text-center w-full max-w-sm"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={member.imageUrl || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 md:p-6 border-t-2">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                      {member.name}
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 mb-2">
                      {member.role}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 mb-3">
                      {member.bio}
                    </p>

                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="w-5 h-6 mx-3 text-blue-600 hover:text-blue-800" />
                    </a>

                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Github className="w-5 h-6 mx-3 text-violet-600 hover:text-violet-800" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Journey Section */}
          <section>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Journey To The Success
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {/* Journey Card 1 */}
              <div className="border-2 rounded-lg w-full bg-white bg-opacity-10 shadow-lg flex flex-col">
                <div className="rounded-t-lg">
                  <Carousel images={coastalD} />
                </div>
                <div className="p-3 md:p-4 rounded-b-md bg-gray-50 flex-grow">
                  <p className="text-xs md:text-sm text-black font-serif">
                    Went to Coast Conservation and Coastal Resource Management
                    Department to get some geographical layers from them.
                    <br />
                    <span className="font-medium">Date: 2024-11-07</span>
                  </p>
                </div>
              </div>

              {/* Journey Card 2 */}
              <div className="border-2 rounded-lg w-full bg-white bg-opacity-10 shadow-lg flex flex-col">
                <div className="rounded-t-lg">
                  <Carousel images={cwImages} />
                </div>
                <div className="p-3 md:p-4 rounded-b-md bg-gray-50 flex-grow">
                  <p className="text-xs md:text-sm text-black font-serif">
                    Successfully submitted the project report and aced the viva
                    examination, demonstrating understanding and hard work.
                    <br />
                    <span className="font-medium">Date: 2024-12-20</span>
                  </p>
                </div>
              </div>

              {/* Journey Card 3 */}
              <div className="border-2 rounded-lg w-full bg-white bg-opacity-10 shadow-lg flex flex-col">
                <div className="rounded-t-lg">
                  <Carousel images={diyatha} />
                </div>
                <div className="p-3 md:p-4 rounded-b-md bg-gray-50 flex-grow">
                  <p className="text-xs md:text-sm text-black font-serif">
                    Visited Diyatha Park to collect detailed images, data, and
                    valuable information about mangroves for the project.
                    <br />
                    <span className="font-medium">Date: 2025-02-11</span>
                  </p>
                </div>
              </div>

              {/* Journey Card 4 */}
              <div className="border-2 rounded-lg w-full bg-white bg-opacity-10 shadow-lg flex flex-col">
                <div className="rounded-t-lg">
                  <Carousel images={hultprize} />
                </div>
                <div className="p-3 md:p-4 rounded-b-md bg-gray-50 flex-grow">
                  <p className="text-xs md:text-sm text-black font-serif">
                    Competed in the IIT Hult Prize Qualifier Round and received
                    valuable feedback from the judging panel.
                    <br />
                    <span className="font-medium">Date: 2025-02-22</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

