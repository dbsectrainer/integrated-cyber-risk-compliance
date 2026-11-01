import React from 'react';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, TrendingUp, Shield, Zap, DollarSign } from 'lucide-react';

const slides = [
    {
        title: "The Problem: Siloed Security & Compliance",
        points: [
            "Disconnected SIEM, ITSM, and GRC tools create data gaps.",
            "Manual processes lead to slow incident response (high MTTR).",
            "Lack of a unified view hinders strategic risk management.",
            "Compliance reporting is time-consuming and prone to errors."
        ],
        icon: Shield,
    },
    {
        title: "The Solution: Integrated Automation Framework (ICRAF)",
        points: [
            "A unified platform to automate data flow between security, IT, and compliance.",
            "Automated incident creation from SIEM alerts directly into ITSM.",
            "Dynamic risk scoring based on real-time asset and vulnerability data.",
            "Centralized dashboard for end-to-end visibility and control."
        ],
        icon: Zap,
    },
    {
        title: "Key Benefits & Business Outcomes",
        points: [
            "Reduced Downtime: Faster detection and response minimizes impact.",
            "Audit Readiness: Continuous compliance monitoring and automated evidence collection.",
            "Cost Efficiency: Automation reduces manual effort and operational overhead.",
            "Strategic Alignment: Clear line of sight from technical controls to business risk."
        ],
        icon: TrendingUp,
    },
    {
        title: "Return on Investment (ROI)",
        points: [
            "Projected 35% reduction in Mean Time to Respond (MTTR).",
            "Estimated 50% decrease in manual effort for compliance reporting.",
            "Improved risk posture, potentially lowering cybersecurity insurance premiums.",
            "Enhanced decision-making through accurate, timely, and contextualized data."
        ],
        icon: DollarSign,
    },
];


const Presentation: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
    
    const slide = slides[currentSlide];
    const Icon = slide.icon;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 sm:p-8 flex flex-col justify-between min-h-[60vh]">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Icon className="w-16 h-16 text-blue-500 mb-6" aria-hidden="true" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">{slide.title}</h2>
                <ul className="space-y-4 text-gray-700 dark:text-gray-300 max-w-2xl text-base sm:text-lg">
                    {slide.points.map((point, index) => (
                        <li key={index} className="flex items-start">
                            <ArrowRight className="text-blue-500 mr-3 mt-1.5 flex-shrink-0" size={20} />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={prevSlide}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                    <ArrowLeft size={16} /> Previous
                </button>
                <div className="flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={currentSlide === index ? 'step' : undefined}
                            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
                        />
                    ))}
                </div>
                <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    Next <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Presentation;
