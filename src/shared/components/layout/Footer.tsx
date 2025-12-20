// Footer Component
'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/shared/utils/cn';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
    variant?: 'default' | 'minimal';
}

export const Footer: React.FC<FooterProps> = ({ className, variant = 'default', ...props }) => {
    const currentYear = new Date().getFullYear();

    if (variant === 'minimal') {
        return (
            <footer
                className={cn('border-t border-gray-200 bg-white py-4', className)}
                {...props}
            >
                <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                    © {currentYear} LMS Coaching Center. All rights reserved.
                </div>
            </footer>
        );
    }

    return (
        <footer
            className={cn('border-t border-gray-200 bg-white', className)}
            {...props}
        >
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">LMS</h3>
                        <p className="text-sm text-gray-600">
                            Comprehensive learning management system for coaching centers.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/" className="hover:text-blue-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-blue-600 transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                    © {currentYear} LMS Coaching Center. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

