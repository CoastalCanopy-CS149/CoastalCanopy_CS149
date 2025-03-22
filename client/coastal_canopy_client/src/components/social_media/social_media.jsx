import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import mangroveBackground from "/imgs/social_media/mangrove-forest.jpg";
import etherealglow from "/imgs/social_media/ethereal-glow.jpeg";
import cleanslate from "/imgs/social_media/clean-slate.jpg";
import coastalbliss from "/imgs/social_media/coastal-bliss.jpg";
import modernsimplicity from"/imgs/social_media/modern-simplicity.jpg";
import rainbowbloom from"/imgs/social_media/rainbow-bloom.jpg";
import environment from "/imgs/social_media/environment.jpg";
import brushstrokes from "/imgs/social_media/brush-strokes.jpg";
import nature from "/imgs/social_media/nature.jpg";
import { FaCloudUploadAlt, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const themes = [
    { title: "Sustainability and environment", theme: "Ethereal Glow", image: etherealglow },
    { title: "Coastal Bliss", theme: "Coastal Bliss", image: coastalbliss },
    { title: "World Environment Day", theme: "Clean Slate", image: cleanslate },
    { title: "Modern Simplicity", theme: "Modern Simplicity", image: modernsimplicity },
    { title: "Rainbow Bloom", theme: "Rainbow Bloom", image: rainbowbloom },
    { title: "Environmental Protection", theme: "Environment", image: environment },
    { title: "Brush strokes", theme: "Brush Strokes", image: brushstrokes },
    { title: "Nature", theme: "Fancy", image: nature },
];

export function CreatePost() {
    const navigate = useNavigate();
    const [selectedTheme, setSelectedTheme] = useState(null);

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
        navigate("/socialmedia/upload", { state: { theme } });
    };

    return (
        <div
            className="min-h-screen"
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
            <div className="bg-white bg-opacity-35 backdrop-blur-sm rounded-3xl p-6 sm:p-10  w-11/12 max-w-7xl shadow-xl -mt-6 mb-10">
                {!selectedTheme ? (
                    <>
                        <h2 className="text-center text-2xl sm:text-3xl font-bold text-white">Create Post</h2>
                        <p className="text-center text-lg text-white mb-6">Select a theme</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {themes.map((theme, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleThemeSelect(theme.theme)}
                                    className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                >
                                    <img src={theme.image} alt={theme.theme} className="w-full h-28 sm:h-32 md:h-40 object-cover rounded-lg" />
                                    <h3 className="text-center text-sm font-semibold mt-2">{theme.title}</h3>
                                </div>
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
            </div>
            <Footer/>
        </div>
    );
}

export function UploadSection() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedTheme = location.state?.theme || "Default";
    const themeData = themes.find((t) => t.theme === selectedTheme);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type.split("/")[0]; // Get file type (image, video, etc.)
            if (fileType !== "image") {
                setErrorMessage("Please upload a valid image file.");
                return;
            }
    
            // Check if the image name contains the theme keyword
            if (!file.name.toLowerCase().includes(selectedTheme.toLowerCase())) {
                setErrorMessage(`Please upload an image related to the theme: ${selectedTheme}`);
                return;
            }
    
            setErrorMessage("");
    
            // Read image and extract colors
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
    
                    const pixelData = ctx.getImageData(0, 0, img.width, img.height).data;
                    const avgColor = getAverageColor(pixelData);
    
                    // Extract theme image colors
                    const themeImg = new Image();
                    themeImg.src = themeData.image;
                    themeImg.onload = () => {
                        const themeCanvas = document.createElement("canvas");
                        const themeCtx = themeCanvas.getContext("2d");
                        themeCanvas.width = themeImg.width;
                        themeCanvas.height = themeImg.height;
                        themeCtx.drawImage(themeImg, 0, 0, themeImg.width, themeImg.height);
    
                        const themePixelData = themeCtx.getImageData(0, 0, themeImg.width, themeImg.height).data;
                        const themeAvgColor = getAverageColor(themePixelData);
    
                        // Compare colors (tolerance threshold of 50)
                        if (colorDistance(avgColor, themeAvgColor) > 50) {
                            setErrorMessage("Uploaded image does not match the theme color.");
                            return;
                        }
    
                        setUploadedImage(e.target.result);
                    };
                };
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Function to get the average color of an image
    const getAverageColor = (pixelData) => {
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < pixelData.length; i += 4) {
            r += pixelData[i];
            g += pixelData[i + 1];
            b += pixelData[i + 2];
            count++;
        }
        return [r / count, g / count, b / count]; // Return average RGB values
    };
    
    // Function to calculate color difference
    const colorDistance = (color1, color2) => {
        return Math.sqrt(
            Math.pow(color1[0] - color2[0], 2) +
            Math.pow(color1[1] - color2[1], 2) +
            Math.pow(color1[2] - color2[2], 2)
        );
    };
    

    return (
        <div
           className="min-h-screen"
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
                style={{
                    backgroundImage: themeData ? `url(${themeData.image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
               
                
                className="rounded-3xl p-6 sm:p-10 w-11/12 max-w-2xl shadow-xl mb-32sm:mb-48 md:mb-64 mt-64 sm:mt-48 md:mt-64"
            >
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                    Upload Image
                </h2>
                
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg hover:bg-gray-200 transition">
                    <FaCloudUploadAlt className="text-3xl sm:text-4xl text-gray-500 mb-6" />
                    <span className="text-white font-bold">Upload Image Here</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>

                {errorMessage && (
                    <p className="text-red-500 mt-2 text-center">{errorMessage}</p>
                )}

                {uploadedImage && (
                    <div className="relative mt-4 w-full max-w-md">
                        {/* Frame overlay */}
                        {themeData && (
                            <div
                                className="absolute inset-0 bg-contain bg-no-repeat bg-center pointer-events-none"
                                style={{
                                    backgroundImage: `url(${themeData.image})`,
                                    zIndex: 10, // Make sure frame is on top
                                }}
                            ></div>
                        )}
                        
                        {/* Uploaded Image */}
                        <img
                            src={uploadedImage}
                            alt="Uploaded Preview"
                            className="w-full h-auto rounded-lg border-4 border-white"
                        />
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:gap-6 w-full sm:w-auto">
                    <button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-800">
                        ← Go to theme  
                    </button>
                    <button onClick={() => navigate("/socialMedia/share")} className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-800">
                        Next →
                    </button>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
}



export function SocialMediaSection() {
    const navigate = useNavigate();
    

    const handleShare = (platform) => {
        const urls = {
            facebook: "https://www.facebook.com/sharer/sharer.php?u=https://coastalcanopy.lk",
            instagram: "https://www.instagram.com/",
            twitter: "https://twitter.com/intent/tweet?url=https://coastalcanopy.lk",
            whatsapp: "https://api.whatsapp.com/send?text=Check%20out%20this%20awesome%20post%20on%20CoastalCanopy.lk!%20https://coastalcanopy.lk"
        };

        const loginUrls = {
            facebook: "https://www.facebook.com/login",
            instagram: "https://www.instagram.com/accounts/login/",
            twitter: "https://twitter.com/login",
            whatsapp: "https://web.whatsapp.com/"
        };

        const isLoggedIn = checkUserLogin(platform); // Placeholder function to check login status
        if (isLoggedIn) {
            window.open(urls[platform], "_blank");
        } else {
            window.open(loginUrls[platform], "_blank");
        }
    };

    const checkUserLogin = (platform) => {
        
        return false;
    };

    return (
        <div
            style={{
                backgroundImage: `url(${mangroveBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="min-h-screen flex flex-col justify-center items-center  pt-6 px-4 sm:px-6 md:px-10 lg:px-16"
        >
            <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-3xl p-6 sm:p-8  w-full  max-w-3xl shadow-xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-4">Share on Social Media</h2>
                <div className="flex flex-col sm:flex-row md:flex-wrap lg:flex-nowrap lg:justify-center gap-4 md:gap-6">
                    <button onClick={() => handleShare("whatsapp")} className="w-full sm:w-auto lg:w-1/4 flex items-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg">
                        <FaWhatsapp /> WhatsApp
                    </button>
                    <button onClick={() => handleShare("instagram")} className="w-full sm:w-auto lg:w-1/4 flex items-center gap-2 bg-pink-500 text-white py-2 px-4 sm:px-6 rounded-lg">
                        <FaInstagram /> Instagram
                    </button>
                    <button onClick={() => handleShare("twitter")} className="w-full sm:w-auto lg:w-1/4 flex items-center gap-2 bg-black text-white py-2 px-4 sm:px-6 rounded-lg">
                        <FaTwitter /> Twitter
                    </button>
                    <button onClick={() => handleShare("facebook")} className="w-full sm:w-auto lg:w-1/4 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-lg">
                        <FaFacebook /> Facebook
                    </button>
                </div>
                <div className="text-center mt-6">
                <button onClick={() => navigate(-1)} className="mt-6 w-full sm:w-auto   bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-800">
                    ← Back
                </button>
                </div>
            </div>
        </div>
    );
}


const socialMedia = () => {
    return (
        <Routes>
            <Route path="/" element={<CreatePost />} />
            <Route path="/upload" element={<UploadSection />} />
            <Route path="/share" element={<SocialMediaSection />} />
        </Routes>
    );
};

export default socialMedia;
