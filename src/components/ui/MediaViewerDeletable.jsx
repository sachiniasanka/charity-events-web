"use client";
import React, { useState, useEffect } from "react";
import NoMediaIcon from "@/components/icon/NoMediaIcon";
import { useParams } from "next/navigation";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const MediaViewerDeletable = ({ eventImages, setEventImages, event }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();

    //useEffect to verify user
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const eventData = response.data;
                setEventImages(eventData.images);
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, []);

    const openImage = (image) => setSelectedImage(image);
    const closeModal = () => setSelectedImage(null);

    //remove images from the images array
    const handleRemoveFile = (index) => {
        Swal.fire({
            title: "Are You Sure?",
            text: "This image will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00B894",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const newImages = eventImages.filter((_, i) => i !== index);

                    const updatedEventData = {
                        eventId: event._id,
                        eventName: event.eventName,
                        startDate: event.startDate,
                        endDate: event.endDate,
                        location: event.location,
                        aboutEvent: event.aboutEvent,
                        images: newImages,
                        backgroundImage: event.backgroundImage,
                    };

                    const response = await axios.put(
                        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/update`,
                        updatedEventData,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "userToken"
                                )}`,
                            },
                        }
                    );

                    if (response.status === 200) {
                        setEventImages(newImages);

                        Swal.fire({
                            title: "Success!",
                            text: "Image deleted successfully",
                            icon: "success",
                            timer: 1500,
                        });
                    }
                } catch (error) {
                    console.error("Error deleting image:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete image",
                        icon: "error",
                    });
                }
            }
        });
    };

    return (
        <>
            {" "}
            {isLoading && (
                <div className="inset-0 flex justify-center items-center bg-white">
                    <div className="animate-spin rounded-full h-20 w-20 lg:h-32 lg:w-32 border-b-2 border-mint-500"></div>
                </div>
            )}
            {!isLoading && (
                <>
                    {/* Image Gallery */}
                    {eventImages?.length === 0 && (
                        <div className="p-6 text-center">
                            <div className="flex flex-col items-center ">
                                <NoMediaIcon />
                            </div>
                            <p className="font-bold text-lg p-3">
                                No Media Found
                            </p>
                            <p>
                                Oops! Looks like this event has no media for now
                            </p>
                        </div>
                    )}
                    {eventImages?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                            {/* <div className="grid grid-auto-cols  gap-4 "> */}
                            {eventImages.map((src, index) => (
                                <div key={index} className="relative">
                                    <img
                                        className="w-full h-full max-h-44 object-cover cursor-pointer rounded-lg shadow-md"
                                        src={src}
                                        alt="image preview"
                                        onClick={() => openImage(src)}
                                    />
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full 
                                             opacity-50 hover:opacity-100 transition-opacity duration-200 "
                                        title="Remove image from server"
                                    >
                                        {/* <X size={16} /> */}
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Modal */}
                    {selectedImage && (
                        <div
                            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-slate-900 bg-opacity-90"
                            // onClick={closeModal}
                        >
                            <div className="relative">
                                <img
                                    className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-md"
                                    src={selectedImage}
                                    alt="selected image preview"
                                />
                                <button
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 text-white text-2xl cursor-pointer bg-black rounded-full w-10 h-10 hover:bg-red-500"
                                >
                                    &times; {/* x */}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default MediaViewerDeletable;
