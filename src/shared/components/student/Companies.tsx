'use client';

import React from "react";
import { motion } from "framer-motion";
import { assets } from "@/lib/assets";
import Image from "next/image";

const Companies = () => {
    const companies = [
        { name: "Microsoft", logo: assets.microsoft_logo },
        { name: "Walmart", logo: assets.walmart_logo },
        { name: "Accenture", logo: assets.accenture_logo },
        { name: "Adobe", logo: assets.adobe_logo },
        { name: "Paypal", logo: assets.paypal_logo },
    ];

    return (
        <div className="py-16 px-8 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
            >
                <p className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-8 text-center">
                    Trusted by learners from top companies
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            className="grayscale hover:grayscale-0 transition-all duration-300"
                        >
                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={112}
                                height={40}
                                className="w-20 md:w-28 h-auto opacity-60 hover:opacity-100 transition-opacity"
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Companies;
