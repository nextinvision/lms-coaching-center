// Navbar Component
'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/modules/auth';
import { useLanguageStore } from '@/shared/store/languageStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Menu, LogOut, User } from 'lucide-react';
import { useUIStore } from '@/shared/store/uiStore';
import { NotificationDropdown } from './NotificationDropdown';
import { useStudent } from '@/modules/students';
import useTranslation from '@/core/i18n/useTranslation';

export const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { language, setLanguage } = useLanguageStore();
    const { toggleSidebar } = useUIStore();
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get student batchId for filtering notices (only for students)
    const studentId = useMemo(() => user?.studentProfile?.id || null, [user?.studentProfile?.id]);
    const { student } = useStudent(studentId);
    const batchId = useMemo(() => student?.batchId || null, [student?.batchId]);

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
        await logout();
        setIsDropdownOpen(false);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'as' : 'en');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center">
                        {isAuthenticated && (
                            <button
                                onClick={toggleSidebar}
                                className="mr-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                            >
                                <Menu className="h-6 w-6 text-gray-600" />
                            </button>
                        )}
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-blue-600">LMS</span>
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            {language === 'en' ? 'অসমীয়া' : 'English'}
                        </button>

                        {isAuthenticated && user && (
                            <>
                                {/* Notifications */}
                                <NotificationDropdown userRole={user.role} batchId={batchId} />

                                {/* User Profile Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        aria-label="User menu"
                                    >
                                        <Avatar
                                            src={user?.imageUrl || undefined}
                                            name={user?.name}
                                            size="sm"
                                        />
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-600 capitalize">{user?.role.toLowerCase()}</p>
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                            {/* User Info Section */}
                                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={user?.imageUrl || undefined}
                                                        name={user?.name}
                                                        size="md"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {user?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 capitalize">
                                                            {user?.role.toLowerCase()}
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
                                                    <span>{t('common.logout')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {!isAuthenticated && (
                            <Link href="/login">
                                <Button size="sm">{t('common.login')}</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
