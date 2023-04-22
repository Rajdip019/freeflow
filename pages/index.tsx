import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import Navbar from "@/components/LandingPage/Navbar";
import Version from "@/components/LandingPage/Version";
import React from "react";

const Home = () => {
  return (
    <div className="bg-gray-900">
      <Navbar />
      <Hero />
      <div className=" flex justify-center md:py-10 py-5 px-5 md:px-40">
        <img src="/demo.png" alt="" className=" rounded-xl" />
      </div>
      <Version />
      <Footer />
    </div>
  );
};

export default Home;

