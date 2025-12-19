import React from 'react';
import assets from '@/lib/assets';
import Image from 'next/image';
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto">
        <span className="text-blue-600">
          Empower your future with comprehensive learning designed for excellence.
        </span>
        <Image
          src={assets.sketch}
          alt="sketch decoration"
          width={100}
          height={30}
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
        Access quality study materials, practice tests, and track your progress
        with our comprehensive learning management system designed specifically
        for coaching center students.
      </p>

      <p className="md:hidden text-gray-500 max-w-sm mx-auto">
        Access quality study materials, practice tests, and track your progress
        with our comprehensive LMS for coaching centers.
      </p>

      <SearchBar />
    </div>
  );
};

export default Hero;
