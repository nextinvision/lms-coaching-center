'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Video,
    BarChart3,
    Users,
    Award,
    Smartphone,
    Headphones,
    BookOpen,
    Clock
} from 'lucide-react';

const FeaturesSection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const features = [
        {
            icon: Video,
            title: 'Live Classes',
            description: 'Interactive live sessions with expert instructors in real-time',
            color: '#2563eb',
        },
        {
            icon: BarChart3,
            title: 'Progress Tracking',
            description: 'Monitor your learning journey with detailed analytics and insights',
            color: '#2563eb',
        },
        {
            icon: Users,
            title: 'Expert Instructors',
            description: 'Learn from industry professionals with years of experience',
            color: '#2563eb',
        },
        {
            icon: Award,
            title: 'Certifications',
            description: 'Earn recognized certificates upon course completion',
            color: '#2563eb',
        },
        {
            icon: Smartphone,
            title: 'Mobile Learning',
            description: 'Study anywhere, anytime with our mobile-optimized platform',
            color: '#2563eb',
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description: 'Get help whenever you need it with our dedicated support team',
            color: '#2563eb',
        },
        {
            icon: BookOpen,
            title: 'Rich Content',
            description: 'Access comprehensive study materials, videos, and practice tests',
            color: '#2563eb',
        },
        {
            icon: Clock,
            title: 'Flexible Schedule',
            description: 'Learn at your own pace with on-demand content and recordings',
            color: '#2563eb',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <section className="py-20 px-8 md:px-16 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="gradient-text">Our Platform</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience the perfect blend of technology and education with features designed to accelerate your learning journey
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative h-full p-8 bg-white rounded-2xl shadow-premium hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200">
                                {/* Gradient accent on hover */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                                {/* Icon Container */}
                                <div className="relative mb-6 w-16 h-16 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative corner */}
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary-50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
