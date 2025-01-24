"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/user/ProfileCard";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";

const Page = () => {
    const [fullName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [about, setAbout] = useState("");
    const [location, setLocation] = useState("");
    const [mobile, setPhoneNumber] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [profileImage, setProfileImage] = useState("");
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [user, setUser] = useState(null);

    const linkUserId = useParams().id;

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("userToken");

            if (!token) {
                console.error("User token not found in localStorage");
                router.push("/");
                return;
            }

            let userId;
            try {
                userId = JSON.parse(atob(token.split(".")[1])).id;
                if (linkUserId !== userId) {
                    router / push("/");
                }
            } catch (error) {
                router.push("/");
                console.error("Error decoding token", error);
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const userData = response.data;
                if (response.status === 200) {
                    setUser(userData);
                } else {
                    router.push("/");
                    return;
                }

                setName(userData.fullName);
                setEmail(userData.email);
                setAbout(userData.about);
                setLocation(userData.location);
                setPhoneNumber(userData.mobile);
                setProfileImage(userData.profileImage || "");
            } catch (error) {
                router.push("/");
                console.error("Error fetching user data", error);
            }
        };

        fetchUserData();
    }, []);

    const validateInputs = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        if (!about.trim()) newErrors.about = "About is required";
        if (!location.trim()) newErrors.location = "Location is required";
        if (!mobile.trim()) newErrors.mobile = "Phone Number is required";
        if (mobile && !/^\d+$/.test(mobile))
            newErrors.mobile = "Phone Number must be numbers only";
        return newErrors;
    };

    const handleEditClick = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSaveChanges = async () => {
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsEditMode(false);

        const token = localStorage.getItem("userToken");

        if (!token) {
            console.error("User token not found in localStorage");
            return;
        }

        let userId;
        try {
            userId = JSON.parse(atob(token.split(".")[1])).id;
        } catch (error) {
            console.error("Error decoding token", error);
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("about", about);
        formData.append("location", location);
        formData.append("mobile", mobile);
        if (imageFile) {
            formData.append("profileImage", imageFile);
        }

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setProfileImage(response.data.profileImage || "");
        } catch (error) {
            console.error("Error updating profile", error);
        }

        window.location.reload();
    };

    if (!user) {
        return <Spinner />;
    }

    return (
        <div className="profile-settings-section font-roboto w-full h-auto mt-[-50px] bg-cover flex flex-col md:flex-row justify-between items-start gap-6 p-4 md:p-8">
            <div className="profile-card-container w-full md:w-[392px] h-auto md:h-[539px] mt-6 md:mt-[146px] flex-shrink-0">
                <ProfileCard
                    name={fullName}
                    email={email}
                    profileImage={profileImage}
                />
            </div>
            <div className="profile-personal-info-section p-4 md:p-6 rounded-lg bg-white w-full h-auto mt-6 md:mt-[140px] flex flex-col">
                <div className="profile p-info flex items-center justify-between w-full h-[20px]">
                    <h1 className="profile-heading items-start text-lg md:text-[24px] font-semibold ml-[5px]">
                        {isEditMode
                            ? "Edit Personal Information"
                            : "Personal Information"}
                    </h1>
                    <div className="cursor-pointer flex justify-end">
                        <img
                            src={
                                isEditMode ? "/icons/X.png" : "/icons/edit.png"
                            }
                            alt="Edit"
                            className="p-edit-icon w-6 h-6 md:w-[30px] md:h-[30px] items-baseline"
                            onClick={handleEditClick}
                        />
                    </div>
                </div>
                <div className="profile-personal-inputs mt-6 gap-6">
                    <div className="w-full">
                        <label className="text-base md:text-[20px] leading-[23.44px] font-semibold">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 md:h-[44px] mt-2 p-2 border border-gray-300"
                            value={fullName}
                            onChange={(e) => setName(e.target.value)}
                            readOnly={!isEditMode}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">
                                {errors.fullName}
                            </p>
                        )}
                    </div>
                    <div className="w-full mt-3">
                        <label className="text-base md:text-[20px] leading-[23.44px] font-semibold">
                            About
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 md:h-[44px] mt-2 p-2 border border-gray-300"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            readOnly={!isEditMode}
                        />
                        {errors.about && (
                            <p className="text-red-500 text-sm">
                                {errors.about}
                            </p>
                        )}
                    </div>
                    <div className="w-full mt-3">
                        <label className="text-base md:text-[20px] leading-[23.44px] font-semibold">
                            Location
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 md:h-[44px] mt-2 p-2 border border-gray-300"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            readOnly={!isEditMode}
                        />
                        {errors.location && (
                            <p className="text-red-500 text-sm">
                                {errors.location}
                            </p>
                        )}
                    </div>
                    <div className="w-full mt-3">
                        <label className="text-base md:text-[20px] leading-[23.44px] font-semibold">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            className="w-full h-10 md:h-[44px] mt-2 p-2 border border-gray-300"
                            value={mobile}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            readOnly={!isEditMode}
                        />
                        {errors.mobile && (
                            <p className="text-red-500 text-sm">
                                {errors.mobile}
                            </p>
                        )}
                    </div>

                    {isEditMode && (
                        <div className="mt-6 flex justify-start">
                            <button
                                className="bg-white text-black px-6 py-2 w-full md:w-auto text-base md:text-[20px] font-semibold rounded-[50px] border border-secondary hover:bg-greenbutton hover:text-white"
                                onClick={handleSaveChanges}
                            >
                                Save Details
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-lg md:text-[24px] font-semibold mt-6">
                        Change Your Password
                    </h1>
                    <h2 className="text-base md:text-[20px] mt-3">
                        Update your password to keep your account safe. Enter
                        your current password and choose a new one to proceed.
                    </h2>
                    <button
                        className="bg-white text-black px-6 py-2 w-full md:w-[243px] h-10 md:h-[52px] text-base md:text-[20px] font-semibold rounded-[50px] border border-secondary hover:bg-greenbutton hover:text-white mt-6"
                        onClick={() => router.push(`/reset-password`)}
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
