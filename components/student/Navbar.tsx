'use client';

import React, { useState, useRef, useEffect } from 'react';
import assets from '@/lib/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { LogOut, User } from 'lucide-react';

interface NavbarProps {
    userRole?: 'student' | 'teacher' | 'admin' | null;
    userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userRole = null, userName }) => {
    const pathname = usePathname();
    const router = useRouter();
    const isContentListPage = pathname?.includes('/content');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuthStore();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        try {
            await logout();
            setIsDropdownOpen(false);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
                            aria-label="User menu"
                        >
                            {userName?.charAt(0).toUpperCase() || 'U'}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                {/* User Info Section */}
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                            {userName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {userName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">
                                                {userRole}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown Actions */}
                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
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
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
                            aria-label="User menu"
                        >
                            {userName?.charAt(0).toUpperCase() || 'U'}
                        </button>

                        {/* Mobile Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                {/* User Info Section */}
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                            {userName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {userName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">
                                                {userRole}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown Actions */}
                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
