"use client";
import React, { useEffect, useState } from "react";
import "@/app/(events)/your-events/[id]/edit/edit-event.css";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "@/components/ui/Spinner";

const Page = () => {
    const params = useParams();
    const router = useRouter();

    // Separate loading states
    const [initialLoading, setInitialLoading] = useState(true); // For auth & initial data
    const [updateLoading, setUpdateLoading] = useState(false); // For updates

    const [user, setUser] = useState(null);
    const [event, setEvent] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [formData, setFormData] = useState({});

    // First useEffect for authentication and validation
    useEffect(() => {
        const validateUser = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    router.push("/");
                    return;
                }

                let userId;
                try {
                    userId = jwt.decode(token).id;
                } catch {
                    router.push("/");
                    return;
                }

                const userResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const event = userResponse.data.eventsCreated.find(
                    (event) => event._id === params.id
                );

                if (!event) {
                    router.push("/");
                    return;
                }

                setUser(userResponse.data);
                setEvent(event);
                setStartDate(new Date(event.startDate));
                setEndDate(new Date(event.endDate));
                setImagePreview(event.backgroundImage);
                setFormData({
                    eventId: event._id,
                    eventName: event.eventName,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    location: event.location,
                    aboutEvent: event.aboutEvent,
                    images: event.images,
                    backgroundImage: event.backgroundImage,
                });
            } catch (err) {
                console.error("Error:", err);
                router.push("/");
            }
            setInitialLoading(false);
        };

        validateUser();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            let backgroundImageUrl = formData.backgroundImage;

            if (selectedImage) {
                const imageFormData = new FormData();
                imageFormData.append("images", selectedImage);

                const imageResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/upload-images`,
                    imageFormData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (imageResponse.data.files?.[0]) {
                    backgroundImageUrl = imageResponse.data.files[0].url;
                }
            }

            const eventFormData = {
                ...formData,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                backgroundImage: backgroundImageUrl,
            };

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/update`,
                eventFormData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "userToken"
                        )}`,
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Event updated successfully",
                    icon: "success",
                    confirmButtonColor: "#00B894",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update event",
                icon: "error",
                confirmButtonColor: "#00B894",
            });
            if (error.response?.status === 401) {
                router.push("/login");
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00B894",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (isConfirmed) {
            setUpdateLoading(true);
            try {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/delete`,
                    {
                        data: { eventId: params.id },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                        },
                    }
                );
                await Swal.fire(
                    "Deleted!",
                    "Your event has been deleted.",
                    "success"
                );
                router.push("/your-events");
            } catch (error) {
                await Swal.fire("Error!", "Failed to delete event.", "error");
            } finally {
                setUpdateLoading(false);
            }
        }
    };

    // Show spinner during initial load
    if (initialLoading) {
        return <Spinner />;
    }

    // Don't render anything if validation failed
    if (initialLoading || !user || !event) {
        return null;
    }

    return (
        <div className="edit-events-section font-roboto flex flex-col items-center w-full h-full bg-gray-50 p-7">
            <div className="edit-events-form-section mt-4 w-full max-w-5xl">
                <div className="edit-events-header w-full max-w-5xl mt-16 flex items-start">
                    <h1 className="text-[32px] leading-[37.5px] font-semibold">
                        Edit Event
                    </h1>
                    <Trash2
                        size={40}
                        className="ml-auto cursor-pointer hover:stroke-red-500 w-5 sm:w-10 mt-[-10px] sm:mt-[-4px]"
                        onClick={handleDelete}
                    />
                </div>
                {updateLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="edit-events-form mt-8"
                    >
                        <div className="edit-events-form-image relative w-full h-[616px] border border-gray-300 rounded-[6px] overflow-hidden mb-4">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Event"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-100">
                                    <p className="text-gray-500">
                                        No Image Selected
                                    </p>
                                </div>
                            )}
                            <label
                                htmlFor="file-upload"
                                className="absolute bottom-[16px] right-[16px] px-[12px] py-[6px] gap-1 bg-white text-black border border-gray-300 rounded-[4px] flex items-center shadow-md cursor-pointer"
                            >
                                Upload
                                <img
                                    src="/icons/document-upload.png"
                                    alt="export"
                                    className="doc-icon w-[18px] h-[18px]"
                                />
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <input
                            type="text"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleInputChange}
                            placeholder="Event Name"
                            className="w-full h-[44px] border border-gray-300 mb-4 p-4 rounded-[6px] text-[18px]"
                        />
                        <div className="flex flex-col items-center lg:flex-row lg:justify-around">
                            <div className="flex flex-row items-center gap-5">
                                <p className="text-xs py-5 sm:text-[16px]">
                                    Start Date & Time :
                                </p>
                                <DatePicker
                                    className="mt-2 lg:mt-0 border-2 border-slate-500 rounded-md"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    showTimeSelect
                                    dateFormat="Pp"
                                />
                            </div>
                            <div className="flex flex-row items-center gap-5">
                                <p className="text-xs py-5 sm:text-[16px]">
                                    End Date & Time :
                                </p>
                                <DatePicker
                                    className="mt-2 lg:mt-0 border-2 border-slate-400 rounded-md"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    showTimeSelect
                                    dateFormat="Pp"
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Location"
                            className="w-full h-[44px] border border-gray-300 mb-4 p-3 rounded-[6px] text-[18px]"
                        />
                        <textarea
                            name="aboutEvent"
                            value={formData.aboutEvent}
                            onChange={handleInputChange}
                            placeholder="About Event"
                            className="w-full border border-gray-300 mb-4 p-3 rounded-[6px] text-[18px] text-gray-700"
                            rows="7"
                        ></textarea>
                        <button
                            type="submit"
                            className="edit-events-form-submit w-full bg-greenbutton text-white font-medium rounded-[50px] h-[54px] text-[18px] leading-[21.09px] text-fc p-2 mt-4"
                        >
                            Update Event
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Page;
