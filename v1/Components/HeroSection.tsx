import React from "react";
import { motion } from "framer-motion";

const DURATION = 0.5;
const STAGGER = 0.025;

const FlipLink = ({ href, children }: { children: string; href: string }) => {
  return (
    <motion.a
      href={href}
      className="relative block overflow-hidden font-bold uppercase whitespace-nowrap
                 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
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

export default function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center bg-slate-950 text-white 
      h-screen gap-4 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
      id="home"
    >
      <FlipLink href="#">Secure transfers</FlipLink>
      <FlipLink href="#">Manage your funds</FlipLink>
      <FlipLink href="#">Reliable remittances</FlipLink>
      <FlipLink href="#">Control your account</FlipLink>
      <FlipLink href="#">Successful transactions</FlipLink>
    </section>
  );
}
