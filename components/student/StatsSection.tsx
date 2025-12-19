'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

const StatsSection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const stats = [
        {
            icon: Users,
            end: 50000,
            suffix: '+',
            label: 'Active Students',
            description: 'Learning and growing',
        },
        {
            icon: BookOpen,
            end: 500,
            suffix: '+',
            label: 'Expert Courses',
            description: 'Across all subjects',
        },
        {
            icon: TrendingUp,
            end: 98,
            suffix: '%',
            label: 'Success Rate',
            description: 'Student achievement',
        },
        {
            icon: Award,
            end: 4.9,
            suffix: '/5',
            label: 'Student Rating',
            description: 'Average satisfaction',
            decimal: true,
        },
    ];

    return (
        <section className="relative py-20 px-8 md:px-16 overflow-hidden bg-primary-600">
            {/* Background Pattern */}
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            stat={stat}
                            index={index}
                            inView={inView}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

interface StatCardProps {
    stat: {
        icon: React.ElementType;
        end: number;
        suffix: string;
        label: string;
        description: string;
        decimal?: boolean;
    };
    index: number;
    inView: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, inView }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = stat.end / steps;
        const stepDuration = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.end) {
                setCount(stat.end);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [inView, stat.end]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
        >
            <div className="relative p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-premium hover:shadow-card-hover transition-all duration-300 border border-blue-100 hover:border-blue-300">
                {/* Icon */}
                <div className="mb-4 w-16 h-16 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>

                {/* Counter */}
                <div className="text-5xl font-bold text-gray-900 mb-2">
                    {stat.decimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
                    <span className="text-3xl text-primary-600">{stat.suffix}</span>
                </div>

                {/* Label */}
                <div className="text-xl font-semibold text-gray-800 mb-1">
                    {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600">
                    {stat.description}
                </div>

                {/* Decorative accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full" />
            </div>
        </motion.div>
    );
};

export default StatsSection;
