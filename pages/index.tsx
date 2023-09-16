import EverythingYouNeedToFocusOn from "@/components/LandingPage/EverythingYouNeedToFocusOn";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import LessEmailMoreDesign from "@/components/LandingPage/LessEmailMoreDesign";
import Navbar from "@/components/LandingPage/Navbar";
// import Version from "@/components/LandingPage/Version";
import React from "react";

const Home = () => {
  return (
    <div className="bg-[#14171F]">
      <div className="mx-auto max-w-[1440px]">
        <Navbar />
        <Hero />
        <LessEmailMoreDesign />
        <div className=" mt-28 flex justify-center px-5 py-5 md:px-40 md:py-10">
          <img
            src="/landing/demo.png"
            alt=""
            className=" hidden rounded-xl md:block"
          />
          <img src="/landing/demo-m.png" alt="" className=" md:hidden" />
        </div>
        {/* <Version /> */}
        <EverythingYouNeedToFocusOn />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
