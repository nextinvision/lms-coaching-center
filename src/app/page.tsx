'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import Navbar from '@/shared/components/student/Navbar';
import Hero from '@/shared/components/student/Hero';
import FeaturesSection from '@/shared/components/student/FeaturesSection';
import StatsSection from '@/shared/components/student/StatsSection';
import Companies from '@/shared/components/student/Companies';
import CoursesSection from '@/shared/components/student/CoursesSection';
import TestimonialsSection from '@/shared/components/student/TestimonialsSection';
import CallToAction from '@/shared/components/student/CallToAction';
import Footer from '@/shared/components/student/Footer';
import { Loader } from '@/shared/components/ui/Loader';

export default function Home() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();
    const [authCheckTimeout, setAuthCheckTimeout] = useState(false);

    // Set timeout to show page even if auth check takes too long
    useEffect(() => {
        const timer = setTimeout(() => {
            setAuthCheckTimeout(true);
        }, 2000); // Show page after 2 seconds even if still loading

        return () => clearTimeout(timer);
    }, []);

    // Redirect authenticated users to their dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            switch (user.role) {
                case 'STUDENT':
                    router.push('/student/dashboard');
                    break;
                case 'TEACHER':
                    router.push('/teacher/dashboard');
                    break;
                case 'ADMIN':
                    router.push('/admin/dashboard');
                    break;
                default:
                    // Stay on home page if role is unknown
                    break;
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loader while checking authentication (but only for a short time)
    if (isLoading && !authCheckTimeout) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Loading..." />
            </div>
        );
    }

    // Show loader while redirecting
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Redirecting to dashboard..." />
            </div>
        );
    }

    // Show landing page for unauthenticated users (or if auth check timed out)
    return (
        <div className="flex flex-col">
            <Navbar />
            <Hero />
            <Companies />
            <FeaturesSection />
            <CoursesSection />
            <StatsSection />
            <TestimonialsSection />
            <CallToAction />
            <Footer />
        </div>
    );
}
