import SectionTitle from '../components/section-title';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from "framer-motion";

export default function FaqSection() {
    const [isOpen, setIsOpen] = useState(false);
    const data = [
        {
            question: 'Do I need coding or design experience to use Reelio AI?',
            answer: "No, you don't need any coding or design experience to use Reelio AI. Our platform is designed to be user-friendly and accessible to everyone, regardless of their technical background.",
        },
        {
            question: 'How does Reelio AI generate thumbnails and ads?',
            answer: 'Reelio AI uses advanced machine learning algorithms to analyze your content and automatically create engaging thumbnails and ads tailored to your audience.',
        },
        {
            question: 'What file formats does Reelio AI support?',
            answer: 'Reelio AI supports various file formats including JPG and PNG for thumbnails, and MP4 and MOV for ads.',
        },
        {
            question: 'Do I own the rights to the generated thumbnails and ads?',
            answer: 'Yes, you retain full ownership of all content generated using Reelio AI.',
        }
    ];

    return (
        <section className='mt-32'>
            <SectionTitle title="FAQ's" description="Looking for answers to your frequently asked questions? Check out our FAQ's section below to find." />
            <div className='mx-auto mt-12 space-y-4 w-full max-w-xl'>
                {data.map((item, index) => (
                    <motion.div key={index} className='flex flex-col glass rounded-md'
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <h3 className='flex cursor-pointer hover:bg-white/10 transition items-start justify-between gap-4 p-4 font-medium' onClick={() => setIsOpen(isOpen === index ? null : index)}>
                            {item.question}
                            <ChevronDownIcon className={`size-5 transition-all shrink-0 duration-400 ${isOpen === index ? 'rotate-180' : ''}`} />
                        </h3>
                        <p className={`px-4 text-sm/6 transition-all duration-400 overflow-hidden ${isOpen === index ? 'pt-2 pb-4 max-h-80' : 'max-h-0'}`}>{item.answer}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}