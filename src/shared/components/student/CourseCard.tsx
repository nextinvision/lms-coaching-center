'use client';

import React from "react";
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Clock, Star } from "lucide-react";

interface CourseRating {
    userId: string;
    rating: number;
}

interface Course {
    _id: string;
    courseTitle: string;
    courseDescription: string;
    coursePrice: number;
    discount: number;
    courseThumbnail: string;
    courseRatings: CourseRating[];
    enrolledStudents: string[];
}

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const currency = "$";

    // Calculate average rating
    const calculateRating = (course: Course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating;
        });
        return totalRating / course.courseRatings.length;
    };

    const rating = calculateRating(course);
    const discountedPrice = (
        course.coursePrice -
        (course.discount * course.coursePrice) / 100
    ).toFixed(2);

    return (
        <Link
            href={`/course/${course._id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="block group"
        >
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="relative h-full bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-card-hover transition-all duration-300"
            >
                {/* Discount Badge */}
                {course.discount > 0 && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg">
                        {course.discount}% OFF
                    </div>
                )}

                {/* Popular Badge */}
                {course.enrolledStudents.length > 2 && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        Popular
                    </div>
                )}

                {/* Thumbnail with Gradient Overlay */}
                <div className="relative overflow-hidden aspect-video">
                    <Image
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        width={424}
                        height={240}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            View Course
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {course.courseTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.courseDescription}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.enrolledStudents.length} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>12 hours</span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-gray-800">
                                {rating.toFixed(1)}
                            </span>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Image
                                        className="w-4 h-4"
                                        key={i}
                                        src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                                        alt="star"
                                        width={16}
                                        height={16}
                                    />
                                ))}
                            </div>
                        </div>
                        <span className="text-sm text-gray-500">
                            ({course.courseRatings.length} reviews)
                        </span>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold gradient-text-blue">
                                {currency}{discountedPrice}
                            </span>
                            {course.discount > 0 && (
                                <span className="text-sm text-gray-400 line-through">
                                    {currency}{course.coursePrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Enroll Now
                        </div>
                    </div>
                </div>

                {/* Decorative Border Gradient */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-200 transition-colors duration-300 pointer-events-none" />
            </motion.div>
        </Link>
    );
};

export default CourseCard;
