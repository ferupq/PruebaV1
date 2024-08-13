import React from "react";
import { motion } from "framer-motion";

const DURATION = 0.5;
const STAGGER = 0.025;

const FlipLink = ({ href, children }: { children: string; href: string }) => {
  return (
    <motion.a
      href={href}
      className="relative block overflow-hidden 
       whitespace-nowrap text-4xl font-white uppercase sm:text-4xl md:text-4xl lg:text-7xl"
      initial="initial"
      whileHover="hovered"
    >
      <div>
        {children.split("").map((l, i) => {
          return (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              key={i}
              transition={{
                duration: DURATION,
                delay: i * STAGGER,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              {l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          return (
            <motion.span
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              className="inline-block"
              transition={{
                duration: DURATION,
                delay: i * STAGGER,
                ease: "easeInOut",
              }}
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.a>
  );
};

// Componente HeroSection que utiliza FlipLink
export default function HeroSection() {
  return (
    <section
      className="grid bg-slate-950 text-white h-screen gap-2 place-content-center 
      px-8 whitespace-nowrap text-4xl font-white uppercase sm:text-7xl md:text-8xl lg:text-9xl"
      id="home"
    >
      <FlipLink href="#">Secure transfers.</FlipLink>
      <FlipLink href="#">Manage your funds.</FlipLink>
      <FlipLink href="#">Reliable remittances.</FlipLink>
      <FlipLink href="#">Control your account.</FlipLink>
      <FlipLink href="#">Successful transactions.</FlipLink>
    </section>
  );
}
