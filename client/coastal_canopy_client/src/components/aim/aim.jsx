import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import background from "/imgs/aim/aim_background.jpg";
import laptopImage from "/imgs/aim/laptop.png";
import mobileImage from "/imgs/aim/phone.png";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import {
  MapIcon,
  BarChartIcon as ChartBarIcon,
  FlagIcon,
  TrophyIcon,
  BookOpenIcon,
  UsersIcon,
} from "lucide-react";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

function AnimatedSection({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: "Interactive Map",
      description:
        "Explore mangrove ecosystems across Sri Lanka with our detailed interactive map.",
      icon: <MapIcon className="w-10 h-10" />,
    },
    {
      title: "Monitoring",
      description:
        "Track the health and growth of mangrove forests with real-time monitoring tools.",
      icon: <ChartBarIcon className="w-10 h-10" />,
    },
    {
      title: "Reporting",
      description:
        "Report issues and contribute to mangrove conservation efforts.",
      icon: <FlagIcon className="w-10 h-10" />,
    },
    {
      title: "Gamification",
      description:
        "Earn rewards and track your impact through our gamified conservation activities.",
      icon: <TrophyIcon className="w-10 h-10" />,
    },
    {
      title: "Education",
      description:
        "Learn about mangrove ecosystems and their importance to our environment.",
      icon: <BookOpenIcon className="w-10 h-10" />,
    },
    {
      title: "Social Hub",
      description:
        "Connect with other conservationists and share your experiences.",
      icon: <UsersIcon className="w-10 h-10" />,
    },
  ];

  const faqs = [
    {
      question: "What is CoastalCanopy?",
      answer:
        "CoastalCanopy is a comprehensive web application dedicated to the monitoring, protection, and sustainable management of mangrove ecosystems in Sri Lanka.",
    },
    {
      question: "How can I contribute to mangrove conservation?",
      answer:
        "You can contribute by reporting issues, participating in conservation activities, donating to our cause, and spreading awareness about the importance of mangroves.",
    },
    {
      question: "Are mangroves important?",
      answer:
        "Yes, mangroves are crucial ecosystems that protect coastlines, provide habitats for marine life, sequester carbon, and support local livelihoods.",
    },
    {
      question: "How does the monitoring system work?",
      answer:
        "Our monitoring system uses a combination of satellite imagery, user reports, and field data to track the health and coverage of mangrove forests across Sri Lanka.",
    },
    {
      question: "Can I use CoastalCanopy on my mobile device?",
      answer:
        "Yes, CoastalCanopy is fully responsive and can be accessed on desktops, tablets, and mobile phones.",
    },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ submitted: false, message: "Please fill in all fields" });
      return;
    }

    // In a real implementation, you would send this data to your server
    // For now, we'll simulate a successful submission

    // Create a mailto link with the form data
    const subject = `Feedback from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage: ${formData.message}`;
    const mailtoLink = `mailto:coastalcanopy.lk@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open the user's email client
    window.open(mailtoLink, "_blank");

    // Update form status
    setFormStatus({
      submitted: true,
      message:
        "Thank you for your feedback! Your email client has been opened with your message.",
    });

    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="relative z-10 w-full">
        <Navbar />
      </div>

      {/* Main Content Container with consistent blur background */}
      <div className="w-11/12 max-w-6xl mx-auto my-12 bg-white/20 rounded-3xl text-white backdrop-blur-md p-8 md:p-12 relative z-10">
        {/* Donate Button at the top */}
        <AnimatedSection className="mb-20">
          <div className="flex justify-center">
            <motion.button
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-full text-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -10, 0],
                boxShadow: [
                  "0px 5px 15px rgba(0, 0, 0, 0.1)",
                  "0px 15px 25px rgba(0, 0, 0, 0.2)",
                  "0px 5px 15px rgba(0, 0, 0, 0.1)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              Donate Now
            </motion.button>
          </div>
        </AnimatedSection>

        {/* About Coastal Canopy Section */}
        <AnimatedSection className="mb-24">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About Coastal Canopy
          </h2>

          <div className="flex flex-col gap-8 justify-center items-center">
            {/* Device Images Container */}
            <div className="w-full max-w-7xl flex justify-center items-center">
              <div className="relative w-full h-96 md:h-[450px] flex justify-center">
                {/* Laptop Image - Centered */}
                <div className="absolute left-1/2 transform -translate-x-1/2 max-w-xs sm:max-w-md ">
                  <img
                    src={laptopImage || "/imgs/aim/laptop.jpg"}
                    alt="CoastalCanopy on Desktop"
                    className="rounded-lg object-contain h-96 md:h-96"
                  />
                </div>

                {/* Phone Image - Bottom Right of Laptop */}
                <div className="absolute left-1/2 transform translate-x-16 md:translate-x-24 top-32 md:top-40 ">
                  <img
                    src={mobileImage || "/imgs/aim/phone.png"}
                    alt="CoastalCanopy on Mobile"
                    className="rounded-lg object-contain h-48 md:h-64 hidden md:block "
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xl text-center">
            CoastalCanopy.lk is a community-driven platform dedicated to
            preserving Sri Lanka's vital mangrove ecosystems through technology,
            education, and collective action. We empower local communities to
            become guardians of Sri Lanka's precious mangrove forests, ensuring
            these vital ecosystems thrive for generations to come.
          </p>
        </AnimatedSection>

        {/* Aim, Mission, Vision Section */}
        <AnimatedSection className="mb-24">
          <div
            className="space-y-14 text-4xl md:text-4xl"
          >
            <ContentSection
              title="Our Aim"
              description="Create a comprehensive, community-oriented web application, CoastalCanopy.lk, dedicated to the monitoring, protection, and sustainable management of mangrove ecosystems in Sri Lanka."
            />

            <ContentSection
              title="Our Mission"
              description="To educate communities and promote sustainable practices that protect and restore mangrove ecosystems."
            />

            <ContentSection
              title="Our Vision"
              description="A Sri Lanka where mangrove forests thrive, safeguarding biodiversity, livelihoods, and the planet."
            />
          </div>
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection className="mb-36">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg"
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                // transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection className="mb-36">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <button
                  className="w-full p-4 text-left font-semibold text-xl flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span className="text-2xl">
                    {activeFaq === index ? "−" : "+"}
                  </span>
                </button>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 pt-0 text-lg"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Feedback Section */}
        <AnimatedSection>
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Share Your Feedback
          </h2>

          {formStatus.submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto p-6 bg-green-600/20 rounded-lg text-center"
            >
              <p className="text-xl mb-4">{formStatus.message}</p>
              <button
                onClick={() => setFormStatus({ submitted: false, message: "" })}
                className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form className="max-w-2xl mx-auto" onSubmit={handleFormSubmit}>
              {formStatus.message && (
                <div className="mb-4 p-3 bg-red-500/20 rounded-lg text-center">
                  {formStatus.message}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-lg">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/80"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-lg">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/80"
                  placeholder="Your email"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-lg">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/80"
                  placeholder="Your feedback"
                ></textarea>
              </div>

              <div className="text-center">
                <motion.button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-full text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit Feedback
                </motion.button>
              </div>
            </form>
          )}
        </AnimatedSection>
      </div>

      <div className="relative z-10 mt-12">
        <Footer />
      </div>
    </div>
  );
}

function ContentSection({ title, description }) {
  return (
    <div className="space-y-6">
      <h2
        className="text-3xl md:text-4xl font-bold tracking-wide text-center"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      <p className="text-xl leading-relaxed max-w-2xl mx-auto text-center">
        {description}
      </p>
    </div>
  );
}

export default LandingPage;