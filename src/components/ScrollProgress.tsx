'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** A thin gold progress hairline across the top — precise, modern-sharp touch. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.3 });
  return <motion.div className="tc-progress" style={{ scaleX }} aria-hidden />;
}
