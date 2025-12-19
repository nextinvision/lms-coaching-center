import React from 'react';
import assets from '@/lib/assets';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
            <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
                {/* Logo and description */}
                <div className="flex flex-col md:items-start items-center w-full">
                    <Image
                        src={assets.logo_dark}
                        alt="LMS Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                    <p className="mt-6 text-center md:text-left text-sm text-white/80">
                        Empowering students with quality education and comprehensive learning resources
                        tailored for success.
                    </p>
                </div>

                {/* Company links */}
                <div className="flex flex-col md:items-start items-center w-full">
                    <h2 className="font-semibold text-white mb-5">Quick Links</h2>
                    <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
                        <li className="hover:text-white transition-colors">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="hover:text-white transition-colors">
                            <Link href="/content">Content</Link>
                        </li>
                        <li className="hover:text-white transition-colors">
                            <Link href="/tests">Tests</Link>
                        </li>
                        <li className="hover:text-white transition-colors">
                            <Link href="/dashboard">Dashboard</Link>
                        </li>
                        <li className="hover:text-white transition-colors">
                            <Link href="/contact">Contact Us</Link>
                        </li>
                    </ul>
                </div>

                {/* Newsletter section */}
                <div className="hidden md:flex flex-col items-start w-full">
                    <h2 className="font-semibold text-white/80 mb-2">
                        Stay Updated
                    </h2>
                    <p className="text-sm text-white/80 mb-4">
                        Get the latest updates, resources, and announcements delivered to your inbox.
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="border border-gray-500/30 bg-gray-800 text-white placeholder-gray-500 outline-none w-64 h-9 rounded px-3 text-sm focus:border-blue-600 transition-colors"
                        />
                        <button className="bg-blue-600 w-24 h-9 text-white rounded hover:bg-blue-700 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <p className="py-4 text-center text-xs md:text-sm text-white/60">
                Copyright {new Date().getFullYear()} © LMS Coaching Center. All Rights Reserved
            </p>
        </footer>
    );
};

export default Footer;
