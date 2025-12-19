'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const CallToAction = () => {
    return (
        <div className="relative py-24 px-8 md:px-16 overflow-hidden">
            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />



            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Limited Time Offer</span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                >
                    Ready to Transform Your Future?
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
                >
                    Join thousands of successful students and start your learning journey today.
                    Get access to premium courses and expert guidance.
                </motion.p>

                {/* Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6 mb-10"
                >
                    {[
                        "7-day free trial",
                        "Cancel anytime",
                        "Money-back guarantee"
                    ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-white">
                            <CheckCircle2 className="w-5 h-5 text-green-300" />
                            <span className="font-medium">{benefit}</span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="group px-10 py-5 bg-white text-primary-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-card-hover hover:scale-105 transition-all duration-300 flex items-center gap-2">
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300">
                        View Pricing
                    </button>
                </motion.div>

                {/* Trust Indicator */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-white/70 text-sm mt-8"
                >
                    No credit card required • Instant access • 50,000+ happy students
                </motion.p>
            </div>
        </div>
    );
};

export default CallToAction;
