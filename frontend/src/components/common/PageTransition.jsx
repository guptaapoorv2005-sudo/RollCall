import { motion } from "framer-motion";

const MotionDiv = motion.div;

function PageTransition({ children }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-6"
    >
      {children}
    </MotionDiv>
  );
}

export default PageTransition;
