import React from 'react';
import Hero from '@/components/student/Hero';
import FeaturesSection from '@/components/student/FeaturesSection';
import StatsSection from '@/components/student/StatsSection';
import Companies from '@/components/student/Companies';
import CoursesSection from '@/components/student/CoursesSection';
import TestimonialsSection from '@/components/student/TestimonialsSection';
import CallToAction from '@/components/student/CallToAction';
import Footer from '@/components/student/Footer';

export default function Home() {
  return (
    <div className="flex flex-col">
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
