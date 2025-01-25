"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profileRefresh, setProfileRefresh] = useState(0);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("userToken");
            if (token) {
                setIsLoggedIn(true);
                fetchUserData(token);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setIsLoggedIn(false);
                return;
            }
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [profileRefresh]);

    const fetchUserData = async (token) => {
        const userId = JSON.parse(atob(token.split(".")[1])).id;
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserData((prev) => response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setIsLoggedIn(false);
                return;
            }
            console.error(
                "Error fetching user data:",
                error.response?.data || error.message
            );
        }
    };

    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setIsMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
        setUserData(null);
        window.location.href = "/"; // Redirect to home page after logout
    };

    const renderDesktopMenu = () => (
        <div className="hidden md:flex justify-end items-center gap-6">
            {isLoggedIn ? (
                <ul className="nav-links flex items-center gap-6 text-[20px] font-semibold">
                    <li>
                        <a href="/" className="hover:text-greenbutton">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/events" className="hover:text-greenbutton">
                            All Events
                        </a>
                    </li>
                    <li>
                        <a
                            href="/your-events"
                            className="hover:text-greenbutton"
                        >
                            Your Events
                        </a>
                    </li>
                    <li>
                        <a
                            href="/host-events"
                            className="hover:text-greenbutton"
                        >
                            Host Your Events
                        </a>
                    </li>
                    <li className="relative">
                        <button
                            onClick={() => {
                                toggleDropdown();
                                setProfileRefresh((prev) => prev + 1);
                            }}
                            className="flex items-center gap-2"
                        >
                            <img
                                src={
                                    userData?.profileImage ||
                                    "/images/default-profile.png"
                                }
                                alt="Profile"
                                className="w-[40px] h-[40px] rounded-full object-cover"
                            />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
                                <div className="p-2 border-b">
                                    <span className="block text-gray-700 text-lg font-bold px-2 ">
                                        {userData?.fullName}
                                    </span>
                                </div>
                                <ul>
                                    <li>
                                        <a
                                            href={`/profile/${userData?._id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            View Profile
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
            ) : (
                <div className="flex gap-4">
                    <button
                        className="bg-greenbutton text-white rounded-full px-8 py-2 border-white border hover:bg-white hover:text-greenbutton hover:border-greenbutton"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Login
                    </button>
                    <button
                        className="border border-black rounded-full px-6 py-2 hover:bg-greenbutton hover:text-white"
                        onClick={() => (window.location.href = "/signup")}
                    >
                        Sign Up
                    </button>
                </div>
            )}
        </div>
    );

    const renderMobileMenu = () => (
        <div className="absolute z-10 top-0 left-0 w-full h-[300px] bg-greenbutton md:hidden">
            <div className="flex justify-end p-5">
                <button
                    onClick={toggleMobileMenu}
                    className="text-black focus:outline-none"
                >
                    <img
                        src="/icons/menu.png"
                        alt="Menu"
                        className="w-[24px] h-[24px]"
                    />
                </button>
            </div>
            {isLoggedIn ? (
                <ul className="flex flex-col items-start p-4 gap-4 mt-[-35px]">
                    <li>
                        <a
                            href={`/profile/${userData?._id}`}
                            className="flex items-center gap-2"
                        >
                            <img
                                src={
                                    userData?.profileImage ||
                                    "/images/default-profile.png"
                                }
                                alt="Profile"
                                className="w-[40px] h-[40px] rounded-full object-fill"
                            />
                            <span className="text-white font-semibold text-[12px]">
                                {userData?.userName}
                            </span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="/"
                            className="text-white font-semibold text-[12px]"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="/events"
                            className="text-white font-semibold text-[12px]"
                        >
                            All Events
                        </a>
                    </li>
                    <li>
                        <a
                            href="/your-events"
                            className="text-white font-semibold text-[12px]"
                        >
                            Your Events
                        </a>
                    </li>
                    <li>
                        <a
                            href="/host-events"
                            className="text-white font-semibold text-[12px]"
                        >
                            Host Your Events
                        </a>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="text-white font-semibold text-[12px]"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            ) : (
                <div className="flex flex-col items-center p-4 gap-4">
                    <button
                        className="bg-white text-greenbutton rounded-full px-8 py-2 border-white border hover:bg-greenbutton hover:text-white"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Login
                    </button>
                    <button
                        className="border border-white text-white rounded-full px-6 py-2 hover:bg-white hover:text-greenbutton"
                        onClick={() => (window.location.href = "/signup")}
                    >
                        Sign Up
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <nav className="navbar font-roboto flex justify-between items-center p-3 h-[75px] border-b-[1px] border-solid border-[#E5E5E5]">
            <div className="logo">
                <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="w-[50px] h-[50px]"
                />
            </div>
            <div className="md:hidden flex items-center">
                <button
                    onClick={toggleMobileMenu}
                    className="text-black focus:outline-none"
                >
                    <img src="/icons/menu.png" alt="Menu" className="w-6 h-6" />
                </button>
            </div>

            {isMobileMenuOpen
                ? renderMobileMenu()
                : !isLoading && renderDesktopMenu()}
        </nav>
    );
};

export default Navbar;
