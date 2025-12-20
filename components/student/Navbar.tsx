'use client';

import React from 'react';
import assets from '@/lib/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    userRole?: 'student' | 'teacher' | 'admin' | null;
    userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userRole = null, userName }) => {
    const pathname = usePathname();
    const isContentListPage = pathname?.includes('/content');

    return (
        <div
            className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isContentListPage ? 'bg-white' : 'bg-cyan-100/70'
                }`}
        >
            {/* Logo */}
            <Link href="/" className="cursor-pointer">
                <Image
                    src={assets.logo}
                    alt="LMS Logo"
                    width={128}
                    height={40}
                    className="w-28 lg:w-32"
                    priority
                />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5 text-gray-500">
                {userRole && (
                    <>
                        {userRole === 'student' && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="hover:text-gray-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                |
                                <Link
                                    href="/content"
                                    className="hover:text-gray-700 transition-colors"
                                >
                                    Content
                                </Link>
                                |
                                <Link
                                    href="/tests"
                                    className="hover:text-gray-700 transition-colors"
                                >
                                    Tests
                                </Link>
                            </>
                        )}
                        {userRole === 'teacher' && (
                            <Link
                                href="/educator"
                                className="hover:text-gray-700 transition-colors"
                            >
                                Educator Dashboard
                            </Link>
                        )}
                        {userRole === 'admin' && (
                            <Link
                                href="/admin"
                                className="hover:text-gray-700 transition-colors"
                            >
                                Admin Panel
                            </Link>
                        )}
                    </>
                )}

                {userRole ? (
                    <div className="flex items-center gap-3">
                        {userName && <span className="text-gray-700">{userName}</span>}
                        {/* User button will be added when auth is integrated */}
                        <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            {userName?.charAt(0) || 'U'}
                        </button>
                    </div>
                ) : (
                    <Link href="/login">
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
                {userRole && (
                    <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs pr-2">
                        {userRole === 'student' && (
                            <>
                                <Link href="/dashboard" className="hover:text-gray-700">
                                    Dashboard
                                </Link>
                                <Link href="/content" className="hover:text-gray-700">
                                    Content
                                </Link>
                            </>
                        )}
                        {userRole === 'teacher' && (
                            <Link href="/educator" className="hover:text-gray-700">
                                Educator
                            </Link>
                        )}
                        {userRole === 'admin' && (
                            <Link href="/admin" className="hover:text-gray-700">
                                Admin
                            </Link>
                        )}
                    </div>
                )}

                {userRole ? (
                    <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        {userName?.charAt(0) || 'U'}
                    </button>
                ) : (
                    <Link href="/login">
                        <Image
                            src={assets.user_icon}
                            alt="User"
                            width={24}
                            height={24}
                        />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
