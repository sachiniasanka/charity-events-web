"use client";
import * as React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import sendIcon from "@/assets/img/send-icon.png";
import axios from "axios";
import Swal from "sweetalert2";

export const CommentWithIcon = React.forwardRef(
    (
        { eventId, setRefreshKey, className, iconSrc, alt, type, ...props },
        ref
    ) => {
        const [comment, setComment] = React.useState("");

        //user should be added as a prop here, then it should be passed down
        // to send button to track down, due to unavailable data it is not added

        const handleCommentSend = async (e) => {
            e.preventDefault();
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/add-comment/${eventId}`,
                    {
                        comment: comment,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setComment("");
                    setRefreshKey((prev) => prev + 1);
                    Swal.fire({
                        icon: "success",
                        title: "Comment added",
                        text: "Your comment has been added successfully!",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } catch (error) {
                console.error("Error while adding comment", error);
            }
        };

        return (
            <div className="relative flex">
                <Input
                    className={cn(
                        "pl-10 pr-12 placeholder:text-gray-500 py-6 rounded-full",
                        className
                    )}
                    placeholder="Add a comment"
                    type={type}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    {...props}
                    ref={ref}
                />
                <button
                    type="submit"
                    onClick={(e) => handleCommentSend(e)}
                    //send button should collect the user and comment then send it
                    // to the backend and update the front end according to the new comments array
                    //consider adding a loading state to load the new comments
                    //consider adding enter button to send the comment
                    className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full hover:bg-mint-600"
                >
                    <Image
                        src={sendIcon}
                        alt="send icon"
                        width={16}
                        height={16}
                        className="object-contain"
                    />
                </button>
            </div>
        );
    }
);

CommentWithIcon.displayName = "CommentWithIcon";
