import React, { useState } from "react"; // Ensure to import useState
import { Route, Routes, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion for animations
import mangroveBackground from "/imgs/education/mangrove-forest.jpg";
import mangrovesrilanka from "/imgs/education/mangrovesrilanka.jpg";
import mangroveThumbnail from "/imgs/education/mangrove-thumbnail.jpg";
import { ArrowLeft } from "lucide-react";
import ReactPlayer from "react-player";

import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const EducationSection = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen "
      style={{
        backgroundImage: `url(${mangroveBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-20 relative">
        <Navbar />
      </div>
      <div className="flex justify-center items-start pt-12">
        <div
          className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <h1 className="text-center text-3xl text-white font-bold mt-8 ">
            Mangrove Conservation & Ecosystem Awareness
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6 lg:p-8 ">
            {/* Education Card 1 */}

            <div className="p-4 bg-white rounded-3xl flex flex-col justify-between shadow-md text-center">
              <h2 className="text-lg md:text-xl font-semibold">
                Education for Mangrove Conservation
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Educate on mangrove to protect coastlines, biodiversity, and
                climate. Mangroves protect coastlines from natural threats. They
                provide habitats, supporting diverse thriving ecosystems.{" "}
                <br></br>
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Mangroves act as natural barries, reducing the impact of storms,
                erosion and rising sea levels.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                They absorb significant amounts of carbon dioxide, helping
                combat climate change.<br></br>
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Additionally, mangroves support local communities by providing
                resources like fish, wood, and medicinal plants.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                In Sri Lanka, these ecosystems...
              </p>
              <button
                onClick={() => navigate("../education-content")}
                className="mt-4 md:mt-6 bg-green-500 text-white hover:bg-green-600 px-4 py-2 w-32 mx-auto rounded-md transition"
              >
                Learn More
              </button>
            </div>

            {/* Education Card 2 */}
            <div className="p-4 bg-white rounded-3xl shadow-md  text-center">
              <h2 className="text-lg md:text-xl font-semibold">
                EcoUpdates: Latest News on Mangrove Conservation
              </h2>
              <img
                src={mangrovesrilanka}
                alt="Mangrove"
                className="rounded-lg mx-auto w-full h-auto mb-4"
              />
              <p className="text-gray-600 md:text-sm text-xs text-left">
                16 February 2024.
              </p>
              <button
                onClick={() => navigate("../education-news")}
                className="mt-8 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                See More
              </button>
            </div>

            {/* Video Card */}
            <div className="p-4 bg-white rounded-3xl shadow-md  text-center">
              <h2 className="text-lg font-semibold ">
                The Crucial Role of Mangroves in Conservation
              </h2>
              <img
                src={mangroveThumbnail}
                alt="Mangrove"
                className="rounded-lg mx-auto mb-4"
              />
              <p className="text-gray-600">
                Watch this video to learn about the mangrove ecosystem.
              </p>
              <button
                onClick={() => navigate("../VideoCard")}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Play
              </button>
            </div>

            {/* Quiz Section */}

            <div className="col-span-1 md:col-span-2 text-center bg-green-50 p-4 rounded-3xl lg:col-span-3">
              <p className="text-lg font-medium">
                Do you want to Play Quiz and earn points?
              </p>
              <p className=" text-lg font-medium md:text-xl">
                🚀<span>Join Now</span>
              </p>
              <button
                onClick={() => navigate("../education-quiz")}
                className="mt-8 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
              >
                Click Here
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const EducationContent = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage: `url(${mangroveBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "5vh",
      }}
    >
      <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 text-white ">
        <h3
          className="font-semibold text-center text-white text-3xl mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Education for Mangrove Conservation
        </h3>
        <div className="flex justify-center items-center">
          <p className="max-w-3xl text-center font-semibold text-lg mb-10 ">
            Sri Lanka is home to more than twenty species of true mangroves,
            around one third of all mangrove species in the world. They thrive
            along lagoons and estuaries and currently cover around 19,500
            hectares of the island according to the Forest Department.
            <br />
            The Country has pledged to restore an additional 10,000 hectares by
            2030 with three strategies: protecting existing mangroves,
            converting abandoned shrimp farms and salterns, and restoring
            degraded mangroves. Mangrove forests are immensely productive
            coastal ecosystems, thriving at the border between land and sea and
            serving as an important bridge between marine and terrestrial
            biodiversity.
            <br />
            Mangroves sequester and store huge amounts of "blue carbon". They
            produce nutrients, anchor shorelines, serve as sheltered nurseries
            and habitats for countless species of fauna and flora. They protect
            coastal communities and provide many raw materials for construction,
            food, handicrafts, or medicine. As measured by UNEP, their annual
            ecosystem services are worth US$ 33-57,000 per ha. They are also
            sites of stunning natural beauty and cultural significance that can
            promote the well-being of local communities, strengthen resilience
            and climate change adaptation, and provide sustainable livelihoods.
          </p>
        </div>

        <div className="flex justify-center">
          <div
            onClick={() => navigate("/education")}
            className="mt-[-25px] bg-green-500 hover:bg-green-600 text-2xl text-white px-16 py-2 text-center rounded-3xl w-fit cursor-pointer"
          >
            Back
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationNews = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage: `url(${mangroveBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "5vh",
      }}
    >
      <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 text-white">
        <h3
          className="font-semibold text-center text-white text-3xl mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Sri Lanka gets global recognition by UN for rebuilding mangrove
          ecosystems
        </h3>
        <img
          src={mangrovesrilanka}
          alt="Mangrove"
          className="rounded-lg mx-auto mb-4 w-1/3"
        />
        <p className="font-semibold text-lg text-center font-mono mb-10">
          "2024 marks a landmark achievement in the world of conservation with
          Sri Lanka being declared as a UN World Restoration Flagship, in
          recognition of the nation’s vital efforts <br></br>to rebuild and
          restore its mangrove ecosystems."
        </p>
        <p className="max-3xl text-lg text-left text-gray-100 mb-10">
          Wednesday, 16 February 2024
        </p>
        <div className="flex justify-center">
          <div
            onClick={() => navigate("/education")}
            className="mt-[-18px] bg-green-500 hover:bg-green-600 text-2xl text-white px-16 py-2 text-center rounded-3xl w-fit cursor-pointer"
          >
            Back
          </div>
        </div>
      </div>
    </div>
  );
};





const VideoCard = () => {
  const videoFile = "/imgs/education/5079225-uhd_3840_2160_24fps.mp4";
  const navigate = useNavigate();

return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50 ">
      
    <button
        onClick={() => navigate(-1)}
        className="absolute  top-4 right-4 text-white text-3xl font-bold hover:text-red-500"
      >
      &times;
      </button>

      <div className="w-full max-w-4xl aspect-video">
        <ReactPlayer
          url={videoFile}
          playing={true}
          controls={true}
          width="100%"
          height="100%"
            />
          </div>
        </div>
    
   
  );
};

const EducationQuiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({ q1: "", q2: "" , q3: "", q4: "", q5: "", q6: "", q7: "", q8: "", q9: "", q10: "" });
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const correctAnswers = {
    q1: "Rhizopora",
    q2: "By absorbing carbon dioxide",
    q3: "Protecting coastlines from erosion and storm surges",
    q4:"Prop roots that rise above the water",
    q5:"Coastal intertidal zones",
    q6:"They provide shelter and breeding grounds for various marine species",
    q7:"Deforestation and land reclamation",
    q8:"Indonesia",
    q9:"By absorbing and storing large amounts of carbon dioxide",
    q10:"Filtering pollutants from water",
  };

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!answers.q1 || !answers.q2 || !answers.q3 || !answers.q4  || !answers.q5 || !answers.q6 || !answers.q7 || !answers.q8 || !answers.q9 || !answers.q10) {
      setModalMessage("Please answer all questions before submitting.");
      setShowModal(true);
      return;
    }

    let totalScore = 0;
    if (answers.q1 === correctAnswers.q1) totalScore += 10;
    if (answers.q2 === correctAnswers.q2) totalScore += 10;
    if (answers.q3 === correctAnswers.q3) totalScore += 10;
    if (answers.q4 === correctAnswers.q4) totalScore += 10;
    if (answers.q5 === correctAnswers.q5) totalScore += 10;
    if (answers.q6 === correctAnswers.q6) totalScore += 10;
    if (answers.q7 === correctAnswers.q7) totalScore += 10;
    if (answers.q8 === correctAnswers.q8) totalScore += 10;
    if (answers.q9 === correctAnswers.q9) totalScore += 10;
    if (answers.q10 === correctAnswers.q10) totalScore += 10;

    if (totalScore === 0) {
      setModalMessage("❌ Oops! You answered all questions wrong. Please try again.");
    } else {
      setModalMessage(`🎉 Congratulations! 🎊 You've successfully completed the quiz and earned ${totalScore} points!`);
    }

    setScore(`You earned ${totalScore} points!`);
    setShowModal(true);
  

  // Send the quiz data to Flask backend
 const quizData ={
       name: "User's Name",  // Replace with the actual user's name if nedded
       answers: answers,
       score: totalScore,
 };
  
 try{
     const response = await fetch('http://localhost:5000/submit-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
     });
     const result = await response.json();
     console.log(result.message);  // Log success message from Flask
 } catch(error){
    console.error('Error submitting quiz: ', error);
 }
};
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${mangroveBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "5vh",
        }}
      >
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 text-white">
          <h3
            className="font-semibold text-center text-white text-4xl mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quiz
          </h3>
          <div className="space-y-6  max-h-[400px] overflow-y-auto">
            {/* Question 1 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                1) Which of the following is a common species found in mangrove
                forests?
              </h2>
              <div className="space-y-2">
                {["Oak", "Rhizopora", "Pine", "Birch"].map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q1"
                      value={option}
                      checked={answers.q1 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                2) How do mangroves help in combating climate change?
              </h2>
              <div className="space-y-2">
                {[
                  "By absorbing carbon dioxide",
                  "By releasing carbon dioxide",
                  "By absorbing oxygen",
                  "By releasing oxygen",
                ].map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q2"
                      value={option}
                      checked={answers.q2 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                3) What are mangroves primarily known for?
              </h2>
              <div className="space-y-2">
                {[
                  "Producing hradwood for furniture",
                  "Providing habitats for deep-sea creatures",
                  "Protecting coastlines from erosion and storm surges",
                  "Creating deserts",
                ].map((option, index) => (

                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q3"
                      value={option}
                      checked={answers.q3 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 4 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                4) Which of the following is a common feature of mangrove trees?
              </h2>
              <div className="space-y-2">
                {[
                  "Needle-like leaves",
                  "Thick, waxy leaves to reduce water loss",
                  "Prop roots that rise above the water",
                  "Deep underground tap roots",
                ].map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q4"
                      value={option}
                      checked={answers.q4 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 5 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                5) Mangroves are typically found in which type of environment?
              </h2>
              <div className="space-y-2">
                {[
                  "Deserts",
                  "freshwater lakes",
                  "Coastal intertidal zones",
                  "High-altitude mountain regions",
                ].map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q5"
                      value={option}
                      checked={answers.q5 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 6 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                6) Why are mangroves important for marine biodiversity?
              </h2>
              <div className="space-y-2">
                {[
                  "They attract only a single type of fish",
                  "They provide shelter and breeding grounds for various marine species",
                  "They reduce the oxygen levels in the water",
                  "They block sunlight,limiting plant growth",
                ].map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q6"
                      value={option}
                      checked={answers.q6 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 7 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                7) What is the primary threat to mangrove forests?
              </h2>
              <div className="space-y-2">
                {[
                  "Rising sea levels",
                  "invasive desert plants",
                  "Deforestation and land reclamation",
                  "Overproduction of oxygen",
                ].map((option, index) => (

                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q7"
                      value={option}
                      checked={answers.q7 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 8 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                8) Which country has the largest area of mangrove forests in the
                world?
              </h2>
              <div className="space-y-2">
                {["Brazil", "India", "Indonesia", "Australia"].map(
                  (option, index) => (
                    <label key={index} className="block">
                      <input
                        type="radio"
                        name="q8"
                        value={option}
                        checked={answers.q8 === option}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Question 9 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                9) How do mangroves help combat climate change?
              </h2>
              <div className="space-y-2">
                {[
                  "By increasing ocean temparatures",
                  "By absorbing and storing large amounts of carbon dioxide",
                  "by reflecting sunlight back into the atmosphere",
                  "By producing methane gas",
                ].map((option, index) => (

                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q9"
                      value={option}
                      checked={answers.q9 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Question 10 */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                10) Which of the folowing is a significant ecologicl benefit of
                mangrove forests?
              </h2>
              <div className="space-y-2">
                {[
                  "Creation of desert environments",
                  "Filtering pollutatnts from water",
                  "Increasing soil erosion",
                  "reducing fish populations",
                ].map((option, index) => (

                  <label key={index} className="block">
                    <input
                      type="radio"
                      name="q10"
                      value={option}
                      checked={answers.q10 === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="relative mt-5">
              <div
                onClick={() => navigate("/education")}
                className="absolute left-0  text-2xl text-white px-16 py-2 text-center rounded-3xl w-fit flex items-center cursor-pointer"

              >
                <ArrowLeft size={54} className="-ml-14" />
              </div>
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white text-2xl px-16 py-2 rounded-3xl mt-1"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Messages */}
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-8 rounded-3xl text-center shadow-lg w-96 relative">
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                {modalMessage.includes("Congratulations")
                  ? "🎉 Success!"
                  : "⚠️ Warning!"}
              </h2>
              <p className="text-lg text-gray-700">{modalMessage}</p>
            </motion.div>
            <button
              className="mt-6 bg-green-500 text-white px-6 py-2 rounded-2xl hover:bg-green-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

const Education = () => {
  return (
    <Routes>
      <Route path="/" element={<EducationSection />} />
      <Route path="/education-content" element={<EducationContent />} />
      <Route path="/education-news" element={<EducationNews />} />
      <Route path="/education-quiz" element={<EducationQuiz />} />
      <Route path="/VideoCard" element={<VideoCard />} />
    </Routes>
  );
};

export default Education;
