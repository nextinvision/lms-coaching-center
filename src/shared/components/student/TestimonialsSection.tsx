'use client';

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { assets, dummyTestimonial } from "@/lib/assets";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

const TestimonialsSection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div className="py-20 px-8 md:px-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Student <span className="gradient-text">Success Stories</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Hear from our learners as they share their journeys of transformation,
                        success, and how our platform has made a difference in their lives.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2,
                            },
                        },
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {dummyTestimonial.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5 }}
                            className="group"
                        >
                            <div className="relative h-full bg-white rounded-2xl shadow-premium hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-0.5 rounded-2xl">
                                    <div className="w-full h-full bg-white rounded-2xl" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 p-6">
                                    {/* Quote Icon */}
                                    <div className="mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
                                            <Quote className="w-6 h-6 text-white fill-white" />
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(testimonial.rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Feedback */}
                                    <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                                        "{testimonial.feedback}"
                                    </p>

                                    {/* Divider */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            {/* Gradient Ring */}
                                            <div className="absolute inset-0 bg-primary-600 rounded-full p-0.5 group-hover:scale-110 transition-transform duration-300">
                                                <div className="w-full h-full bg-white rounded-full" />
                                            </div>
                                            {/* Profile Image */}
                                            <Image
                                                className="relative z-10 w-14 h-14 rounded-full object-cover"
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                width={56}
                                                height={56}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Corner Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-primary-500 hover:text-primary-600 hover:shadow-lg transition-all duration-300">
                        View All Reviews
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
