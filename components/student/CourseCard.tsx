import React from "react";
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";

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
            className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
        >
            <Image
                className="w-full"
                src={course.courseThumbnail}
                alt={course.courseTitle}
                width={424}
                height={240}
            />
            <div className="p-3 text-left">
                <h3 className="text-base font-semibold">{course.courseTitle}</h3>
                <p className="text-gray-500">LearnStack</p>
                <div className="flex items-center space-x-2">
                    <p>{rating.toFixed(1)}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Image
                                className="w-3.5 h-3.5"
                                key={i}
                                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                                alt="star"
                                width={14}
                                height={14}
                            />
                        ))}
                    </div>
                    <p className="text-gray-500">({course.courseRatings.length})</p>
                </div>
                <p className="text-base font-semibold text-gray-800">
                    {currency}
                    {discountedPrice}
                </p>
            </div>
        </Link>
    );
};

export default CourseCard;
