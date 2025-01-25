"use client";
import React, { useState, useEffect } from "react";
import NoMediaIcon from "@/components/icon/NoMediaIcon";
import { useParams } from "next/navigation";
import axios from "axios";

const MediaViewer = ({ eventImages, setEventImages }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();

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
                                <img
                                    className="w-full h-full max-h-44 object-cover cursor-pointer rounded-lg shadow-md"
                                    key={index}
                                    src={src}
                                    alt="image preview"
                                    onClick={() => openImage(src)}
                                />
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

export default MediaViewer;
