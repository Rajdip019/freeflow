import EverythingYouNeedToFocusOn from "@/components/LandingPage/EverythingYouNeedToFocusOn";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import LessEmailMoreDesign from "@/components/LandingPage/LessEmailMoreDesign";
import Navbar from "@/components/LandingPage/Navbar";
import Version from "@/components/LandingPage/Version";
import React from "react";

const Home = () => {
  return (
    <div className="bg-[#14171F]">
      <div className="max-w-[1440px] mx-auto">
      <Navbar />
      <Hero />
      <LessEmailMoreDesign />
      <div className=" flex justify-center md:py-10 py-5 px-5 md:px-40 mt-28">
        <img src="/demo.png" alt="" className=" rounded-xl hidden md:block" />
        <img src="/demo-m.png" alt="" className=" md:hidden" />
      </div>
      {/* <Version /> */}
      <EverythingYouNeedToFocusOn />
      </div>
      <Footer />
    </div>
  );
};

export default Home;

