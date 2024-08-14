"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { HiHome } from "react-icons/hi2";
import { FaInfoCircle } from "react-icons/fa";
import { BsMailbox2Flag } from "react-icons/bs";
import { motion, useAnimationControls } from "framer-motion";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [metaColor, setMetaColor] = useState("#030617"); // Color inicial del meta tag

  const controls = useAnimationControls();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = ["home", "about", "services", "testimonials", "email"];

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const sectionTop = element.offsetTop;
          const sectionHeight = element.offsetHeight;
          if (
            scrollY >= sectionTop - 50 &&
            scrollY < sectionTop + sectionHeight - 50
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  useEffect(() => {
    if (isMenuVisible) {
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: [0.08, 0.65, 0.53, 0.96] },
      });
      setMetaColor("white"); // Cambiar el color del meta tag cuando el menú está visible
    } else {
      controls.start({
        x: "100%",
        opacity: 0,
        transition: { duration: 0.6, ease: [0.08, 0.65, 0.53, 0.96] },
      });
      setMetaColor("#030617"); // Restablecer el color del meta tag cuando el menú no está visible
    }
  }, [isMenuVisible, controls]);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const handleMenuButtonClick = () => {
    // Close the menu with animation when a menu button is clicked
    setIsMenuVisible(false);
  };

  const getMenuIconColor = () => {
    switch (activeSection) {
      case "home":
        return "text-white";
      case "about":
        return "text-black";
      case "services":
        return "text-blue-500";
      case "testimonials":
        return "text-green-500";
      case "contact":
        return "text-yellow-500";
      default:
        return "text-white";
    }
  };

  type Section = "home" | "about" | "services" | "testimonials" | "contact";

  return (
    <>
      <meta name="theme-color" content={metaColor} />

      <header className="fixed top-0 left-0 right-0 bg-slate-950 text-white p-4 z-50 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">CashClarity</h1>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex">
              {[
                {
                  href: "#home",
                  icon: <HiHome className="text-xl" />,
                  text: "Home",
                },
                {
                  href: "#about",
                  icon: <FaInfoCircle className="text-xl" />,
                  text: "Analytics",
                },
                {
                  href: "#contact",
                  icon: <BsMailbox2Flag className="text-xl" />,
                  text: "Email",
                },
              ].map(({ href, icon, text }) => (
                <a
                  key={href}
                  href={href}
                  className="relative flex items-center px-6 py-2 mx-2 transition-colors duration-300 group hover:text-blue-500"
                >
                  <span className="mr-2 flex items-center transition-transform transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 duration-300">
                    {icon}
                  </span>
                  <span className="flex items-center transform group-hover:translate-x-2 transition-transform duration-300">
                    {text}
                  </span>
                  <span className="absolute inset-0 rounded-full border border-transparent group-hover:border-blue-500 group-hover:scale-110 transform scale-100 transition-transform duration-300"></span>
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Floating Menu Button */}
      {isMobile && (
        <button
          className={`fixed top-5 right-7 text-2xl z-50 bg-opacity-80 transition-transform duration-300 ${
            isMenuVisible ? "rotate-90" : ""
          }`}
          onClick={toggleMenu}
        >
          {isMenuVisible ? (
            <IoMdClose color="white" />
          ) : (
            <HiOutlineMenu color="white" />
          )}
        </button>
      )}

      {/* Modal Overlay */}
      <motion.div
        className={`fixed inset-0 bg-white shadow-lg z-40 flex items-start p-5 ${
          isMenuVisible ? "block" : "hidden"
        }`} // Add hidden class when menu is not visible
        initial={{ x: "100%", opacity: 0 }}
        animate={controls}
      >
        <nav className="flex flex-col w-full mt-40">
          {[
            {
              href: "#home",
              text: "Home",
              icon: <HiHome className="text-3xl" />,
            },
            {
              href: "#about",
              text: "About",
              icon: <FaInfoCircle className="text-3xl" />,
            },

            {
              href: "#contact",
              text: "Email",
              icon: <BsMailbox2Flag className="text-3xl" />,
            },
          ].map(({ href, text, icon }) => (
            <motion.a
              key={href}
              href={href}
              className="flex items-center justify-between w-full text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent transition-transform duration-300 transform hover:scale-110 py-3"
              style={{ color: "black" }}
              onClick={handleMenuButtonClick}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "tween",
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              <span
                className="text-4xl
                bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent transition-transform duration-300 transform hover:scale-10 py-3

              "
                style={{ fontWeight: "400" }}
              >
                {text}
              </span>
            </motion.a>
          ))}
        </nav>
      </motion.div>
    </>
  );
}
