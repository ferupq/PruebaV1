"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  fadeInUp,
  slideInFromLeft,
  bounceIn,
  slideInFromRight,
  rotateIn,
  fadeOutBlur,
} from "../Animations/animation";

import AboutSection from "@/Components/AboutSection";
import ContactSection from "@/Components/ContactSection";
import Features from "@/Components/Features";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import HeroSection from "@/Components/HeroSection";
import ServicesSection from "@/Components/ServicesSection";

const Home = () => {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: false,
  });

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-opacity-90">
        <motion.div
          ref={heroRef}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <HeroSection />
        </motion.div>

        <AboutSection />

        <ServicesSection />

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
