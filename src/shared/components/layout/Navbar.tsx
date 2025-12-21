// Navbar Component
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/modules/auth';
import { useLanguageStore } from '@/shared/store/languageStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Menu, LogOut } from 'lucide-react';
import { useUIStore } from '@/shared/store/uiStore';
import { NotificationDropdown } from './NotificationDropdown';
import { useStudent } from '@/modules/students';

export const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { language, setLanguage } = useLanguageStore();
    const { toggleSidebar } = useUIStore();

    // Get student batchId for filtering notices (only for students)
    const studentId = useMemo(() => user?.studentProfile?.id || null, [user?.studentProfile?.id]);
    const { student } = useStudent(studentId);
    const batchId = useMemo(() => student?.batchId || null, [student?.batchId]);

    const handleLogout = async () => {
        await logout();
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'as' : 'en');
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

                                {/* User Menu */}
                                <div className="flex items-center space-x-3">
                                    <Avatar
                                        src={user?.imageUrl || undefined}
                                        name={user?.name}
                                        size="sm"
                                    />
                                    <div className="hidden md:block">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-lg hover:bg-gray-100"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </>
                        )}

                        {!isAuthenticated && (
                            <Link href="/login">
                                <Button size="sm">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
