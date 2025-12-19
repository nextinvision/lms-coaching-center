import React from "react";
import { assets } from "@/lib/assets";
import Image from "next/image";

const Companies = () => {
    return (
        <div className="pt-16">
            <p className="text-base text-gray-500">trusted by learners.</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5">
                <Image
                    src={assets.microsoft_logo}
                    alt="Microsoft"
                    width={112}
                    height={40}
                    className="w-20 md:w-28"
                />
                <Image
                    src={assets.walmart_logo}
                    alt="Walmart"
                    width={112}
                    height={40}
                    className="w-20 md:w-28"
                />
                <Image
                    src={assets.accenture_logo}
                    alt="Accenture"
                    width={112}
                    height={40}
                    className="w-20 md:w-28"
                />
                <Image
                    src={assets.adobe_logo}
                    alt="Adobe"
                    width={112}
                    height={40}
                    className="w-20 md:w-28"
                />
                <Image
                    src={assets.paypal_logo}
                    alt="Paypal"
                    width={112}
                    height={40}
                    className="w-20 md:w-28"
                />
            </div>
        </div>
    );
};

export default Companies;
