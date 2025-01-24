"use client";
import React, { useState } from "react";
import axios from "axios";

const ProfileCard = ({ name, email, profileImage }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editProfileImage, setEditProfileImage] = useState(null);
    const [tempProfileImage, setTempProfileImage] = useState(null);
    const [savedProfileImage, setSavedProfileImage] = useState(profileImage);

    const handleEditClick = () => {
        if (isEditMode) {
            setTempProfileImage(editProfileImage);
        }
        setIsEditMode(!isEditMode);
    };

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    const maxSize = 200;
                    const width = img.width > maxSize ? maxSize : img.width;
                    const height = (img.height / img.width) * width;

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
                };
                img.src = e.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resizedBlob = await resizeImage(file);
                const resizedFile = new File([resizedBlob], file.name, {
                    type: file.type,
                });

                setTempProfileImage(URL.createObjectURL(resizedFile));

                const formData = new FormData();
                formData.append("profileImage", resizedFile);

                const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/profile`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                        },
                    }
                );

                const { profileImage } = response.data.user;

                if (profileImage) {
                    setSavedProfileImage(profileImage);
                } else {
                    throw new Error("Profile image upload failed.");
                }
            } catch (error) {
                console.error("Error handling image change:", error);
            }
        }
    };

    const handleSaveClick = async () => {
        if (!savedProfileImage) return;

        try {
            const formData = new FormData();
            formData.append("profileImage", savedProfileImage);

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "userToken"
                        )}`,
                    },
                }
            );

            const { profileImage } = response.data.user;
            if (profileImage) {
                setSavedProfileImage(profileImage);
            } else {
                throw new Error("Profile image save failed.");
            }

            setIsEditMode(false);
        } catch (error) {
            console.error("Error saving profile image:", error);
        }
        window.location.reload();
    };

    const handleLogoutClick = () => {
        localStorage.removeItem("userToken");
        window.location.href = "/";
    };

    return (
        <div className="profile-card-container relative flex flex-col items-center w-full max-w-sm md:max-w-md lg:max-w-lg mt-5 border-2 border-gray-300 bg-white font-roboto shadow-md mx-auto">
            <div className="absolute flex justify-center items-center top-5 right-5">
                <div
                    className="edit-icon w-6 h-6 cursor-pointer"
                    onClick={handleEditClick}
                >
                    <img
                        src={isEditMode ? "/icons/X.png" : "/icons/edit.png"}
                        alt="Edit"
                        className="w-6 h-6"
                    />
                </div>
            </div>
            <div className="profile-card-content w-full mt-2 px-4 md:px-6 lg:px-8 flex flex-col items-center">
                {isEditMode ? (
                    <div className="relative">
                        <label
                            htmlFor="profileImage"
                            className="cursor-pointer relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full flex items-center justify-center bg-transparent"
                        >
                            <img
                                src={
                                    tempProfileImage ||
                                    savedProfileImage ||
                                    "/default-profile.png"
                                }
                                alt="Profile"
                                className="absolute w-full h-full object-cover rounded-full z-10"
                            />
                            <div className="profile-image-edit absolute w-full h-full bg-black opacity-50 rounded-full z-20" />
                            <span className="absolute z-30 text-white font-semibold text-sm md:text-base">
                                Click to Change
                            </span>
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                ) : (
                    <>
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-image w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full mx-auto"
                            onError={(e) =>
                                (e.target.src = "/images/Frame 12.jpg")
                            }
                        />
                        <h2 className="profile-name text-lg md:text-xl lg:text-2xl font-medium text-black mt-4">
                            {name}
                        </h2>
                        <p className="profile-email text-sm md:text-base lg:text-lg text-gray-600 mt-2">
                            {email}
                        </p>
                    </>
                )}
                <button
                    onClick={isEditMode ? handleSaveClick : handleLogoutClick}
                    className={`profile-logout ${
                        isEditMode ? "bg-green-500" : "bg-red-500"
                    } mt-4 w-32 md:w-36 lg:w-40 h-12 text-white text-sm md:text-base font-semibold rounded-full mb-6`}
                >
                    {isEditMode ? "Save" : "Logout"}
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
