import React, { useState } from "react"; // Ensure to import useState
import { Route, Routes, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion for animations
const mangroveBackground = "/imgs/education/mangrove-forest.jpg";
const mangrovesrilanka = "/imgs/education/mangrovesrilanka.jpg";
const mangroveThumbnail = "/imgs/education/mangrove-thumbnail.jpg";

const EducationSection = () => {
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
      <div className="grid grid-cols-3 gap-6 p-10 bg-white bg-opacity-35 backdrop-blur-sm rounded-3xl w-11/12 max-w-7xl min-h-0">
        {/* Education Card 1 */}
        <div className="p-2 bg-white rounded-3xl max-w-2xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Education for Mangrove Conservation</h2>
          <p className="text-gray-600">
            Educate on mangrove to protect coastlines, biodiversity, and climate.
            Mangroves protect coastlines from natural threats. They provide
            habitats, supporting diverse thriving ecosystems.
          </p>
          <p className="text-gray-600">
            Additionally, mangroves absorb and store significant amounts of
            carbon, helping to mitigate climate change.
          </p>
          <p className="text-gray-600">
            They also filter pollutants from coastal waters and support local
            communities through sustainable fishing and eco-tourism
            opportunities.
          </p>
          <p className="text-gray-600">In Sri Lanka, these ecosystems...</p>
          <button
            onClick={() => navigate("/education-content")}
            className="mt-16 bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Learn More
          </button>
        </div>

        {/* Education Card 2 */}
        <div className="p-2 bg-white rounded-3xl shadow-md max-w-2xl text-center">
          <h2 className="text-lg font-semibold">
            EcoUpdates: Latest News on Mangrove Conservation
          </h2>
          <img
            src={mangrovesrilanka}
            alt="Mangrove"
            className="rounded-lg mx-auto mb-4"
          />
          <p className="text-gray-600 text-xs text-left">16 February 2024.</p>
          <button
            onClick={() => navigate("/education-news")}
            className="mt-7 bg-green-500 text-white px-4 py-2 rounded-md"
          >
            See More
          </button>
        </div>

        {/* Video Card */}
        <div className="p-2 bg-white rounded-3xl shadow-md max-w-2xl text-center">
          <h2 className="text-lg font-semibold">
            The Crucial Role of Mangroves in Conservation
          </h2>
          <img
            src={mangroveThumbnail}
            alt="Mangrove"
            className="rounded-lg mx-auto mb-4"
          />
          <p className="text-gray-600">Watch this video to learn about the mangrove ecosystem.</p>
          <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">
            Play
          </button>
        </div>

        {/* Quiz Section */}
        <div className="flex justify-center">
        <div className="mt-8 text-center bg-green-50 p-2 rounded-3xl max-w-2xl w-[90%]">
          <p className="text-lg font-medium">
            Do you want to Play Quiz and earn points?
          </p>
          <button
            onClick={() => navigate("/education-quiz")}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md"
          >
            Click Here
          </button>
        </div>
       </div>
      </div>
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
      <div className="p-8 bg-white bg-opacity-45 rounded-3xl shadow-md mt-14 min-h-0">
        <h3 className="font-semibold text-center text-white text-4xl mb-5">
          Education for Mangrove Conservation
        </h3>
        <p className="max-w-3xl text-center font-semibold text-lg mb-10">
        Sri Lanka is home to more than twenty species of true mangroves, around one third of all mangrove species in the world. They thrive along lagoons and estuaries and currently cover around 19,500 hectares of the island according to the Forest Department.
            <br />
            The Country has pledged to restore an additional 10,000 hectares by 2030 with three strategies: protecting existing mangroves, converting abandoned shrimp farms and salterns, and restoring degraded mangroves. Mangrove forests are immensely productive coastal ecosystems, thriving at the border between land and sea and serving as an important bridge between marine and terrestrial biodiversity.
            <br />
            Mangroves sequester and store huge amounts of "blue carbon". They produce nutrients, anchor shorelines, serve as sheltered nurseries and habitats for countless species of fauna and flora. They protect coastal communities and provide many raw materials for construction, food, handicrafts, or medicine. As measured by UNEP, their annual ecosystem services are worth US$ 33-57,000 per ha. They are also sites of stunning natural beauty and cultural significance that can promote the well-being of local communities, strengthen resilience and climate change adaptation, and provide sustainable livelihoods.

        </p>

        <div className="flex justify-center">
          <div
            onClick={() => navigate("/")}
            className="mt-[-25px] bg-green-500 text-2xl text-white px-16 py-2 text-center rounded-3xl w-fit cursor-pointer"
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
      <div className="p-8 bg-white bg-opacity-35 rounded-3xl backdrop-blur-sm w-11/12 max-w-5xl shadow-md mt-14">
        <h3 className="font-semibold text-center text-white text-4xl mb-5">
          Sri Lanka gets global recognition by UN for rebuilding mangrove ecosystems
        </h3>
        <img
          src={mangrovesrilanka}
          alt="Mangrove"
          className="rounded-lg mx-auto mb-4 w-1/3"
        />
        <p className="font-semibold text-lg text-center font-mono mb-10">
        "2024 marks a landmark achievement in the world of conservation with Sri Lanka being declared as a UN World Restoration Flagship, in recognition of the nation’s vital efforts <br></br>to rebuild and restore its mangrove ecosystems."
        </p>
        <p className="max-3xl text-lg text-left text-gray-100 mb-10">
          Wednesday, 16 February 2024
        </p>
        <div className="flex justify-center">
          <div
            onClick={() => navigate("/")}
            className="mt-[-18px] bg-green-500 text-2xl text-white px-16 py-2 text-center rounded-3xl w-fit cursor-pointer"
          >
            Back
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationQuiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({ q1: "", q2: "" });
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const correctAnswers = {
    q1: "Rhizopora",
    q2: "By absorbing carbon dioxide",
  };

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!answers.q1 || !answers.q2) {
      setModalMessage("Please answer all questions before submitting.");
      setShowModal(true);
      return;
    }

    let totalScore = 0;
    if (answers.q1 === correctAnswers.q1) totalScore += 10;
    if (answers.q2 === correctAnswers.q2) totalScore += 10;

    if (totalScore === 0) {
      setModalMessage("❌ Oops! You answered both questions wrong. Please try again.");
    } else {
      setModalMessage(`🎉 Congratulations! 🎊 You've successfully completed the quiz and earned ${totalScore} points!`);
    }

    setScore(`You earned ${totalScore} points!`);
    setShowModal(true);
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
        <div className="p-8 bg-white bg-opacity-35 rounded-3xl backdrop-blur-sm w-11/12 max-w-5xl shadow-md mt-14">
          <h3 className="font-semibold text-center text-white text-4xl mb-5">Quiz</h3>
          <div className="space-y-6">
            {/* Question A */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                A) Which of the following is a common species found in mangrove forests?
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

            {/* Question B */}
            <div>
              <h2 className="font-semibold text-lg text-left mb-10">
                B) How do mangroves help in combating climate change?
              </h2>
              <div className="space-y-2">
                {["By absorbing carbon dioxide", "By releasing carbon dioxide", "By absorbing oxygen", "By releasing oxygen"].map((option, index) => (
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

            <div className="mt-5 text-center">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white text-2xl px-16 py-2 rounded-3xl"
              >
                Submit
              </button>
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
                      {modalMessage.includes("Congratulations") ? "🎉 Success!" : "⚠️ Warning!"}
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
    </Routes>
  );
};

export default Education;
