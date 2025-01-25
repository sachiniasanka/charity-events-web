"use client";
import { Button } from "@/components/ui/Button";
import { IoHandLeft } from "react-icons/io5";
import { CircleX } from "lucide-react";
import ShareIcon from "@/components/icon/ShareIcon";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useParams } from "next/navigation";
export default function ShareBar({ setRefreshKey }) {
    const [isGoing, setIsGoing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const checkAttendance = async () => {
            const token = localStorage.getItem("userToken");
            try {
                const userId = jwt.decode(token).id;
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data.userId === userId) {
                    setIsHost(true);
                }
                if (response.data.attendUsers?.includes(userId)) {
                    setIsGoing(true);
                }
            } catch (error) {
                console.error("Error checking attendance:", error);
            }
        };

        checkAttendance();
    }, [id]);

    async function handleGoingToggle() {
        try {
            //prev state:isGoing false means user marked it from not attending to attending
            //after clicking next state will be true
            if (!isGoing) {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/${id}/attend`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setIsGoing(true);
                }
            } else {
                const response = await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/${id}/attend`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setIsGoing(false);
                }
            }
        } catch (error) {
            console.error("Error toggling attendance", error);
        }
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <div className="flex px-9 mt-8 gap-5">
            <Button
                onClick={handleGoingToggle}
                variant="outline"
                className={`w-full rounded-3xl py-6 text-lg ${
                    isGoing
                        ? `${
                              isHovering
                                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:text-white"
                                  : "bg-mint-500 border-mint-500 text-white"
                          }`
                        : "bg-white border-mint-500 hover:text-mint-500"
                } border-2`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                disabled={isHost}
            >
                {isGoing && isHovering ? "I'm Out!" : "I'm In!"}
                <IoHandLeft
                    style={{
                        width: "20px",
                        height: "20px",
                        color: isGoing ? "white" : "currentColor",
                        display: isGoing && isHovering ? "none" : "block",
                    }}
                />
                <CircleX
                    style={{
                        width: "20px",
                        height: "20px",
                        color: "white",
                        display: isGoing && isHovering ? "block" : "none",
                    }}
                />
            </Button>
            <Button
                onClick={() => console.log("I'm sharing this event!")}
                variant="outline"
                className="w-2/5 lg:w-full rounded-3xl px-4 py-6 text-lg bg-white border-mint-500 border-2 hover:text-mint-500 shrink"
            >
                Share
                <ShareIcon strokeWidth={2} size={42} />
            </Button>
        </div>
    );
}
