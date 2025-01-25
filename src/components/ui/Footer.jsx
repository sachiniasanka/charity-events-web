"use client";
import { useState, useEffect } from "react";

const Footer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <footer className="font-roboto footer flex flex-col items-center justify-center p-6 bg-white border-t-[1px] border-gray-300">
            <div className="logo flex flex-col items-center mb-4">
                <img
                    src="/images/logo.png"
                    alt="Givewell Logo"
                    className="w-[80px] h-[100px] md:w-[100px] md:h-[120px]"
                />
            </div>
            <nav className="nav-links flex flex-row md:flex-row gap-4 md:gap-8 mb-4 text-center">
                <a
                    href="/"
                    className="text-black hover:text-greenbutton text-[16px] md:text-[20px] font-medium"
                >
                    Home
                </a>
                <a
                    href={isLoggedIn ? "/events" : "/login"}
                    className="text-black hover:text-greenbutton text-[16px] md:text-[20px] font-medium"
                >
                    All Events
                </a>
                <a
                    href={isLoggedIn ? "/your-events" : "/login"}
                    className="text-black hover:text-greenbutton text-[16px] md:text-[20px] font-medium"
                >
                    Your Events
                </a>
                <a
                    href={isLoggedIn ? "/host-events" : "/login"}
                    className="text-black hover:text-greenbutton text-[16px] md:text-[20px] font-medium"
                >
                    Host Your Events
                </a>
            </nav>
            <p className="text-gray-500 text-xs md:text-sm text-center">
                © {new Date().getFullYear().toString()} Givewell. All Rights
                Reserved.
            </p>
        </footer>
    );
};

export default Footer;
