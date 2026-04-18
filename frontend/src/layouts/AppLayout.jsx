import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "../components/navigation/Sidebar";
import TopNavbar from "../components/navigation/TopNavbar";

const MotionDiv = motion.div;

function AppLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app">
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:block md:fixed md:inset-y-0 md:left-0" />

        <AnimatePresence>
          {isMobileSidebarOpen ? (
            <>
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />

              <MotionDiv
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-y-0 left-0 z-40 md:hidden"
              >
                <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
              </MotionDiv>
            </>
          ) : null}
        </AnimatePresence>

        <div className="flex min-h-screen w-full flex-col md:ml-64">
          <TopNavbar onMenuClick={() => setIsMobileSidebarOpen((prev) => !prev)} />
          <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
