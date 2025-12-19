// Asset imports for the LMS application
export const assets = {
    // Logos
    logo: '/assets/logo.svg',
    logo_dark: '/assets/logo_dark.svg',
    favicon: '/assets/favicon.svg',

    // Icons - UI
    search_icon: '/assets/search_icon.svg',
    cross_icon: '/assets/cross_icon.svg',
    upload_area: '/assets/upload_area.svg',
    arrow_icon: '/assets/arrow_icon.svg',
    down_arrow_icon: '/assets/down_arrow_icon.svg',
    dropdown_icon: '/assets/dropdown_icon.svg',
    user_icon: '/assets/user_icon.svg',
    user_icon_2: '/assets/user_icon_2.svg',

    // Icons - Navigation
    home_icon: '/assets/home_icon.svg',
    add_icon: '/assets/add_icon.svg',
    my_course_icon: '/assets/my_course_icon.svg',
    person_tick_icon: '/assets/person_tick_icon.svg',
    lesson_icon: '/assets/lesson_icon.svg',

    // Icons - Time & Status
    time_clock_icon: '/assets/time_clock_icon.svg',
    time_left_clock_icon: '/assets/time_left_clock_icon.svg',
    play_icon: '/assets/play_icon.svg',
    blue_tick_icon: '/assets/blue_tick_icon.svg',

    // Icons - Dashboard
    file_upload_icon: '/assets/file_upload_icon.svg',
    appointments_icon: '/assets/appointments_icon.svg',
    earning_icon: '/assets/earning_icon.svg',
    patients_icon: '/assets/patients_icon.svg',

    // Icons - Rating
    star: '/assets/rating_star.svg',
    star_blank: '/assets/star_dull_icon.svg',

    // Decorative
    sketch: '/assets/sktech.svg',

    // Social Media Icons
    facebook_icon: '/assets/facebook_icon.svg',
    instagram_icon: '/assets/instagram_icon.svg',
    twitter_icon: '/assets/twitter_icon.svg',

    // Company Logos (for landing page - optional)
    microsoft_logo: '/assets/microsoft_logo.svg',
    walmart_logo: '/assets/walmart_logo.svg',
    accenture_logo: '/assets/accenture_logo.svg',
    adobe_logo: '/assets/adobe_logo.svg',
    paypal_logo: '/assets/paypal_logo.svg',

    // Course/Content Thumbnails (placeholder images)
    course_1_thumbnail: '/assets/course_1.png',
    course_2_thumbnail: '/assets/course_2.png',
    course_3_thumbnail: '/assets/course_3.png',
    course_4_thumbnail: '/assets/course_4.png',
    course_4: '/assets/course_4.png',

    // Profile Images
    profile_img: '/assets/profile_img.png',
    profile_img2: '/assets/profile_img2.png',
    profile_img3: '/assets/profile_img3.png',
    profile_img_1: '/assets/profile_img_1.png',
    profile_img_2: '/assets/profile_img_2.png',
    profile_img_3: '/assets/profile_img_3.png',
};

// Dummy testimonial data for home page
export const dummyTestimonial = [
    {
        name: "Donald Jackman",
        role: "SWE 1 @ Amazon",
        image: "/assets/profile_img_1.png",
        rating: 5,
        feedback:
            "I've been using this LMS for nearly two years, primarily for skill development, and it has been incredibly user-friendly, making my learning much easier.",
    },
    {
        name: "Richard Nelson",
        role: "SWE 2 @ Samsung",
        image: "/assets/profile_img_2.png",
        rating: 4,
        feedback:
            "I've been using this LMS for nearly two years, primarily for skill development, and it has been incredibly user-friendly, making my learning much easier.",
    },
    {
        name: "James Washington",
        role: "SWE 2 @ Google",
        image: "/assets/profile_img_3.png",
        rating: 4.5,
        feedback:
            "I've been using this LMS for nearly two years, primarily for skill development, and it has been incredibly user-friendly, making my learning much easier.",
    },
];

// Dummy course data for home page display
export const dummyCourses = [
    {
        _id: "605c72efb3f1c2b1f8e4e1a1",
        courseTitle: "Introduction to JavaScript",
        courseDescription: "Learn the Basics of JavaScript",
        coursePrice: 49.99,
        discount: 20,
        courseThumbnail: "/assets/course_1.png",
        courseRatings: [{ userId: "user1", rating: 5 }],
        enrolledStudents: ["user1", "user2"],
    },
    {
        _id: "675ac1512100b91a6d9b8b24",
        courseTitle: "Advanced Python Programming",
        courseDescription: "Deep Dive into Python Programming",
        coursePrice: 79.99,
        discount: 15,
        courseThumbnail: "/assets/course_2.png",
        courseRatings: [{ userId: "user1", rating: 5 }],
        enrolledStudents: ["user1", "user2"],
    },
    {
        _id: "605c72efb3f1c2b1f8e4e1a7",
        courseTitle: "Web Development Bootcamp",
        courseDescription: "Become a Full-Stack Web Developer",
        coursePrice: 99.99,
        discount: 25,
        courseThumbnail: "/assets/course_3.png",
        courseRatings: [{ userId: "user1", rating: 4 }, { userId: "user2", rating: 5 }],
        enrolledStudents: ["user1", "user2"],
    },
    {
        _id: "605c72efb3f1c2b1f8e4e1ad",
        courseTitle: "Data Science with Python",
        courseDescription: "Start Your Data Science Journey",
        coursePrice: 89.99,
        discount: 20,
        courseThumbnail: "/assets/course_4.png",
        courseRatings: [{ userId: "user1", rating: 5 }],
        enrolledStudents: ["user1", "user2", "user3"],
    },
];

export default assets;

