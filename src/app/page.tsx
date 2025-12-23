'use client';

import React from 'react';
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
    const { isLoading } = useAuth();

    // Show loader while checking authentication
    // Middleware will redirect authenticated users server-side
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Loading..." />
            </div>
        );
    }

    // Show landing page for unauthenticated users
    // Middleware redirects authenticated users before this renders
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
