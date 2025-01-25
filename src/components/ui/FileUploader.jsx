"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import UploadIcon from "@/components/icon/UploadIcon";
import axios from "axios";
import Swal from "sweetalert2";

const FileUploader = ({ eventImages = [], event, setRefreshKey }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const MAX_TOTAL_IMAGES = 5;
    const remainingSlots = MAX_TOTAL_IMAGES - eventImages.length;

    //TODO some db commit ACID kind of relationship is needed between image uploading and writing the updated image urls into the mongodb

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            selectedFiles.forEach((fileObj) => {
                if (fileObj.preview) {
                    URL.revokeObjectURL(fileObj.preview);
                }
            });
        };
    }, []);

    const onDrop = useCallback(
        (acceptedFiles) => {
            const availableSlots = remainingSlots - selectedFiles.length;
            if (availableSlots <= 0) {
                setError("Maximum number of images reached");
                return;
            }

            const filesToAdd = acceptedFiles.slice(0, availableSlots);
            const newFiles = filesToAdd.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                uploaded: false,
                error: null,
            }));

            setSelectedFiles((prev) => [...prev, ...newFiles]);
            setError(null);
        },
        [remainingSlots, selectedFiles.length]
    );

    const dropzone = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        disabled: selectedFiles.length >= remainingSlots,
        onDropRejected: (fileRejections) => {
            const errors = fileRejections
                .map(({ errors }) => errors.map((e) => e.message).join(", "))
                .join("; ");
            setError(errors);
        },
    });

    const handleUpload = async () => {
        if (uploading || selectedFiles.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            const unuploadedFiles = selectedFiles.filter(
                (file) => !file.uploaded
            );
            const imageFormData = new FormData();

            // Append new files
            unuploadedFiles.forEach((fileObj) => {
                imageFormData.append("images", fileObj.file);
            });

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

            if (!imageResponse.data?.files) {
                throw new Error("No files returned from server");
            }

            // Mark files as uploaded and get new URLs
            const uploadedUrls = imageResponse.data.files.map(
                (file) => file.url
            );

            const editEvent = {
                eventId: event._id,
                eventName: event.eventName,
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location,
                aboutEvent: event.aboutEvent,
                images: eventImages.concat(uploadedUrls),
                backgroundImage: event.backgroundImage,
            };

            // Update event with new images
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/update`,
                editEvent,
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
                    text: "Upload successfully",
                    icon: "success",
                    confirmButtonColor: "#00B894",
                });
                setRefreshKey((prev) => prev + 1);
            }

            // Clear selected files and notify parent
            setSelectedFiles([]);
        } catch (error) {
            console.error("Upload failed:", error);
            setError(
                error.response?.data?.message ||
                    "Upload failed. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    const removeFile = useCallback((indexToRemove) => {
        setSelectedFiles((prev) => {
            const newFiles = prev.filter((_, index) => index !== indexToRemove);
            URL.revokeObjectURL(prev[indexToRemove].preview);
            return newFiles;
        });
        setError(null);
    }, []);

    return (
        <div className="space-y-4">
            <div
                {...dropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${
                        dropzone.isDragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                    }
                    ${dropzone.disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <input {...dropzone.getInputProps()} />
                <div className="flex flex-col items-center">
                    <UploadIcon />
                    <p className="font-bold text-lg p-3">Upload Media</p>
                    <p>
                        {dropzone.disabled
                            ? `Maximum ${MAX_TOTAL_IMAGES} images allowed`
                            : "Drag & drop images here, or click to select files"}
                    </p>
                    {remainingSlots > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                            {remainingSlots} slot
                            {remainingSlots !== 1 ? "s" : ""} remaining
                        </p>
                    )}
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            {selectedFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedFiles.map((fileObj, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={fileObj.preview}
                                    alt={`Preview ${index + 1}`}
                                    className={`w-full h-32 lg:h-64 object-cover rounded-lg border-2
                                        ${
                                            fileObj.uploaded
                                                ? "border-green-500"
                                                : "border-gray-200"
                                        }
                                    `}
                                />
                                {fileObj.uploaded && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                        Uploaded
                                    </div>
                                )}
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full 
                                             opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    title="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={
                            uploading || selectedFiles.every((f) => f.uploaded)
                        }
                        className="w-full rounded-3xl py-6 text-lg bg-mint-500 hover:bg-mint-700 font-bold 
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
