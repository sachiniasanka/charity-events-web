"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "@/app/(events)/host-events/host-events.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Spinner from "@/components/ui/Spinner";

const HostEventPage = () => {
    const [formData, setFormData] = useState({
        eventName: "",
        startDate: "",
        endDate: "",
        location: "",
        aboutEvent: "",
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("userToken");

                if (!token) {
                    router.push("/");
                    return;
                }

                if (token) {
                    const userId = jwt.decode(token).id;
                    const userResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const userData = userResponse.data;
                    if (userResponse.status === 200) {
                        setUser(userData);
                    } else {
                        router.push("/");
                        return;
                    }
                }
            } catch (error) {
                router.push("/");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEventImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file is an image and within the size limit (e.g., 5MB)
            if (
                file.type.startsWith("image/") &&
                file.size <= 5 * 1024 * 1024
            ) {
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please upload a valid image file (max size 5MB).");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.eventName ||
            !formData.startDate ||
            !formData.endDate ||
            !formData.location ||
            !formData.aboutEvent
        ) {
            alert("All fields are required.");
            return;
        }

        const formattedStartDate = new Date(formData?.startDate).toISOString();
        const formattedEndDate = new Date(formData?.endDate).toISOString();

        const data = new FormData();
        data.append("eventName", formData?.eventName);
        data.append("startDate", formattedStartDate);
        data.append("endDate", formattedEndDate);
        data.append("location", formData?.location);
        data.append("aboutEvent", formData?.aboutEvent);

        setLoading(true);

        if (image) {
            const imageData = new FormData();
            imageData.append("images", image);

            try {
                const uploadResponse = await axios.post(
                    "${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/upload-images",
                    imageData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // Extract the URL from the response and addit to the event data
                const uploadedFile = uploadResponse.data?.files?.[0];
                if (!uploadedFile || !uploadedFile.url) {
                    throw new Error("Image URL not found in the response.");
                }

                const imageUrl = uploadedFile.url;
                data.append("backgroundImage", imageUrl);

                await submitEventData(data);
            } catch (error) {
                // console.error("Image upload failed:", error.response?.data || error.message);
                alert("Image upload failed.");
                setLoading(false);
            }
        }
    };

    const submitEventData = async (data) => {
        const token = localStorage.getItem("userToken");

        if (!token) {
            alert("User token not found. Please log in.");
            setLoading(false);
            return;
        }
        try {
            const userId = JSON.parse(atob(token.split(".")[1])).id;
            data.append("userId", userId);

            const response = await axios.post(
                "${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/add",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setFormData({
                eventName: "",
                startDate: "",
                endDate: "",
                location: "",
                aboutEvent: "",
            });
            setImage(null);
            setImagePreview(null);
            Swal.fire({
                icon: "success",
                title: "Event Created!",
                text: "Your event has been created successfully.",
                confirmButtonText: "OK",
            });
        } catch (error) {
            // console.error("Error creating event:", error.response?.data || error.message);
            alert("Failed to create event.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <Spinner />;
    }

    return (
        <div className="Host-Events-Page">
            <section className="hero-section w-full max-w-full h-[310px] font-roboto flex justify-center items-center">
                <div
                    className="hero-bg bg-cover w-full h-full"
                    style={{ backgroundImage: "url(/images/GridHero.png)" }}
                >
                    <div className="hero-text-container flex justify-center w-full h-auto">
                        <div className="hero-heading p-5 font-bold text-[56px] leading-[72px] text-center mt-24 text-black w-full max-w-4xl sm-w-3xl">
                            <h1 className="hidden sm:block">
                                Host Your Events
                            </h1>
                            <h1 className="sm:hidden">Add Events</h1>
                        </div>
                    </div>
                    <div className="hero-subheading p-0 font-normal text-xl leading-7 text-center flex justify-center items-center text-gray-600 max-w-4xl mx-auto">
                        <h2>Create Your Own Volunteer Event</h2>
                    </div>
                </div>
            </section>

            <section className="host-events-section w-full max-w-full h-[937px] font-roboto flex justify-center px-4">
                <div className="host-event-upload-container flex justify-center w-full max-w-5xl h-[206px] border rounded-[6px] border-dashed mt-6">
                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center text-gray-600 w-full h-full max-w-full"
                        >
                            <div className="mb-2">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="preview-image w-full h-[206px] object-cover rounded-[6px]"
                                    />
                                ) : (
                                    <img
                                        src="/icons/gallery-import.png"
                                        alt="Upload"
                                        className="upload-icon w-[24px] h-[24px] mt-[68px]"
                                    />
                                )}
                            </div>
                            {!imagePreview && (
                                <div>
                                    <p className="text-[18px] leading-[21px] font-[400] text-gray-500">
                                        Select cover photo
                                    </p>
                                    <p className="text-sm text-gray-500 flex text-wrap gap-[10px] justify-center">
                                        Upload
                                        <img
                                            src="/icons/export.png"
                                            alt="export"
                                            className="camera-icon w-[18px] h-[18px]"
                                        />
                                    </p>
                                </div>
                            )}
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleEventImageUpload}
                            />
                        </label>

                        <div className="host-form-input mt-6 text-[18px] leading-[21px] font-[400] text-gray-500 w-full">
                            <input
                                type="text"
                                name="eventName"
                                placeholder="Event Name"
                                className="w-full border border-gray-300 mb-4 p-2 rounded-[6px]"
                                value={formData.eventName}
                                onChange={handleInputChange}
                            />
                            <input
                                type="datetime-local"
                                name="startDate"
                                placeholder="Start date and time"
                                className="w-full border border-gray-300 mb-4 p-2 rounded-[6px]"
                                value={formData.startDate}
                                onChange={handleInputChange}
                            />
                            <input
                                type="datetime-local"
                                name="endDate"
                                placeholder="End date and time"
                                className="w-full border border-gray-300 mb-4 p-2 rounded-[6px]"
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                className="w-full border border-gray-300 mb-4 p-2 rounded-[6px]"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="aboutEvent"
                                placeholder="About Event"
                                className="w-full border border-gray-300 mb-4 p-2 rounded-[6px]"
                                rows="5"
                                value={formData.aboutEvent}
                                onChange={handleInputChange}
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full h-[54px] bg-greenbutton text-white font-medium rounded-[50px] p-2 text-[18px] leading-[38px] mt-[10px]"
                                disabled={loading}
                            >
                                {loading ? "Creating Event..." : "Create Event"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HostEventPage;
