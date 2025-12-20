'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Award, TrendingUp, ArrowRight, Play } from 'lucide-react';
import SearchBar from './SearchBar';
import assets from '@/lib/assets';

const Hero = () => {
  const stats = [
    { icon: Users, value: '50,000+', label: 'Active Students' },
    { icon: GraduationCap, value: '500+', label: 'Expert Courses' },
    { icon: Award, value: '98%', label: 'Success Rate' },
    { icon: TrendingUp, value: '4.9/5', label: 'Student Rating' },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />



      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 pb-16 space-y-8 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-semibold mb-6 shadow-lg"
        >
          <Award className="w-4 h-4" />
          <span>India's #1 Coaching Platform</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:text-home-heading-large text-home-heading-small relative font-bold text-white max-w-4xl mx-auto leading-tight"
        >
          Empower Your Future with{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-yellow-300">Excellence</span>
            <motion.span
              className="absolute bottom-2 left-0 w-full h-3 bg-yellow-400/30 -z-0"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </span>
          {' '}in Learning
          <Image
            src={assets.sketch}
            alt="sketch decoration"
            width={120}
            height={30}
            className="md:block hidden absolute -bottom-8 right-0 opacity-80"
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/95 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Access quality study materials, practice tests, and track your progress
          with our comprehensive learning management system designed specifically
          for coaching center students.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <button className="group px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-card-hover transition-all duration-300 hover:scale-105 flex items-center gap-2">
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full max-w-2xl"
        >
          <SearchBar />
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 w-full max-w-4xl"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-premium hover:shadow-card-hover transition-all duration-300 group border border-white/20"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-600 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
