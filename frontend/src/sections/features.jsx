import SectionTitle from "../components/section-title";
import { UploadIcon, VideoIcon, ZapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Features() {

    const refs = useRef([]);

    const featuresData = [
        {
            icon: UploadIcon,
            title: "Easy Upload",
            description: "Simple and fast file upload process. We auto-optimize formats and sizes.",
        },
        {
            icon: VideoIcon,
            title: "Video Synthesis",
            description: "Bridging the gap between text and visual content.",
        },
        {
            icon: ZapIcon,
            title: "Instant Generation",
            description: "Optimized models deliver output in seconds with great fidelity.",
        }
    ];

    return (
        <section className="mt-32">
            <SectionTitle
                title="Features"
                description="From image generation to video synthesis, our platform offers a suite of powerful features designed to bring your creative visions to life with ease and efficiency."
            />

            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 px-6">
                {featuresData.map((feature, index) => (
                    <motion.div
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        className="hover:-translate-y-0.5 p-6 rounded-xl space-y-4 glass max-w-80 w-full"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: index * 0.15,
                            type: "spring",
                            stiffness: 320,
                            damping: 70,
                            mass: 1
                        }}
                        onAnimationComplete={() => {
                            const card = refs.current[index];
                            if (card) {
                                card.classList.add("transition", "duration-300");
                            }
                        }}
                    >
                        <feature.icon className="size-8.5" />
                        <h3 className="text-base font-medium text-white">
                            {feature.title}
                        </h3>
                        <p className="text-gray-100 line-clamp-2 pb-2">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
