import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"  

import DinayaImage from "/imgs/about_us/Dinaya_Guruge.jpg"
import MalshaImage from "/imgs/about_us/Malsha_Gamage.jpg"
import DilkiImage from "/imgs/about_us/Dilki_Attanayak.jpg"
import DevinImage from "/imgs/about_us/Devin_Nanayakkara.png"
import LawanyaImage from "/imgs/about_us/Lawanya_Malawige.png"
import background from "/imgs/about_us/bg.jpg"

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
]

const cwImages = ["/imgs/about_us/cw1_1.jpg", "/imgs/about_us/cw1_2.jpg"]

const coastalD = [
  "/imgs/about_us/coastalD_1.jpg",
  "/imgs/about_us/coastalD_2.jpg",
  "/imgs/about_us/coastalD_3.jpg",
  "/imgs/about_us/coastalD_4.jpg",
  "/imgs/about_us/coastalD_5.jpg",
]

const Carousel = ({ images }) => {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="w-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={src || "/placeholder.svg"}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-t-lg"
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
      className="bg-cover min-h-screen  bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="z-20 relative">
        <Navbar />
      </div>

      <div className="flex justify-center items-center  py-10">
        <div className="bg-gray-50 bg-opacity-25 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto grid">
          <div className="max-w-7xl mx-auto grid grid-rows-1">
              <h1 className="text-4xl font-bold text-center text-wrap text-black mb-12">
                  Meet The Team
              </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 text-center w-full"
                >
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 border-t-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h2>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-rows-1 mt-10">
            <h1 className="text-4xl font-bold text-center text-black mb-12">Journey To The Success</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

            <div className="border-2 rounded-lg w-full">
                <Carousel images={coastalD}  className=""/>
                <h1 className="text-xl font-semibold text-black p-4 rounded-b-md bg-gray-50">
                  Went to Coast Conservation and Coastal Resource Management Department, and Forest department to get some
                  geographical layers from them.<br />
                  Date : 2024-11-07
                </h1>
              </div>

              <div className="border-2 rounded-lg w-full">
                  <Carousel images={cwImages} />
                  <h1 className="text-xl font-semibold text-black p-4 rounded-b-md bg-gray-50">
                      Finished Coursework I submiting the project report and facing the viva exam Successfully.<br/>
                      Date : 2024-12-20
                  </h1>
              </div>

              <div className="border-2 rounded-lg w-full">
                <Carousel images={coastalD}  className=""/>
                <h1 className="text-xl font-semibold text-black p-4 rounded-b-md bg-gray-50">
                  Went to Forest Department to collect a dataset(mangrove distribution map in srilanka) from them then went to "Sobadam piyasa NGO" to get an evaluation from them on our project.<br />
                  Date : 2025-02-11
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

